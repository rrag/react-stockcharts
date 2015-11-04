"use strict";

import React from "react";
import Utils from "./utils/utils";
import PureComponent from "./utils/PureComponent";
import ChartDataUtil from "./utils/ChartDataUtil";
import shallowEqual from "./utils/shallowEqual";
import { DummyTransformer } from "./transforms";

import objectAssign from "object-assign";

var subscriptionCount = 0;

function getLongValue(value) {
	if (value instanceof Date) {
		return value.getTime();
	}
	return value;
}
function deepEquals(arr1, arr2) {
	if (arr1.length === arr2.length) {
		var result = true;
		arr1.forEach((each, i) => {
			result = result && each.transform === arr2[i].transform && each.options === arr2[i].options;
		});
		return result;
	}
	return false;
}

class EventHandler extends PureComponent {
	constructor(props, context) {
		super(props, context);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleZoom = this.handleZoom.bind(this);
		this.handlePanStart = this.handlePanStart.bind(this);
		this.handlePan = this.handlePan.bind(this);
		this.handlePanEnd = this.handlePanEnd.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.deltaXY = this.deltaXY.bind(this);
		this.getCanvasContexts = this.getCanvasContexts.bind(this);
		this.pushCallbackForCanvasDraw = this.pushCallbackForCanvasDraw.bind(this);
		this.getAllCanvasDrawCallback = this.getAllCanvasDrawCallback.bind(this);
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);

		this.subscriptions = [];
		this.canvasDrawCallbackList = [];
		this.panHappened = false;
		// this.secretArray = [];
		this.state = {
			focus: false,
			currentItems: [],
			show: false,
			mouseXY: [0, 0],
			panInProgress: false,
		};
	}
	deltaXY(dxy) {
		if (dxy) {
			this.setState({
				deltaXY: dxy
			});
		} else {
			return this.state.deltaXY;
		}
	}
	getTransformedData(rawData, defaultDataTransform, dataTransform, interval) {
		var i = 0, eachTransform, options = {}, data = rawData;
		var transforms = defaultDataTransform.concat(dataTransform);
		for (i = 0; i < transforms.length; i++) {
			// console.log(transforms[i]);
			eachTransform = transforms[i].transform();
			options = objectAssign({}, options, transforms[i].options);
			options = eachTransform.options(options);
			data = eachTransform(data, interval);
		}
		return {
			data: data,
			options: options
		};
	}
	componentWillMount() {
		// console.log("EventHandler.componentWillMount");
		var { props, context } = this;
		var { initialDisplay, rawData, defaultDataTransform, dataTransform, interval, dimensions } = props;

		var transformedData = this.getTransformedData(rawData, defaultDataTransform, dataTransform, interval);

		var { data, options } = transformedData;

		var dataForInterval = data[interval];
		var mainChart = ChartDataUtil.getMainChart(props.children);
		var beginIndex = Math.max(dataForInterval.length - initialDisplay, 0);
		var plotData = dataForInterval.slice(beginIndex);

		var chartData = ChartDataUtil.getChartData(props, dimensions, plotData, data, options);
		// console.log("componentWillMount", chartData);
		this.setState({
			data: data,
			rawData: rawData,
			options: options,
			plotData: plotData,
			chartData: chartData,
			interval: this.props.interval,
			mainChart: mainChart,
			currentCharts: [mainChart],
			initialRender: true,
		});
	}
	componentWillReceiveProps(nextProps) {

		var { rawData: prevData, dataTransform: prevDataTransform } = this.props;
		var { rawData: nextData, dataTransform: nextDataTransform } = nextProps;
		var { dimensions, initialDisplay, defaultDataTransform, interval: intervalProp } = nextProps;

		var { data, options, interval, chartData, plotData, rawData } = this.state;
		var prevDataForInterval = data[interval];

		var dataChanged = false;
		if (prevData !== nextData || !deepEquals(prevDataTransform, nextDataTransform)) {
			var transformedData = this.getTransformedData(nextData, defaultDataTransform, nextDataTransform, intervalProp);
			data = transformedData.data;
			options = transformedData.options;

			dataChanged = true;
			rawData = nextData;
		}

		var dataForInterval = data[interval];

		var mainChart = ChartDataUtil.getMainChart(nextProps.children);
		var mainChartData = chartData.filter((each) => each.id === mainChart)[0];
		var xScale = mainChartData.plot.scales.xScale;

		var domainL, domainR, startDomain = xScale.domain();
		// console.log(dataPushed, lastItemVisible);

		if (dataChanged) {
			var beginIndex = Math.max(dataForInterval.length - initialDisplay, 0);
			var endIndex = dataForInterval.length;

			plotData = dataForInterval.slice(beginIndex, endIndex);

		} else {

			domainL = startDomain[0];
			domainR = startDomain[1];
		}

		// console.log(plotData[0], plotData[plotData.length - 1]);
		var newChartData = ChartDataUtil.getChartData(nextProps, dimensions, plotData, data, options);

		newChartData = newChartData.map((eachChart) => {
			var plot = ChartDataUtil.getChartPlotFor(eachChart.config, plotData, domainL, domainR);
			return {
				id: eachChart.id,
				config: eachChart.config,
				plot: plot
			};
		});

		var newCurrentItems = ChartDataUtil.getCurrentItems(newChartData, this.state.mouseXY, plotData);

		this.clearBothCanvas(nextProps);
		// console.log("componentWillReceiveProps");

		this.canvasDrawCallbackList = [];
		this.setState({
			rawData: rawData,
			data: data,
			options: options,
			chartData: newChartData,
			plotData: plotData,
			currentItems: newCurrentItems,
			mainChart: mainChart,
			initialRender: false,
			canvases: null,
		});
	}
	pushData(array) {
		if (array === undefined || array === null || array.length === 0) return;

		var { dataTransform, defaultDataTransform, dimensions  } = this.props;
		var { rawData, data, options, interval, chartData, plotData, mainChart } = this.state;

		var newRawData = rawData.concat(array);
		var transformedData = this.getTransformedData(newRawData, defaultDataTransform, dataTransform, interval);

		var prevDataForInterval = data[interval];
		var dataForInterval = transformedData.data[interval];

		var mainChartData = chartData.filter((each) => each.id === mainChart)[0];
		var xAccessor = mainChartData.config.xAccessor;
		var xScale = mainChartData.plot.scales.xScale;

		var deltaPushed = array.length;

		var startDomain = xScale.domain();
		var domainL, domainR;

		var lastItemVisible = plotData[plotData.length - 1] === prevDataForInterval[prevDataForInterval.length - 1];

		var beginIndex, endIndex;
		if (lastItemVisible) {
			/* var left = xAccessor(plotData[deltaPushed]);

			var tick = xScale(xAccessor(plotData[1])) - xScale(xAccessor(plotData[0]));

			// console.log(tick);

			if ((xScale(xAccessor(plotData[0])) - xScale(startDomain[0])) > tick) {
				left = xAccessor(plotData[0]);
			} */

			// beginIndex = Utils.getClosestItemIndexes(dataForInterval, left, xAccessor).left;
			endIndex = dataForInterval.length;
			beginIndex = dataForInterval.length - plotData.length;
		} else {
			// 
			domainL = startDomain[0];
			domainR = startDomain[1];
			var beginIndex = Utils.getClosestItemIndexes(dataForInterval, domainL, xAccessor).left;
			var endIndex = beginIndex + plotData.length;
		}

		var newPlotData = dataForInterval.slice(beginIndex, endIndex);
		// console.log(newPlotData[newPlotData.length - 1]);

		if (lastItemVisible && domainL === undefined) {
			if (startDomain[1] > xAccessor(plotData[plotData.length - 1])) {
				domainL = startDomain[0] + (xAccessor(newPlotData[newPlotData.length - 1]) - xAccessor(plotData[plotData.length - 1]));
				domainR = startDomain[1] + (xAccessor(newPlotData[newPlotData.length - 1]) - xAccessor(plotData[plotData.length - 1]));
			}
		}

		var newChartData = ChartDataUtil.getChartData(this.props, dimensions, newPlotData, transformedData.data, transformedData.options);

		if (domainL === undefined) {
			domainL = xAccessor(newPlotData[0]);
			domainR = xAccessor(newPlotData[newPlotData.length - 1]);
		}

		var l = 2, i = 0, speed = 16;

		var updateState = (L, R) => {
			newChartData = newChartData.map((eachChart) => {
				var plot = ChartDataUtil.getChartPlotFor(eachChart.config, newPlotData, L, R);
				return {
					id: eachChart.id,
					config: eachChart.config,
					plot: plot
				};
			});

			var newCurrentItems = ChartDataUtil.getCurrentItems(newChartData, this.state.mouseXY, newPlotData);

			this.clearBothCanvas(this.props);

			this.canvasDrawCallbackList = [];
			this.setState({
				rawData: newRawData,
				data: transformedData.data,
				options: transformedData.options,
				chartData: newChartData,
				plotData: newPlotData,
				currentItems: newCurrentItems,
				canvases: null,
			});
		};
		if (lastItemVisible) {

			var timeout = setInterval(() => {
				var dxL = (startDomain[0] - domainL) / l;
				var dxR = (startDomain[1] - domainR) / l;

				i++;

				var L = i === l ? domainL : startDomain[0] - dxL * i;
				var R = i === l ? domainR : startDomain[1] - dxR * i;
				// console.log(i, L, domainL, R, domainR);
				// console.log(startDomain[0], domainL, startDomain[0] - dxL * i, i);
				// console.log(startDomain[1], domainR, startDomain[1] - dxR * i, i);

				updateState(L, R);
				if (i === l) clearInterval(timeout);
			}, speed);
		} else {
			this.setState({
				rawData: newRawData,
				data: transformedData.data,
				options: transformedData.options,
				// chartData: newChartData,
				// plotData: newPlotData,
				// currentItems: newCurrentItems,
				// canvases: null,
			});
		}
	}
	alterData(newRawData) {
		if (newRawData === undefined || newRawData === null || newRawData.length === 0) return;

		var { dataTransform, defaultDataTransform, dimensions  } = this.props;
		var { rawData, data, options, interval, chartData, plotData, mainChart } = this.state;

		if (rawData.length !== newRawData.length) {
			console.log(rawData.length, newRawData.length);
			throw Error("Have to update data of same length");
		}

		var transformedData = this.getTransformedData(newRawData, defaultDataTransform, dataTransform, interval);

		var dataForInterval = transformedData.data[interval];

		var mainChartData = chartData.filter((each) => each.id === mainChart)[0];
		var xAccessor = mainChartData.config.xAccessor;
		var xScale = mainChartData.plot.scales.xScale;

		var startDomain = xScale.domain();

		var left = xAccessor(plotData[0]);
		var beginIndex = Utils.getClosestItemIndexes(dataForInterval, left, xAccessor).left;
		var endIndex = beginIndex + plotData.length;

		var newPlotData = dataForInterval.slice(beginIndex, endIndex);

		var newChartData = ChartDataUtil.getChartData(this.props, dimensions, newPlotData, transformedData.data, transformedData.options);

		newChartData = newChartData.map((eachChart) => {
			var plot = ChartDataUtil.getChartPlotFor(eachChart.config, newPlotData, startDomain[0], startDomain[1]);
			return {
				id: eachChart.id,
				config: eachChart.config,
				plot: plot
			};
		});

		var newCurrentItems = ChartDataUtil.getCurrentItems(newChartData, this.state.mouseXY, newPlotData);

		this.clearBothCanvas(this.props);

		// console.log(newPlotData.length);

		this.canvasDrawCallbackList = [];
		this.setState({
			rawData: newRawData,
			data: transformedData.data,
			options: transformedData.options,
			chartData: newChartData,
			plotData: newPlotData,
			currentItems: newCurrentItems,
			canvases: null,
		});

	}
	clearBothCanvas(props) {
		props = props || this.props;
		var canvases = props.canvasContexts();
		if (canvases && canvases.axes) {
			this.clearCanvas([canvases.axes, canvases.mouseCoord, canvases.interactive]);
		}
	}
	clearCanvas(canvasList) {
		// console.log("CLEARING...", canvasList.length)
		canvasList.forEach(each => {
			each.setTransform(1, 0, 0, 1, 0, 0);
			each.clearRect(-1, -1, each.canvas.width + 2, each.canvas.height + 2);
		});
	}
	getChildContext() {
		return {
			plotData: this.state.plotData,
			chartData: this.state.chartData,
			currentItems: this.state.currentItems,
			mainChart: this.state.mainChart,
			show: this.state.show,
			mouseXY: this.state.mouseXY,
			interval: this.state.interval,
			currentCharts: this.state.currentCharts,
			width: this.props.dimensions.width,
			height: this.props.dimensions.height,
			chartCanvasType: this.props.type,
			dateAccessor: this.state.options.dateAccessor,

			margin: this.props.margin,
			dataTransform: this.props.dataTransform,

			callbackForCanvasDraw: this.pushCallbackForCanvasDraw,
			getAllCanvasDrawCallback: this.getAllCanvasDrawCallback,
			subscribe: this.subscribe,
			unsubscribe: this.unsubscribe,
			getCanvasContexts: this.getCanvasContexts,
			onMouseMove: this.handleMouseMove,
			onMouseEnter: this.handleMouseEnter,
			onMouseLeave: this.handleMouseLeave,
			onZoom: this.handleZoom,
			onPanStart: this.handlePanStart,
			onPan: this.handlePan,
			onPanEnd: this.handlePanEnd,
			onFocus: this.handleFocus,
			deltaXY: this.deltaXY,
			panInProgress: this.state.panInProgress,
			focus: this.state.focus
		};
	}
	pushCallbackForCanvasDraw(findThis, replaceWith) {
		var { canvasDrawCallbackList } = this;
		// console.log(findThis, canvasDrawCallbackList.length);
		if (replaceWith) {
			var t = canvasDrawCallbackList.forEach((each, idx) => {
				if (each === findThis) {
					canvasDrawCallbackList[idx] = replaceWith;
				}
			});
		} else {
			canvasDrawCallbackList.push(findThis);
		}
	}
	getAllCanvasDrawCallback() {
		return this.canvasDrawCallbackList;
	}
	subscribe(forChart, eventType, callback) {
		this.subscriptions.push({
			forChart,
			subscriptionId: (subscriptionCount++),
			eventType,
			callback,
		});
	}
	unsubscribe(subscriptionId) {
		console.log(subscriptionId);
	}
	handleMouseMove(mouseXY) {
		var currentCharts = this.state.chartData.filter((chartData) => {
			var top = chartData.config.origin[1];
			var bottom = top + chartData.config.height;
			return (mouseXY[1] > top && mouseXY[1] < bottom);
		}).map((chartData) => chartData.id);
		var currentItems = ChartDataUtil.getCurrentItems(this.state.chartData, mouseXY, this.state.plotData);

		var { chartData } = this.state;

		var contexts = this.getCanvasContexts();

		if (contexts && contexts.mouseCoord) {
			this.clearCanvas([contexts.mouseCoord, contexts.interactive]);
		}

		this.setState({
			mouseXY: mouseXY,
			currentItems: currentItems,
			show: true,
			currentCharts: currentCharts,
		}, () => {
			this.triggerCallback("mousemove");
		});
	}
	getCanvasContexts() {
		// console.log(this.state.canvases, this.props.canvasContexts())
		return this.state.canvases || this.props.canvasContexts();
	}
	handleMouseEnter() {
		// if type === svg remove state.canvases
		// if type !== svg get canvases and set in state if state.canvases is not present already
		var { type, canvasContexts } = this.props;
		var { canvases } = this.state;
		if (type === "svg") {
			canvases = null;
		} else {
			canvases = canvasContexts();
		}
		this.setState({
			show: true,
			canvases: canvases,
		});
	}
	handleMouseLeave() {
		var contexts = this.getCanvasContexts();

		if (contexts && contexts.mouseCoord) {
			this.clearCanvas([contexts.mouseCoord]);
		}

		this.setState({
			show: false
		});
	}
	handleZoom(zoomDirection, mouseXY) {
		// console.log("zoomDirection ", zoomDirection, " mouseXY ", mouseXY);
		var { data, mainChart, chartData, plotData, interval } = this.state;

		var chart = chartData.filter((eachChart) => eachChart.id === mainChart)[0],
			item = ChartDataUtil.getClosestItem(plotData, mouseXY, chart),
			xScale = chart.plot.scales.xScale,
			domain = xScale.domain(),
			centerX = chart.config.xAccessor(item),
			leftX = centerX - domain[0],
			rightX = domain[1] - centerX,
			zoom = Math.pow(1 + Math.abs(zoomDirection) / 2, zoomDirection),
			domainL = (getLongValue(centerX) - ( leftX * zoom)),
			domainR = (getLongValue(centerX) + (rightX * zoom)),
			domainRange = Math.abs(domain[1] - domain[0]),
			fullData = data[interval],
			last = fullData[fullData.length - 1],
			first = fullData[0];

		domainL = Math.max(getLongValue(chart.config.xAccessor(first)) - Math.floor(domainRange / 3), domainL);
		domainR = Math.min(getLongValue(chart.config.xAccessor(last)) + Math.floor(domainRange / 3), domainR);

		var dataToPlot = ChartDataUtil.getDataToPlotForDomain(domainL, domainR, data, chart.config.width, chart.config.xAccessor);
		if (dataToPlot.data.length < 10) return;
		var newChartData = chartData.map((eachChart) => {
			var plot = ChartDataUtil.getChartPlotFor(eachChart.config, dataToPlot.data, domainL, domainR);
			return {
				id: eachChart.id,
				config: eachChart.config,
				plot: plot
			};
		});
		this.clearBothCanvas();

		this.canvasDrawCallbackList = [];
		this.setState({
			chartData: newChartData,
			plotData: dataToPlot.data,
			interval: dataToPlot.interval,
		});
	}

	handlePanStart(panStartDomain, panOrigin) {
		// console.log("panStartDomain - ", panStartDomain, ", panOrigin - ", panOrigin);
		this.setState({
			panInProgress: true,
			panStartDomain: panStartDomain,
			panOrigin: panOrigin,
			focus: true,
		});
		this.panHappened = false;
	}
	panHelper(mousePosition) {
		var { data, mainChart, chartData, interval, panStartDomain, panOrigin } = this.state;

		var chart = chartData.filter((eachChart) => eachChart.id === mainChart)[0],
			domainRange = panStartDomain[1] - panStartDomain[0],
			fullData = data[interval],
			last = fullData[fullData.length - 1],
			first = fullData[0],
			dx = mousePosition[0] - panOrigin[0],
			xAccessor = chart.config.xAccessor;

		// console.log("pan -- mouse move - ", mousePosition, " dragged by ", dx, " pixels");

		var domainStart = getLongValue(panStartDomain[0]) - dx / chart.config.width * domainRange;
		if (domainStart < getLongValue(xAccessor(first)) - Math.floor(domainRange / 3)) {
			domainStart = getLongValue(xAccessor(first)) - Math.floor(domainRange / 3);
		} else {
			domainStart = Math.min(getLongValue(xAccessor(last))
				+ Math.ceil(domainRange / 3), domainStart + domainRange) - domainRange;
		}
		var domainL = domainStart, domainR = domainStart + domainRange;
		if (panStartDomain[0] instanceof Date) {
			domainL = new Date(domainL);
			domainR = new Date(domainR);
		}

		var beginIndex = Utils.getClosestItemIndexes(fullData, domainL, xAccessor).left;
		var endIndex = Utils.getClosestItemIndexes(fullData, domainR, xAccessor).right;

		var filteredData = fullData.slice(beginIndex, endIndex);

		var newChartData = chartData.map((eachChart) => {
			var plot = ChartDataUtil.getChartPlotFor(eachChart.config, filteredData, domainL, domainR);
			return {
				id: eachChart.id,
				config: eachChart.config,
				plot: plot
			};
		});
		var currentItems = ChartDataUtil.getCurrentItems(newChartData, mousePosition, filteredData);

		var currentCharts = newChartData.filter((eachChartData) => {
			var top = eachChartData.config.origin[1];
			var bottom = top + eachChartData.config.height;
			return (mousePosition[1] > top && mousePosition[1] < bottom);
		}).map((eachChartData) => eachChartData.id);
		return {
			plotData: filteredData,
			// show: true,
			mouseXY: mousePosition,
			currentCharts: currentCharts,
			chartData: newChartData,
			currentItems: currentItems,
		};
	}
	getCurrentCanvasContext(canvasList, chartId) {
		var canvasContextList = canvasList.filter((each) => parseInt(each.id, 10) === chartId);
		var canvasContext = canvasContextList.length > 0 ? canvasContextList[0].context : undefined;
		return canvasContext;
	}
	handlePan(mousePosition, startDomain) {
		/* can also use plotData, use this if you want to pan and show only within that data set*/
		if (this.state.panStartDomain === null) {
			this.handlePanStart(startDomain, mousePosition);
		} else {

			this.panHappened = true;
			var state = this.panHelper(mousePosition);
			if (this.props.type !== "svg") {

				var { canvasList, getCanvasContexts, margin } = this.context;
				var { axes: axesCanvasContext, mouseCoord: mouseContext, interactive } = this.getCanvasContexts();
				var { chartData, plotData } = state;
				var { show } = this.state;
				var { canvasDrawCallbackList } = this;

				requestAnimationFrame(() => {
					// this.clearCanvas([axesCanvasContext, mouseContext]);
					// this.clearCanvas([axesCanvasContext, mouseContext]);
					this.clearBothCanvas();

					// console.log(canvasDrawCallbackList.length)

					chartData.forEach(eachChart => {
						canvasDrawCallbackList
							.filter(each => eachChart.id === each.chartId)
							.forEach(each => {
								var { xScale, yScale } = eachChart.plot.scales;

								eachChart.config.overlays
									.filter(eachOverlay => eachOverlay.id === each.seriesId)
									.forEach(eachOverlay => {
										// console.log("Do Stuff here", i);
										var { xAccessor, compareSeries } = eachChart.config;
										var { yAccessor } = eachOverlay;
										// xScale, yScale, plotData
										each.draw(axesCanvasContext, xScale, yScale, plotData);
									});
								if (each.type === "axis") {
									each.draw(axesCanvasContext, eachChart, xScale, yScale);
								}
								if (each.type === "interactive") {
									each.draw(interactive, objectAssign({}, state, { chartData: eachChart }));
								}
							});
					});

					canvasDrawCallbackList
						.filter(each => each.chartId === undefined)
						.filter(each => each.type === "axis")
						.forEach(each => each.draw(axesCanvasContext, chartData));

					canvasDrawCallbackList
						.filter(each => each.type === "mouse")
						.forEach(each => each.draw(mouseContext, show,
							state.mouseXY, state.currentCharts, state.chartData, state.currentItems));

					canvasDrawCallbackList
						.filter(each => each.type === "currentcoordinate")
						.forEach(each => each.draw(mouseContext, show,
							state.mouseXY, state.currentCharts, state.chartData, state.currentItems));

				});
			} else {
				this.setState(state);
			}
		}
	}
	handlePanEnd(mousePosition) {
		this.clearBothCanvas();

		var state = this.panHelper(mousePosition);

		this.canvasDrawCallbackList = [];

		this.setState(objectAssign({}, state, {
			show: this.state.show,
			panInProgress: false,
			panStartDomain: null,
		}), () => {
			if (!this.panHappened) {
				this.triggerCallback("click");
			} else {
				this.triggerCallback("panend");
			}
		});
	}
	triggerCallback(eventType) {
		var callbackList = this.subscriptions.filter(each => each.eventType === eventType);
		callbackList.forEach(each => {
			// console.log(each);
			var { plotData, mouseXY, currentCharts, chartData, currentItems } = this.state;
			var singleChartData = chartData.filter(eachItem => eachItem.id === each.forChart)[0];
			var singleCurrentItem = currentItems.filter(eachItem => eachItem.id === each.forChart)[0];
			each.callback({
				plotData, mouseXY, currentCharts,
				chartData: singleChartData,
				currentItem: singleCurrentItem.data,
			});
		});
	}
	handleFocus(focus) {
		// console.log(focus);
		this.setState({
			focus: focus,
		});
	}
	render() {
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
				})
				: child;
				// React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));

			return newChild;
		});
		return (
			<g>{children}</g>
		);
	}
}

EventHandler.defaultProps = {
	defaultDataTransform: [ { transform: DummyTransformer } ],
};

EventHandler.childContextTypes = {
	plotData: React.PropTypes.array,
	chartData: React.PropTypes.array,
	currentItems: React.PropTypes.array,
	show: React.PropTypes.bool,
	mouseXY: React.PropTypes.array,
	interval: React.PropTypes.string,
	currentCharts: React.PropTypes.array,
	mainChart: React.PropTypes.number,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	chartCanvasType: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	dateAccessor: React.PropTypes.func,

	margin: React.PropTypes.object.isRequired,
	dataTransform: React.PropTypes.array,

	subscribe: React.PropTypes.func,
	unsubscribe: React.PropTypes.func,
	callbackForCanvasDraw: React.PropTypes.func,
	getAllCanvasDrawCallback: React.PropTypes.func,
	getCanvasContexts: React.PropTypes.func,
	onMouseMove: React.PropTypes.func,
	onMouseEnter: React.PropTypes.func,
	onMouseLeave: React.PropTypes.func,
	onZoom: React.PropTypes.func,
	onPanStart: React.PropTypes.func,
	onPan: React.PropTypes.func,
	onPanEnd: React.PropTypes.func,
	panInProgress: React.PropTypes.bool.isRequired,
	focus: React.PropTypes.bool.isRequired,
	onFocus: React.PropTypes.func,
	deltaXY: React.PropTypes.func,
};

export default EventHandler;
