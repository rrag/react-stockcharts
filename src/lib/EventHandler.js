"use strict";

import React from "react";
import objectAssign from "object-assign";

import PureComponent from "./utils/PureComponent";
import Chart from "./Chart";

import { first, last, isDefined, clearCanvas, calculate, getClosestItemIndex, getClosestItemIndexes } from "./utils/utils";
import zipper from "./utils/zipper";
import { getNewChartConfig, getChartConfigWithUpdatedYScales, getCurrentCharts, getCurrentItem } from "./utils/ChartDataUtil";
import { getMainChart, getChartData, getChartDataConfig, getClosest, getDataToPlotForDomain, getChartPlotFor } from "./utils/ChartDataUtil";
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

		var { data, showingInterval, xExtentsCalculator, xScale, xAccessor, dimensions, children } = this.props;

		var chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), data);

		this.setState({
			showingInterval,
			xScale,
			plotData: data,
			chartConfig,
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
	handleMouseMove(mouseXY, inputType, e) {
		var { chartConfig, plotData, xScale } = this.state;
		var { xAccessor } = this.props;

		var currentCharts = getCurrentCharts(chartConfig, mouseXY);

		var currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
		// optimization oportunity do not change currentItem if it is not the same as prev

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
		requestAnimationFrame(() => {
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
		})
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
		var { plotData, showingInterval, xScale: initialXScale, chartConfig: initialChartConfig, currentItem } = this.state;
		var { xAccessor, interval, dimensions: { width }, xExtentsCalculator } = this.props;

		var item = getCurrentItem(initialXScale, xAccessor, mouseXY, plotData),
			cx = initialXScale(xAccessor(item)),
			c = zoomDirection > 0 ? 2 : 0.5,
			newDomain = initialXScale.range().map(x => cx + (x - cx) * c).map(initialXScale.invert);

		var { plotData, interval: updatedInterval, scale: updatedScale } = xExtentsCalculator
			.width(width)
			.currentInterval(showingInterval)
			.currentDomain(initialXScale.domain())
			.currentPlotData(plotData)
			.interval(interval)(newDomain, xAccessor)

		var currentItem = getCurrentItem(updatedScale, xAccessor, mouseXY, plotData);
		var chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData);
		var currentCharts = getCurrentCharts(chartConfig, mouseXY);
		this.clearBothCanvas();
		this.clearInteractiveCanvas();

		// console.log(showingInterval, updatedInterval);
		this.clearCanvasDrawCallbackList();
		this.setState({
			xScale: updatedScale,
			showingInterval: updatedInterval,
			plotData,
			mouseXY,
			currentCharts,
			chartConfig,
			currentItem,
		});/**/
	}

	handlePanStart(panStartDomain, panOrigin, dxy) {
		// console.log("panStartDomain - ", panStartDomain, ", panOrigin - ", panOrigin);
		this.setState({
			panInProgress: true,
			panStartDomain: panStartDomain,
			panStartXScale: this.state.xScale,
			panOrigin: panOrigin,
			focus: true,
			deltaXY: dxy
		});
		this.panHappened = false;
	}
	panHelper(mouseXY) {
		var { panStartDomain, showingInterval, panOrigin, panStartXScale: initialXScale, chartConfig: initialChartConfig } = this.state;
		var { xAccessor, dimensions: { width }, xExtentsCalculator } = this.props;

		var domainRange = panStartDomain[1] - panStartDomain[0],
			dx = mouseXY[0] - panOrigin[0];

		var newDomain = initialXScale.range().map(x => x - dx).map(initialXScale.invert);

		var { plotData, interval: updatedInterval, scale: updatedScale } = xExtentsCalculator
			.width(width)
			.interval(showingInterval)(newDomain, xAccessor)

		// console.log(newDomain);

		var currentItem = getCurrentItem(updatedScale, xAccessor, mouseXY, plotData);
		var chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData);
		var currentCharts = getCurrentCharts(chartConfig, mouseXY);

		return {
			xScale: updatedScale,
			plotData,
			mouseXY,
			currentCharts,
			chartConfig,
			currentItem,
		};
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
				var { mouseXY, chartConfig, plotData, currentItem, xScale, currentCharts } = state;
				var { show } = this.state;
				var { canvasDrawCallbackList } = this;

				requestAnimationFrame(() => {
					// this.clearCanvas([axesCanvasContext, mouseContext]);
					// this.clearCanvas([axesCanvasContext, mouseContext]);
					this.clearBothCanvas();
					this.clearInteractiveCanvas();

					// console.log(canvasDrawCallbackList.length)

					chartConfig.forEach(eachChart => {
						canvasDrawCallbackList
							.filter(each => eachChart.id === each.chartId)
							.forEach(each => {
								var { yScale } = eachChart;

								if (each.type === "axis") {
									each.draw(axesCanvasContext, xScale, yScale);
								} else if (each.type === "currentcoordinate") {
									each.draw(mouseContext, show, xScale, yScale, currentItem);
								} else {
									each.draw(axesCanvasContext, xScale, yScale, plotData);
								}
							});

					});
					this.drawInteractive(state);
					canvasDrawCallbackList
						.filter(each => each.chartId === undefined)
						.filter(each => each.type === "axis")
						.forEach(each => each.draw(axesCanvasContext, chartConfig));

					canvasDrawCallbackList
						.filter(each => each.type === "mouse")
						.forEach(each => each.draw(mouseContext, show,
							xScale, mouseXY, currentCharts, chartConfig, currentItem)); 

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
		this.setState({
			...state,
			show: this.state.show,
			panInProgress: false,
			panStartDomain: null,
			panStartXScale: null,
			interactiveState,
		});
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
		return (
			<g>{this.props.children}</g>
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
