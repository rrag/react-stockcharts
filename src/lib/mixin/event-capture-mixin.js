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
					overlays: [],
					data: []
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
			this.forceUpdate();
		}.bind(this));
	},
	dataListener(d) {
		// console.log('data updated from ', this.state.dataStore.get().currentItem, ' to ', d);
		requestAnimationFrame(function () {
			this.forceUpdate();
		}.bind(this));
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
		if ("ReStock.TooltipContainer" === child.props.namespace) {
			return React.addons.cloneWithProps(child, {
				_currentItem: this.state.dataStore.get().currentItem
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
					_overlays: this.state.dataStore.get().overlays
				});
			}
		}
		return newChild;
	}
};

module.exports = EventCaptureMixin;
