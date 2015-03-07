"use strict";
var React = require('react/addons');
var EventCapture = require('../event-capture');
var MouseCoordinates = require('../mouse-coordinates');

var Freezer = require('freezer-js');
// Let's create a freezer store

var EventCaptureMixin = {
	componentWillMount() {
		//console.log('EventCaptureMixin.componentWillMount');
		React.Children.forEach(this.props.children, (child) => {
			if ("ReStock.EventCapture" === child.props.namespace) {
				var eventStore = new Freezer({
					mouseXY: [0, 0],
					mouseOver: { value: false },
					inFocus: { value: false },
					zoom: { value : 0 }
				});

				var dataStore  = new Freezer({
					tooltip: {},
					currentMouseXY: [0, 0],
					currentXYValue: [],
					currentItem: { value: 0 },
					lastItem: {},
					firstItem: {},
					overlays: [],
					data: [],
					overlayValues: [],
					updateMode: { immediate : true }
				});
				var stores = { eventStore: eventStore, dataStore: dataStore };
				this.updateStore(stores);

				this.listen(stores);
			}
		}, this);
	},
	updateStore(store) {
		this.unListen();

		var eventStore = store.eventStore === undefined ? this.state.eventStore : store.eventStore;
		var dataStore = store.dataStore === undefined ? this.state.dataStore : store.dataStore;
		var newState = {
				eventStore: eventStore,
				dataStore: dataStore
			}
		this.setState(newState, function() { this.listen(newState) });
	},
	componentWillUnmount() {
		this.unListen();
	},
	unListen() {
		if (this.state.eventStore !== undefined) {
			this.state.eventStore.off('update', this.eventListener);
		}
		if (this.state.dataStore !== undefined) {
			this.state.dataStore.off('update', this.dataListener);
		}
	},
	eventListener(d) {
		//console.log('events updated...', d);
		//this.state.dataStore.get().currentItem.set({value : new Date().getTime()});
		requestAnimationFrame(function () {
			if (this.state.dataStore.get().updateMode.immediate)
				this.forceUpdate();
		}.bind(this));
	},
	dataListener(d) {
		// console.log('data updated from ', this.state.dataStore.get().currentItem, ' to ', d);
		requestAnimationFrame(function () {
			if (this.state.dataStore.get().updateMode.immediate)
				this.forceUpdate();
		}.bind(this));
	},
	componentDidMount() {
		//this.state.dataStore.get().updateMode.set({ immediate: true });
	},
	listen(stores) {
		//console.log('begining to listen...', stores.eventStore, stores.dataStore);

		stores.eventStore.on('update', this.eventListener);
		stores.dataStore.on('update', this.dataListener);
		// stores.dataStore.get().currentItem.getListener().on('update', this.dataListener);
	},
	updatePropsForEventCapture(child) {
		if (child.type === EventCapture.type) {
			return React.addons.cloneWithProps(child, {
				_eventStore: this.state.eventStore
			});
		}
		return child;
	},
	updatePropsForMouseCoordinates(child) {
		if ("ReStock.MouseCoordinates" === child.props.namespace) {
			return React.addons.cloneWithProps(child, {
				_show: this.state.eventStore.get().mouseOver.value,
				_mouseXY: this.state.eventStore.get().mouseXY,
				//_currentValue: this.state.dataStore.get().currentValue.values,
				_currentMouseXY: this.state.dataStore.get().currentMouseXY,
				_currentXYValue: this.state.dataStore.get().currentXYValue
				//_currentItem: this.state.dataStore.get().currentItem
			});
		}
		return child;
	},
	updatePropsForTooltipContainer(child) {
		if ("ReStock.TooltipContainer" === child.props.namespace) {
			return React.addons.cloneWithProps(child, {
				_currentItem: this.state.dataStore.get().currentItem,
				_overlays: this.state.dataStore.get().overlays
			});
		}
		return child;
	},
	updatePropsForEdgeContainer(child) {
		if ("ReStock.EdgeContainer" === child.props.namespace) {
			return React.addons.cloneWithProps(child, {
				_currentItem: this.state.dataStore.get().currentItem,
				_overlays: this.state.dataStore.get().overlays,
				_overlayValues: this.state.dataStore.get().overlayValues,
				_lastItem: this.state.dataStore.get().lastItem,
				_firstItem: this.state.dataStore.get().firstItem
			});
		}
		return child;
	},
	updatePropsForChart(child) {
		var newChild = child;
		if ("ReStock.Chart" === child.props.namespace) {
			if (this.state.eventStore && this.state.dataStore) {
				newChild = React.addons.cloneWithProps(newChild, {
					_showCurrent: this.state.eventStore.get().mouseOver.value,
					_mouseXY: this.state.eventStore.get().mouseXY,
					_currentItem: this.state.dataStore.get().currentItem,
					_currentMouseXY: this.state.dataStore.get().currentMouseXY,
					_currentXYValue: this.state.dataStore.get().currentXYValue,
					_lastItem: this.state.dataStore.get().lastItem,
					_firstItem: this.state.dataStore.get().firstItem,
					_overlays: this.state.dataStore.get().overlays,
					_overlayValues: this.state.dataStore.get().overlayValues,
					_updateMode: this.state.dataStore.get().updateMode
				});
			}
		}
		return newChild;
	}
};

module.exports = EventCaptureMixin;
