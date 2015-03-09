"use strict";
var React = require('react/addons');
var EventCapture = require('../event-capture');
var MouseCoordinates = require('../mouse-coordinates');
var Utils = require('../utils/utils');

var Freezer = require('freezer-js');
// Let's create a freezer store

var EventCaptureMixin = {
	componentWillMount() {
		//console.log('EventCaptureMixin.componentWillMount');
		/*React.Children.forEach(this.props.children, (child) => {
			if ("ReStock.EventCapture" === child.props.namespace) {
				
			}
		}, this);*/
		var eventStore = new Freezer({
			mouseXY: [0, 0],
			mouseOver: { value: false },
			inFocus: { value: false },
			zoom: { value : 0 }
		});

		var chartStore  = new Freezer({
			charts: [],
			/*
			{
				id: 0,
				scales: { xScale: null, yScale: null },
				accessors: { xAccessor: null, yAccessor: null }
				currentItem: {},
				lastItem: {},
				firstItem: {},
				overlays: [
					{
						id: 0,
						....
						...
					}
				],
				overlayValues: [
					{
						id: 0,
						first: {},
						last: {}
					},
					{
						id: 1,
						first: {},
						last: {}
					},
				],
				data: []
			} */
			updateMode: { immediate : false }
		});
		var currentItemStore = new Freezer({
			currentItems: []
		});

		var stores = { eventStore: eventStore, chartStore: chartStore, currentItemStore: currentItemStore };
		// console.log(stores);
		this.setState(stores);

		this.listen(stores);
	},
	updateEventStore(eventStore) {
		this.unListen();

		var newState = {
			eventStore: eventStore,
			chartStore: this.state.chartStore,
			currentItemStore: this.state.currentItemStore
		};
		this.setState(newState, () => { this.listen(newState) });
	},
	componentWillUnmount() {
		this.unListen();
	},
	unListen() {
		if (this.state.eventStore !== undefined) {
			this.state.eventStore.off('update', this.eventListener);
		}
		if (this.state.chartStore !== undefined) {
			this.state.chartStore.off('update', this.dataListener);
		}
	},
	eventListener(d) {
		//console.log('events updated...', d);
		//this.state.chartStore.get().currentItem.set({value : new Date().getTime()});
		if (this.state.chartStore.get().updateMode.immediate) {
			requestAnimationFrame(function () {
				// console.log('************UPDATING NOW**************');
				this.state.chartStore.get().charts.forEach((chart) => {
					this.updateCurrentItemForChart(chart);
				});
				
				this.forceUpdate();
			}.bind(this));
		}
	},
	dataListener(d) {
		// console.log('data updated from ', this.state.chartStore.get().currentItem, ' to ', d);
		if (this.state.chartStore.get().updateMode.immediate) {
			requestAnimationFrame(function () {
				console.log('************UPDATING NOW**************');
				// console.log(this.state.chartStore.get().charts[0].overlays);
				this.forceUpdate();
			}.bind(this));
		}
	},
	componentDidMount() {
		this.state.chartStore.get().updateMode.set({ immediate: true });
	},
	componentDidUpdate() {
		if (! this.state.chartStore.get().updateMode.immediate)
			this.state.chartStore.get().updateMode.set({ immediate: true });
	},
	listen(stores) {
		// console.log('begining to listen...', stores);

		stores.eventStore.on('update', this.eventListener);
		stores.chartStore.on('update', this.dataListener);
		// stores.chartStore.get().currentItem.getListener().on('update', this.dataListener);
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
			var chart = this.getChartForId(child.props.forChart);
			var currentItem = this.getCurrentItemForChart(child.props.forChart);

			return React.addons.cloneWithProps(child, {
				_show: this.state.eventStore.get().mouseOver.value,
				_mouseXY: this.state.eventStore.get().mouseXY,
				_chartData: chart,
				_currentItem: currentItem
			});
		}
		return child;
	},
	updatePropsForTooltipContainer(child) {
		if ("ReStock.TooltipContainer" === child.props.namespace) {
			return React.addons.cloneWithProps(child, {
				_currentItems: this.state.currentItemStore.get().currentItems,
				_charts: this.state.chartStore.get().charts
			});
		}
		return child;
	},
	updatePropsForEdgeContainer(child) {
		if ("ReStock.EdgeContainer" === child.props.namespace) {
			return React.addons.cloneWithProps(child, {
				_currentItems: this.state.currentItemStore.get().currentItems,
				_charts: this.state.chartStore.get().charts
			});
		}
		return child;
	},
	updatePropsForChart(child) {
		var newChild = child;
		if ("ReStock.Chart" === child.props.namespace) {
			if (this.state.eventStore && this.state.chartStore) {
				var chart = this.getChartForId(newChild.props.id);
				newChild = React.addons.cloneWithProps(newChild, {
					_updateMode: this.state.chartStore.get().updateMode,
					_chartData: chart,
					data: this.props.data
				});
			}
		}
		return newChild;
	},
	getChartForId(chartId) {
		var charts = this.state.chartStore.get().charts;
		var filteredCharts = charts.filter((eachChart) => eachChart.id === chartId);
		if (filteredCharts.length > 1) {
			var errorMessage = `multiple charts with the same id ${ chartId } found`;
			console.warn(errorMessage);
			throw new Error(errorMessage);
		}
		if (filteredCharts.length === 0) {
			var chart = {
				id: chartId,
				scales: { xScale: null, yScale: null },
				accessors: { xAccessor: null, yAccessor: null },
				lastItem: {},
				firstItem: {},
				overlays: [],
				overlayValues: []
			};
			charts = charts.push(chart);
			return this.getChartForId(chartId);
		}
		return filteredCharts[0];
	},
	getCurrentItemForChart(chartId) {
		var currentItems = this.state.currentItemStore.get().currentItems;
		var filteredCurrentItems = currentItems.filter((each) => each.id === chartId);
		if (filteredCurrentItems.length > 1) {
			var errorMessage = `multiple filteredCurrentItems with the same id ${ chartId } found`;
			console.warn(errorMessage);
			throw new Error(errorMessage);
		}
		if (filteredCurrentItems.length === 0) {
			var currentItem = {
				id: chartId,
				data: {}
			};
			currentItems = currentItems.push(currentItem);
			return this.getCurrentItemForChart(chartId);
		}
		return filteredCurrentItems[0];
	},
	updateCurrentItemForChart(chartData) {
		var currentItem = this.getCurrentItemForChart(chartData.id);
		var mouseXY = this.state.eventStore.get().mouseXY;

		var xValue = chartData.scales.xScale.invert(mouseXY[0]);
		var item = Utils.getClosestItem(this.props.data, xValue, chartData.accessors.xAccessor);

		currentItem = currentItem.data.reset(item);
		// console.log(currentItem);
	}
};

module.exports = EventCaptureMixin;
