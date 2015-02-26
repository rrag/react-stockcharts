"use strict";
var React = require('react/addons');
var EventCapture = require('../chart/event-capture');
var MouseCoordinates = require('../chart/mouse-coordinates');

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
					currentItem: { value: 0 },
					lastItem: {},
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
		console.log('events updated...', d);
		//this.state.dataStore.get().currentItem.set({value : new Date().getTime()});
		this.forceUpdate();
	},
	dataListener(d) {
		console.log('data updated...', d);
	},
	listen(stores) {
		console.log('begining to listen...', stores.eventStore, stores.dataStore);

		stores.eventStore.on('update', this.eventListener);
		stores.dataStore.get().currentItem.getListener().on('update', this.dataListener);
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
		if (child.type === MouseCoordinates.type) {
			return React.addons.cloneWithProps(child, {
				_show: this.state.eventStore.get().mouseOver.value,
				_mouseXY: this.state.eventStore.get().mouseXY,
				_currentItem: this.state.dataStore.get().currentItem
			});
		}
		return child;
	},
	updatePropsForChart(child) {
		if ("ReStock.Chart" === child.props.namespace) {
			return React.addons.cloneWithProps(child, {
				_mouseXY: this.state.eventStore.get().mouseXY,
				_currentItem: this.state.dataStore.get().currentItem,
				_lastItem: this.state.dataStore.get().currentItem
			});
		}
		return child;
	}
};

module.exports = EventCaptureMixin;
