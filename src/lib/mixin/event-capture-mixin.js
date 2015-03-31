"use strict";
var React = require('react/addons');
var EventCapture = require('../event-capture');
var MouseCoordinates = require('../mouse-coordinates');
var Utils = require('../utils/utils');

var Freezer = require('freezer-js');
// Let's create a freezer store
function getLongValue(value) {
	if (value instanceof Date) {
		return value.getTime();
	}
	return value;
}
var EventCaptureMixin = {
	doesContainChart() {
		var children = Array.isArray(this.props.children)
			? this.props.children
			: [this.props.children];

		return children
			.filter((child) => /Chart$/.test(child.props.namespace))
			.length > 0;
	},
	componentWillMount() {
		if (this.doesContainChart()) {
			// console.log('EventCaptureMixin.componentWillMount', this.state);
			var eventStore = new Freezer({
				mouseXY: [0, 0],
				mouseOver: { value: false },
				inFocus: { value: true } // TODO change to false later
			});
			var zoomEventStore = new Freezer({
				zoom: 0
			});
			var chartStore  = new Freezer({
				charts: [],
				updateMode: { immediate : true }
			});

			var passThroughProps = {};
			if (this.isDataDransform && this.isDataDransform()) {
				passThroughProps = this.transformData(this.props);
			}

			var currentItemStore = new Freezer({
				currentItems: [],
				viewPortXRange: [],
				viewPortXDelta: 30
			});
			var fullData, data;
			if (passThroughProps && passThroughProps._stockScale) {
				currentItemStore.get().set({ interval : 'D' });

				fullData = passThroughProps.data[currentItemStore.get().interval];
			} else {
				fullData = this.props.data;
			}
			var data = fullData;

			React.Children.forEach(this.props.children, (child) => {
				if ("ReStock.Chart" === child.props.namespace) {
					var chartProps = child.props;

					var dimensions = this.getDimensions(this.props, chartProps);
					var threshold = dimensions.width / 4;
					if (data.length > threshold) {
						data = data.slice(data.length - threshold);
					}

					//var charts = chartStore.get().charts.push(this.createChartData(child.props.id));
					//var _chartData = charts[charts.length - 1];
					var _chartData = this.getChartDataFor(this.props, chartProps, data, fullData, passThroughProps);
					_chartData.id = child.props.id;
					chartStore.get().charts.push(_chartData);
				}
			});

			var stores = {
					eventStore: eventStore,
					chartStore: chartStore,
					currentItemStore: currentItemStore,
					zoomEventStore: zoomEventStore,
					fullData: fullData,
					data: data,
					passThroughProps: passThroughProps
				};
			// console.log(stores);
			this.setState(stores);
		}
	},
	getEventStore() {
		return this.state.eventStore;
	},
	updateEventStore(eventStore, zoomEventStore) {
		this.unListen();

		var newState = {
			eventStore: eventStore,
			chartStore: this.state.chartStore,
			currentItemStore: this.state.currentItemStore,
			zoomEventStore: zoomEventStore || this.state.zoomEventStore
		};
		this.setState(newState, () => { this.listen(newState) });
	},
	componentWillUnmount() {
		if (this.doesContainChart()) {
			this.unListen();
		}
	},
	unListen() {
		if (this.state.eventStore !== undefined) {
			this.state.eventStore.off('update', this.eventListener);
		}
		if (this.state.chartStore !== undefined) {
			this.state.chartStore.off('update', this.dataListener);
		}
		if (this.state.zoomEventStore !== undefined) {
			this.state.zoomEventStore.off('update', this.zoomEventListener);
		}
	},
	eventListener(d) {
		//console.log('events updated...', d);
		//this.state.chartStore.get().currentItem.set({value : new Date().getTime()});
		if (this.state.chartStore.get().updateMode.immediate) {
			this.state.chartStore.get().charts.forEach((chart) => {
				this.updateCurrentItemForChart(chart);
			});
			if (this.state.eventStore.get().pan) {
				requestAnimationFrame(() => {

					var mainChart = this.state.currentItemStore.get().mainChart;
					var chart = this.getChartForId(mainChart);
					//var domain = chart.scales.xScale.domain();
					var domain = this.state.eventStore.get().dragOriginDomain;
					var domainRange = domain[1] - domain[0];

					// domainRange = domain[1] - domain[0];
					// get width of mainChart
					var last = this.state.fullData[this.state.fullData.length - 1];
					var first = this.state.fullData[0];

					var domainStart = Math.round(getLongValue(domain[0]) - this.state.eventStore.get().dx/chart.width * domainRange)
					if (domainStart < getLongValue(chart.accessors.xAccessor(first)) - Math.floor(domainRange/3)) {
						domainStart = getLongValue(chart.accessors.xAccessor(first)) - Math.floor(domainRange/3)
					} else {
						domainStart = Math.min(getLongValue(chart.accessors.xAccessor(last))
							+ Math.ceil(domainRange/3), domainStart + domainRange) - domainRange;
					}

					/*console.log('pan in progress...', this.state.eventStore.get().dx, domain[0], domainRange
						, new Date(domainStart));*/

					var domainL = domainStart, domainR = domainStart + domainRange
					if (domain[0] instanceof Date) {
						domainL = new Date(domainL);
						domainR = new Date(domainR);
					}

					this.state.currentItemStore.get().viewPortXRange.set([domainL, domainR]);

					var data = this.calculateViewableData();

					// update the viewPortXRange
					// this.state.currentItemStore.get().viewPortXRange

					React.Children.forEach(this.props.children, (child) => {
						if ("ReStock.Chart" === child.props.namespace) {
							var _chartData = this.getChartForId(child.props.id);

							_chartData = this.updateChartDataFor(_chartData, data.data)

							_chartData.scales.xScale.domain([domainL, domainR]);
							//_chartData.scales.xScale.domain(this.state.currentItemStore.get().viewPortXRange);
						}
					})
/*					var thisChart = this.getChartForId(mainChart);
					thisChart = this.updateChartDataFor(thisChart, data)
					thisChart.scales.xScale.domain([domainL, domainR]);
*/					//var newXScale = this.updateXScaleDomain(chart.scales.xScale, [domainL, domainR])

					//chart.scales.set({ xScale: newXScale });

					/*this.setState({
						data: data
					})*/
					this.setState({
						fullData: data.fullData,
						data: data.data
					})
					// this.forceUpdate();
				});
			} else {
				/*requestAnimationFrame(() => {
					this.forceUpdate();
				});*/
				this.forceUpdate();
			}
		}
	},
	componentWillReceiveProps(nextProps) {
		if (this.doesContainChart()) {
			/*console.log('EventCaptureMixin.componentWillReceiveProps');
			console.log('EventCaptureMixin.componentWillReceiveProps');
			console.log('EventCaptureMixin.componentWillReceiveProps');*/

			var passThroughProps;
			if (this.isDataDransform && this.isDataDransform()) {
				passThroughProps = this.transformData(this.props);
			}

			React.Children.forEach(nextProps.children, (child) => {
				if ("ReStock.Chart" === child.props.namespace) {


					var chartProps = child.props;

					var _chartData = this.getChartDataFor(nextProps, chartProps, nextProps.data, nextProps.data, passThroughProps);
					_chartData.id = child.props.id;

					var chartData = this.getChartForId(child.props.id);
					chartData.reset(_chartData);
				}
			})

			//this.calculateViewableData();
		}
	},
	calculateViewableData() {
		var xRange = this.state.currentItemStore.get().viewPortXRange;
		var fullData = this.getFullData();
		var data = this.state.data;

		if (xRange.length > 0) {
			var mainChart = this.state.currentItemStore.get().mainChart,
				chart = this.getChartForId(mainChart);

			var leftX = Utils.getClosestItemIndexes(fullData, xRange[0], chart.accessors.xAccessor);
			var rightX = Utils.getClosestItemIndexes(fullData, xRange[1], chart.accessors.xAccessor);
						console.log('whoa whoa whoa');
			var currentInterval = this.state.currentItemStore.get().interval;
			var filteredData = fullData.slice(leftX.left, rightX.right);
			if (this.state.passThroughProps && this.state.passThroughProps._stockScale && filteredData.length > chart.width / 3) {
				if (this.state.passThroughProps._multiInterval && currentInterval ==='D' ) {
					var interval = 'W';
					this.state.currentItemStore.get().set({ interval : interval });
					fullData = this.state.passThroughProps.data[interval];

					leftX = Utils.getClosestItemIndexes(fullData, xRange[0], chart.accessors.xAccessor);
					rightX = Utils.getClosestItemIndexes(fullData, xRange[1], chart.accessors.xAccessor);
					filteredData = fullData.slice(leftX.left, rightX.right);

				} else if (this.state.passThroughProps._multiInterval && currentInterval ==='W' ) {
					var interval = 'M';
					this.state.currentItemStore.get().set({ interval : interval });
					fullData = this.state.passThroughProps.data[interval];

					leftX = Utils.getClosestItemIndexes(fullData, xRange[0], chart.accessors.xAccessor);
					rightX = Utils.getClosestItemIndexes(fullData, xRange[1], chart.accessors.xAccessor);
					filteredData = fullData.slice(leftX.left, rightX.right);
				} else {
					var l = getLongValue(chart.accessors.xAccessor(this.state.data[0]));
					var r = getLongValue(chart.accessors.xAccessor(this.state.data[this.state.data.length - 1]));
					this.state.currentItemStore.get().set({ viewPortXRange : [l, r] });
					return {
						fullData: fullData,
						data: this.state.data
					};
				}
			} else if (this.state.passThroughProps && this.state.passThroughProps._stockScale
					&& (currentInterval === 'W' || currentInterval === 'M')) {
				// TODO if zoom in, try to go from M to W or W to D if possible
			} else if (filteredData.length / chart.width < .03) {
				var l = getLongValue(chart.accessors.xAccessor(this.state.data[0]));
				var r = getLongValue(chart.accessors.xAccessor(this.state.data[this.state.data.length - 1]));
				this.state.currentItemStore.get().set({ viewPortXRange : [l, r] });

				return {
					fullData: fullData,
					data: this.state.data
				};
			}
			return {
				fullData: fullData,
				data: filteredData
			};
		}
		return {
			fullData: fullData,
			data: data
		}
	},
	zoomEventListener(d) {
		//console.log('events updated...', d);
		//this.state.chartStore.get().currentItem.set({value : new Date().getTime()});
		if (this.state.chartStore.get().updateMode.immediate) {


			var zoomData = this.state.zoomEventStore.get(),
				zoomDir = zoomData.zoom,
				mainChart = this.state.currentItemStore.get().mainChart,
				chart = this.getChartForId(mainChart);

			// console.log('************UPDATING NOW**************- zoomDir = ', zoomDir, mainChart);

			this.updateCurrentItemForChart(chart);

			var item = this.getCurrentItemForChart(mainChart).data,
				domain = chart.scales.xScale.domain(),
				centerX = chart.accessors.xAccessor(item),
				leftX = centerX - domain[0],
				rightX = domain[1] - centerX,
				zoom = Math.pow(1 + Math.abs(zoomDir)/2 , zoomDir),
				domainL = (getLongValue(centerX) - ( leftX * zoom)),
				domainR = (getLongValue(centerX) + (rightX * zoom));

			var domainRange = Math.abs(domain[1] - domain[0]);
			var last = this.state.fullData[this.state.fullData.length - 1];
			var first = this.state.fullData[0];

			domainL = Math.max(getLongValue(chart.accessors.xAccessor(first)) - Math.floor(domainRange/3), domainL)
			domainR = Math.min(getLongValue(chart.accessors.xAccessor(last)) + Math.floor(domainRange/3), domainR)

			if (centerX instanceof Date) {
				domainL = new Date(domainL);
				domainR = new Date(domainR);
			}




			this.state.currentItemStore.get().viewPortXRange.set([domainL, domainR]);

			requestAnimationFrame(() => {
				var data = this.calculateViewableData();
				console.log(domainL, domainR);
				var passThroughProps = this.state.passThroughProps;

				React.Children.forEach(this.props.children, (child) => {
					if ("ReStock.Chart" === child.props.namespace) {
/*


*/
						var _chartData = this.getChartForId(child.props.id);

						_chartData = this.updateChartDataFor(_chartData, data.data)
						_chartData.scales.xScale.domain(this.state.currentItemStore.get().viewPortXRange);
					}
				})


				this.setState({
					fullData: data.fullData,
					data: data.data
				})
			});

			// find mainChart
			// get new domainL & R
			// if (this.props.changeIntervalIfNeeded) is present
			//		call this.props.changeIntervalIfNeeded
			//		if ^ returns false
			//			requestAnimationFrame and send down new data
			//			update currentItem
			//		if true
			//			update currentItem
			// else
			//		requestAnimationFrame and send down new data
			//		update currentItem

		}
	},
	dataListener(d) {
		// console.log('data updated from ', this.state.chartStore.get().currentItem, ' to ', d);
		if (this.state.chartStore.get().updateMode.immediate) {
			requestAnimationFrame(function () {
				// console.log('************UPDATING NOW**************');
				// console.log(this.state.chartStore.get().charts[0].overlays);
				this.forceUpdate();
			}.bind(this));
		}
	},
	componentDidMount() {
		if (this.doesContainChart()) {
			// this.state.chartStore.get().updateMode.set({ immediate: true });
			this.listen(this.state);
		}
	},
	componentDidUpdate() {
		if (this.doesContainChart()) {
			if (! this.state.chartStore.get().updateMode.immediate)
				this.state.chartStore.get().updateMode.set({ immediate: true });
		}
	},
	listen(stores) {
		// console.log('begining to listen...', stores);

		stores.eventStore.on('update', this.eventListener);
		// stores.chartStore.on('update', this.dataListener);
		stores.zoomEventStore.on('update', this.zoomEventListener);
		// stores.chartStore.get().currentItem.getListener().on('update', this.dataListener);
	},
	updatePropsForEventCapture(child) {
		if ("ReStock.EventCapture" === child.props.namespace) {
			// find mainChart and add to zoomeventstores
			if (this.state.currentItemStore.get().mainChart === undefined
				|| this.state.currentItemStore.get().mainChart !== child.props.mainChart) {

				this.state.currentItemStore.get().set({ mainChart: child.props.mainChart });
			}
			return React.addons.cloneWithProps(child, {
				_eventStore: this.state.eventStore,
				_zoomEventStore: this.state.zoomEventStore,
				_chartData: this.getChartForId(child.props.mainChart)
			}); 
		}
		return child;
	},
	updatePropsForCurrentCoordinate(child) {
		if ("ReStock.CurrentCoordinate" === child.props.namespace) {
			var chart = this.getChartForId(child.props.forChart);
			var currentItem = this.getCurrentItemForChart(child.props.forChart);

			return React.addons.cloneWithProps(child, {
				_show: this.state.eventStore.get().mouseOver.value,
				_chartData: chart,
				_currentItem: currentItem
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
				var _chartData = this.getChartForId(newChild.props.id);
				newChild = React.addons.cloneWithProps(newChild, {
					_updateMode: this.state.chartStore.get().updateMode,
					_chartData: _chartData,
					data: this.getData(),
					_pan: this.state.eventStore.get().pan,
					_isMainChart: newChild.props.id === this.state.currentItemStore.get().mainChart/**/
				});
			}
		}
		return newChild;
	},
	getData(range) {
		return this.state.data;
	},
	getFullData() {
		return this.state.fullData;
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
			charts = charts.push(createChartData(chartId));
			return this.getChartForId(chartId);
		}
		return filteredCharts[0];
	},
	createChartData(chartId) {
		var chart = {
				id: chartId,
				scales: { xScale: null, yScale: null },
				accessors: { xAccessor: null, yAccessor: null },
				lastItem: {},
				firstItem: {},
				overlays: [],
				overlayValues: []
			};
		return chart;
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
		if (chartData.scales.xScale === null) {
			console.warn('Verify if the the <Chart id=... > matches with the forChart=... This error likely because a Chart defined with id={%s} is not found', chartData.id);
		}
		var xValue = chartData.scales.xScale.invert(mouseXY[0]);
		var item = Utils.getClosestItem(this.getData(), xValue, chartData.accessors.xAccessor);

		currentItem = currentItem.data.reset(item);
		// console.log(currentItem);
	},
	_renderChildren(children) {
		if (this.doesContainChart()) {
			return React.Children.map(children, (child) => {
				if (typeof child.type === 'string') return child;
				var newChild = child;
				newChild = this.updatePropsForEventCapture(child);
				newChild = this.updatePropsForMouseCoordinates(newChild);
				newChild = this.updatePropsForTooltipContainer(newChild);
				newChild = this.updatePropsForEdgeContainer(newChild);
				newChild = this.updatePropsForChart(newChild);
				newChild = this.updatePropsForCurrentCoordinate(newChild);
				return newChild;
			});
		}
		return children;
	}
};

module.exports = EventCaptureMixin;
