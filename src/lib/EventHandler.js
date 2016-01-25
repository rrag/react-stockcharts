"use strict";

import React from "react";
import objectAssign from "object-assign";
import first from "lodash.first";
import last from "lodash.last";

import PureComponent from "./utils/PureComponent";
import Chart from "./Chart";

import { isDefined, clearCanvas, calculate, getClosestItemIndex, getClosestItemIndexes, isReactVersion13 } from "./utils/utils";
import zipper from "./utils/zipper";
import { getNewChartConfig, getMainChart, getChartData, getChartDataConfig, getClosest, getDataToPlotForDomain, getChartPlotFor, getCurrentItem } from "./utils/ChartDataUtil";
import { DummyTransformer } from "./transforms";

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
		this.handlePinchZoom = this.handlePinchZoom.bind(this);
		this.handlePanStart = this.handlePanStart.bind(this);
		this.handlePan = this.handlePan.bind(this);
		this.handlePanEnd = this.handlePanEnd.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.getCanvasContexts = this.getCanvasContexts.bind(this);
		this.pushCallbackForCanvasDraw = this.pushCallbackForCanvasDraw.bind(this);
		this.getAllCanvasDrawCallback = this.getAllCanvasDrawCallback.bind(this);
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
		this.pinchCoordinates = this.pinchCoordinates.bind(this);

		this.subscriptions = [];
		this.canvasDrawCallbackList = [];
		this.panHappened = false;
		this.state = {
			focus: false,
			currentItem: {},
			show: false,
			mouseXY: [0, 0],
			panInProgress: false,
			interactiveState: [],
			currentCharts: [],
		};
	}
	componentWillMount() {
		// console.log("EventHandler.componentWillMount");
		var { props } = this;
		var { rawData, calculator, interval, dimensions, xScale, xAccessor, xExtents, xDomain, children } = props;
		var { dataPreProcessor } = props;

		var data = calculate(dataPreProcessor, calculator, rawData); // calculate data
		var dataForInterval = Array.isArray(data) ? data : data[interval]; // get data for interval
		// console.log(data, interval);
		// var dataForInterval = data; // get data for interval
		// getXScale
		// calculate xDomain & xRange
		// get yscale and yExtents from all Chart children

		var extents = isDefined(xDomain)
			? xDomain(dataForInterval, xAccessor)
			: d3.extent(xExtents.map(each => each(dataForInterval, xAccessor)));
		// compare extents with prev prop extents, set the xScale.domain only if they are different

		var left = getClosestItemIndexes(dataForInterval, extents[0], xAccessor).right;
		var right = getClosestItemIndexes(dataForInterval, extents[1], xAccessor).left + 1;

		var plotData = dataForInterval.slice(left, right);

		var myXScale = xScale.copy()
			.domain(extents)
			.range([0, dimensions.width]);

		if (myXScale.data && myXScale.isPolyLinear && myXScale.isPolyLinear()) {
			myXScale.data(plotData);
		}
		// var transformedData = this.getTransformedData(rawData, defaultDataTransform, dataTransform, interval);

		var chartConfig = getNewChartConfig(dimensions, children);

		var yDomains = chartConfig
			.map(({ yExtents }) => d3.extent(d3.merge(yExtents.map(eachExtent => d3.extent(plotData, eachExtent)))));

		var combine = zipper()
			.combine((config, domain) => {
				var { padding: { top, bottom }, height, width, yScale } = config;
				// console.log(height, width);
				return { ...config, yScale: yScale.copy().domain(domain).range([height - top, bottom]) };
			})

		var updatedChartConfig = combine(chartConfig, yDomains)
		this.setState({
			data,
			xScale: myXScale,
			rawData,
			plotData,
			extents,
			chartConfig: updatedChartConfig,
		});
	}
	clearBothCanvas(props) {
		props = props || this.props;
		var canvases = props.canvasContexts();
		if (canvases && canvases.axes) {
			// console.log("CLEAR");
			clearCanvas([canvases.axes, canvases.mouseCoord]);
		}
	}
	clearInteractiveCanvas(props) {
		props = props || this.props;
		var canvases = props.canvasContexts();
		if (canvases && canvases.interactive) {
			// console.error("CLEAR");
			clearCanvas([canvases.interactive]);
		}
	}

	getChildContext() {
		return {
			plotData: this.state.plotData,
			chartConfig: this.state.chartConfig,
			currentCharts: this.state.currentCharts,
			currentItem: this.state.currentItem,
			show: this.state.show,
			mouseXY: this.state.mouseXY,
			interval: this.state.interval,
			width: this.props.dimensions.width,
			height: this.props.dimensions.height,
			chartCanvasType: this.props.type,
			xScale: this.state.xScale,
			xAccessor: this.props.xAccessor,

			margin: this.props.margin,
			interactiveState: this.state.interactiveState,

			callbackForCanvasDraw: this.pushCallbackForCanvasDraw,
			getAllCanvasDrawCallback: this.getAllCanvasDrawCallback,
			subscribe: this.subscribe,
			unsubscribe: this.unsubscribe,
			getCanvasContexts: this.getCanvasContexts,
			onMouseMove: this.handleMouseMove,
			onMouseEnter: this.handleMouseEnter,
			onMouseLeave: this.handleMouseLeave,
			onZoom: this.handleZoom,
			onPinchZoom: this.handlePinchZoom,
			onPanStart: this.handlePanStart,
			onPan: this.handlePan,
			onPanEnd: this.handlePanEnd,
			onFocus: this.handleFocus,
			deltaXY: this.state.deltaXY,
			panInProgress: this.state.panInProgress,
			focus: this.state.focus
		};
	}
	pushCallbackForCanvasDraw(findThis, replaceWith) {
		var { canvasDrawCallbackList } = this;
		// console.log(findThis, canvasDrawCallbackList.length);
		if (replaceWith) {
			canvasDrawCallbackList.forEach((each, idx) => {
				if (each === findThis) {
					canvasDrawCallbackList[idx] = replaceWith;
				}
			});
		} else {
			// console.log(findThis);
			canvasDrawCallbackList.push(findThis);
		}
	}
	getAllCanvasDrawCallback() {
		return this.canvasDrawCallbackList;
	}
	subscribe(forChart, eventType, callback) {
		subscriptionCount++;

		this.subscriptions.push({
			forChart,
			subscriptionId: subscriptionCount,
			eventType,
			callback,
		});
		return subscriptionCount;
	}
	unsubscribe(subscriptionId) {
		// console.log(subscriptionId);
		this.subscriptions = this.subscriptions.filter(each => each.subscriptionId === subscriptionId);
	}
	handleMouseMove(mouseXY, inputType, e) {
		var { chartConfig, plotData, xScale } = this.state;
		var { xAccessor } = this.props;

		var currentCharts = chartConfig.filter(eachConfig => {
			var top = eachConfig.origin[1];
			var bottom = top + eachConfig.height;
			return (mouseXY[1] > top && mouseXY[1] < bottom);
		}).map(chartData => chartData.id);

		var currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
		// console.log(currentCharts, currentItem);

		/*var interactiveState = inputType === "mouse"
			? this.triggerCallback(
				"mousemove",
				objectAssign({}, this.state, { currentItems, currentCharts }),
				this.state.interactiveState,
				e)
			: this.triggerCallback(
				"touch",
				objectAssign({}, this.state, { currentItems, currentCharts }),
				this.state.interactiveState,
				e);*/

		var contexts = this.getCanvasContexts();

		if (contexts && contexts.mouseCoord) {
			clearCanvas([contexts.mouseCoord]);
		}
		// console.log(interactiveState === this.state.interactiveState);
		// if (interactiveState !== this.state.interactiveState) this.clearInteractiveCanvas();

		this.setState({
			mouseXY,
			currentItem,
			show: true,
			currentCharts,
			// interactiveState,
		});
	}
	getCanvasContexts() {
		// console.log(this.state.canvases, this.props.canvasContexts())
		return this.state.canvases || this.props.canvasContexts();
	}
	handleMouseEnter() {
		// if type === svg remove state.canvases
		// if type !== svg get canvases and set in state if state.canvases is not present already
		/*var { type, canvasContexts } = this.props;
		var { canvases } = this.state;
		if (type === "svg") {
			canvases = null;
		} else {
			canvases = canvasContexts();
		}
		this.setState({
			show: false,
			canvases: canvases,
		});*/
	}
	handleMouseLeave() {
		var contexts = this.getCanvasContexts();

		if (contexts && contexts.mouseCoord) {
			clearCanvas([contexts.mouseCoord]);
		}

		this.setState({
			show: false
		});
	}
	pinchCoordinates(pinch) {
		var { plotData } = this.state;

		var { mainChartData, touch1Pos, touch2Pos } = pinch;

		var firstX = getLongValue(mainChartData.config.xAccessor(getClosest(plotData, touch1Pos, mainChartData)));
		var secondX = getLongValue(mainChartData.config.xAccessor(getClosest(plotData, touch2Pos, mainChartData)));
		var pinchCoordinate = firstX < secondX ? {
			left: firstX,
			right: secondX,
			leftxy: touch1Pos,
			rightxy: touch2Pos,
		} : {
			left: secondX,
			right: firstX,
			leftxy: touch2Pos,
			rightxy: touch1Pos,
		};
		return pinchCoordinate;
	}
	handlePinchZoom(initialPinch, finalPinch) {
		var { data, chartData } = this.state;
		var { range } = initialPinch;
		var { mainChartData } = finalPinch;

		var initial = this.pinchCoordinates(initialPinch);
		var final = this.pinchCoordinates(finalPinch);

		var left = ((final.leftxy[0] - range[0]) / (final.rightxy[0] - final.leftxy[0])) * (initial.right - initial.left);
		var right = ((range[1] - final.rightxy[0]) / (final.rightxy[0] - final.leftxy[0])) * (initial.right - initial.left);

		var domainL = initial.left - left;
		var domainR = initial.right + right;

		var { width, xAccessor } = mainChartData.config;

		var dataToPlot = getDataToPlotForDomain(domainL, domainR, data, width, xAccessor);

		if (dataToPlot.data.length < 10) return;

		var newChartData = chartData.map((eachChart) => {
			var plot = getChartPlotFor(eachChart.config, eachChart.scaleType, dataToPlot.data, domainL, domainR);
			return {
				id: eachChart.id,
				config: eachChart.config,
				scaleType: eachChart.scaleType,
				plot: plot
			};
		});

		requestAnimationFrame(() => {
			this.clearBothCanvas();
			this.clearInteractiveCanvas();

			this.clearCanvasDrawCallbackList();
			this.setState({
				chartData: newChartData,
				plotData: dataToPlot.data,
				interval: dataToPlot.interval,
			});
		});

		// document.getElementById("debug_here").innerHTML = `${panInProgress}`;

		// document.getElementById("debug_here").innerHTML = `${final.rightxy[0] - final.leftxy[0]} -> ${initial.right - initial.left}`;
		// document.getElementById("debug_here").innerHTML = `${initial.left} - ${initial.right} to ${final.left} - ${final.right}`;
		// document.getElementById("debug_here").innerHTML = `${id[1] - id[0]} = ${initial.left - id[0]} + ${initial.right - initial.left} + ${id[1] - initial.right}`;
		// document.getElementById("debug_here").innerHTML = `${range[1] - range[0]}, ${i1[0]}, ${i2[0]}`;
	}
	handleZoom(zoomDirection, mouseXY) {
		// console.log("zoomDirection ", zoomDirection, " mouseXY ", mouseXY);
		var { data, mainChart, chartData, plotData, interval } = this.state;

		var chart = chartData.filter((eachChart) => eachChart.id === mainChart)[0],
			item = getClosest(plotData, mouseXY, chart),
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

		var dataToPlot = getDataToPlotForDomain(domainL, domainR, data, chart.config.width, chart.config.xAccessor);
		if (dataToPlot.data.length < 10) return;
		var newChartData = chartData.map((eachChart) => {
			var plot = getChartPlotFor(eachChart.config, eachChart.scaleType, dataToPlot.data, domainL, domainR);
			return {
				id: eachChart.id,
				config: eachChart.config,
				scaleType: eachChart.scaleType,
				plot: plot
			};
		});

		var currentItems = getCurrentItems(newChartData, mouseXY, dataToPlot.data);

		this.clearBothCanvas();
		this.clearInteractiveCanvas();

		this.clearCanvasDrawCallbackList();
		this.setState({
			chartData: newChartData,
			plotData: dataToPlot.data,
			interval: dataToPlot.interval,
			currentItems,
		});
	}

	handlePanStart(panStartDomain, panOrigin, dxy) {
		// console.log("panStartDomain - ", panStartDomain, ", panOrigin - ", panOrigin);
		this.setState({
			panInProgress: true,
			panStartDomain: panStartDomain,
			panOrigin: panOrigin,
			focus: true,
			deltaXY: dxy
		});
		this.panHappened = false;
	}
	panHelper(mousePosition) {
		var { data, mainChart, chartData, interval, panStartDomain, panOrigin } = this.state;

		var chart = chartData.filter((eachChart) => eachChart.id === mainChart)[0],
			domainRange = panStartDomain[1] - panStartDomain[0],
			dataForInterval = data[interval],
			last = dataForInterval[dataForInterval.length - 1],
			first = dataForInterval[0],
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

		var beginIndex = getClosestItemIndexes(dataForInterval, domainL, xAccessor).left;
		var endIndex = getClosestItemIndexes(dataForInterval, domainR, xAccessor).right;

		var filteredData = dataForInterval.slice(beginIndex, endIndex);

		var newChartData = chartData.map((eachChart) => {
			var plot = getChartPlotFor(eachChart.config, eachChart.scaleType, filteredData, domainL, domainR);
			return {
				id: eachChart.id,
				config: eachChart.config,
				scaleType: eachChart.scaleType,
				plot: plot
			};
		});
		var currentItems = getCurrentItems(newChartData, mousePosition, filteredData);

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
				var { axes: axesCanvasContext, mouseCoord: mouseContext } = this.getCanvasContexts();
				var { chartData, plotData } = state;
				var { show } = this.state;
				var { canvasDrawCallbackList } = this;

				requestAnimationFrame(() => {
					// this.clearCanvas([axesCanvasContext, mouseContext]);
					// this.clearCanvas([axesCanvasContext, mouseContext]);
					this.clearBothCanvas();
					this.clearInteractiveCanvas();

					// console.log(canvasDrawCallbackList.length)

					chartData.forEach(eachChart => {
						canvasDrawCallbackList
							.filter(each => eachChart.id === each.chartId)
							.forEach(each => {
								var { xScale, yScale } = eachChart.plot.scales;

								var overlayPresent = eachChart.config.overlays
									.filter(eachOverlay => eachOverlay.id === each.seriesId)
									.length > 0;
								// console.log(each);
								if (overlayPresent) {
									each.draw(axesCanvasContext, xScale, yScale, plotData);
								}

								if (each.type === "axis") {
									each.draw(axesCanvasContext, eachChart, xScale, yScale);
								}
							});

					});
					this.drawInteractive(state);
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
	drawInteractive({ plotData, chartData }) {
		var { interactive } = this.getCanvasContexts();

		// console.log(interactive);
		this.canvasDrawCallbackList
			.filter(each => each.type === "interactive")
			.forEach(each => {
				chartData
					.filter(eachChart => eachChart.id === each.chartId)
					.forEach(eachChart => {
						each.draw(interactive, { plotData,  chartData: eachChart });
						// console.log("DRAW");
					});
			});
	}
	clearCanvasDrawCallbackList() {
		this.canvasDrawCallbackList = [];
	}
	handlePanEnd(mousePosition, e) {
		var state = this.panHelper(mousePosition);

		this.clearCanvasDrawCallbackList();

		var interactiveState = this.panHappened
			? this.triggerCallback("panend", state, this.state.interactiveState, e)
			: this.triggerCallback("click", state, this.state.interactiveState, e);

		this.clearBothCanvas();
		if (interactiveState !== this.state.interactive) this.clearInteractiveCanvas();

		// console.log(interactiveState[0].interactive);
		this.setState(objectAssign({}, state, {
			show: this.state.show,
			panInProgress: false,
			panStartDomain: null,
			interactiveState,
		}));
	}
	triggerCallback(eventType, state, interactiveState, event) {
		var { plotData, mouseXY, currentCharts, chartData, currentItems } = state;
		var callbackList = this.subscriptions.filter(each => each.eventType === eventType);
		var delta = callbackList.map(each => {
			// console.log(each);
			var singleChartData = chartData.filter(eachItem => eachItem.id === each.forChart)[0];
			var singleCurrentItem = currentItems.filter(eachItem => eachItem.id === each.forChart)[0];
			return {
				callback: each.callback,
				forChart: each.forChart,
				plotData,
				mouseXY,
				currentCharts,
				currentItem: singleCurrentItem.data,
				chartData: singleChartData
			};
		})
		.filter(each => each.currentCharts.indexOf(each.forChart) >= -1)
		.map(each => each.callback({
			plotData: each.plotData,
			mouseXY: each.mouseXY,
			chartData: each.chartData,
			currentItem: each.currentItem,
		}, event));

		// console.log(delta.length);
		if (delta.length === 0) return interactiveState;

		var i = 0, j = 0, added = false;
		var newInteractiveState = interactiveState.slice(0);
		for (i = 0; i < delta.length; i++) {
			var each = delta[i];
			for (j = 0; j < newInteractiveState.length; j++) {
				if (each.id === newInteractiveState[j].id) {
					newInteractiveState[j] = each;
					added = true;
				}
			}
			if (!added) newInteractiveState.push(each);
			added = false;
		}
		return newInteractiveState;
	}
	handleFocus(focus) {
		// console.log(focus);interactive
		this.setState({
			focus: focus,
		});
	}
	render() {
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref }, child.props));
				})
				: child;

			return newChild;
		});
		return (
			<g>{children}</g>
		);
	}
}

EventHandler.defaultProps = {
	defaultDataTransform: [{ transform: DummyTransformer }],
};

EventHandler.childContextTypes = {
	plotData: React.PropTypes.array,
	chartConfig: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			id: React.PropTypes.number.isRequired,
			origin: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
			padding: React.PropTypes.shape({
				top: React.PropTypes.number,
				bottom: React.PropTypes.number,
			}),
			yExtents: React.PropTypes.arrayOf(React.PropTypes.func).isRequired,
			yScale: React.PropTypes.func.isRequired,
			mouseCoordinates: React.PropTypes.shape({
				at: React.PropTypes.string,
				format: React.PropTypes.func
			}),
			width: React.PropTypes.number.isRequired,
			height: React.PropTypes.number.isRequired,
		})
	).isRequired,
	xScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	currentItem: React.PropTypes.object,
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
	interactiveState: React.PropTypes.array.isRequired,

	subscribe: React.PropTypes.func,
	unsubscribe: React.PropTypes.func,
	callbackForCanvasDraw: React.PropTypes.func,
	getAllCanvasDrawCallback: React.PropTypes.func,
	getCanvasContexts: React.PropTypes.func,
	onMouseMove: React.PropTypes.func,
	onMouseEnter: React.PropTypes.func,
	onMouseLeave: React.PropTypes.func,
	onZoom: React.PropTypes.func,
	onPinchZoom: React.PropTypes.func,
	onPanStart: React.PropTypes.func,
	onPan: React.PropTypes.func,
	onPanEnd: React.PropTypes.func,
	panInProgress: React.PropTypes.bool.isRequired,
	focus: React.PropTypes.bool.isRequired,
	onFocus: React.PropTypes.func,
	deltaXY: React.PropTypes.arrayOf(Number),
};

export default EventHandler;
