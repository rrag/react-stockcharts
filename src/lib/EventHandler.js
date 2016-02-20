"use strict";

import React from "react";
import objectAssign from "object-assign";

import PureComponent from "./utils/PureComponent";
import Chart from "./Chart";

import { first, last, isDefined, clearCanvas, calculate, getClosestItemIndexes } from "./utils/utils";
import zipper from "./utils/zipper";
import shallowEqual from "./utils/shallowEqual";
import { getNewChartConfig, getChartConfigWithUpdatedYScales, getCurrentCharts, getCurrentItem } from "./utils/ChartDataUtil";
import { getMainChart, getChartData, getChartDataConfig, getClosest, getDataToPlotForDomain, getChartPlotFor } from "./utils/ChartDataUtil";
import { DummyTransformer } from "./transforms";

var subscriptionCount = 0;

function getDataOfLength(fullData, showingInterval, length) {
	if (isDefined(showingInterval)) {
		return fullData[showingInterval].slice(fullData[showingInterval].length - length);
	}
	return fullData.slice(fullData.length - length);
}

function keysChanged(prev, curr) {
	if (Object.keys(prev).length === Object.keys(curr).length) {
		return Object.keys(prev)
			.map(key => ({key, result: prev[key] === curr[key]}))
			.filter(each => !each.result)
			.map(each => each.key);
	}
	return "oops";
}

function getDataBetween(fullData, showingInterval, xAccessor, left, right) {
	var dataForInterval = Array.isArray(fullData) ? fullData : fullData[showingInterval];

	var newLeftIndex = getClosestItemIndexes(dataForInterval, left, xAccessor).right;
	var newRightIndex = getClosestItemIndexes(dataForInterval, right, xAccessor).left;

	var filteredData = dataForInterval.slice(newLeftIndex, newRightIndex + 1);

	return filteredData;
}

function isLastItemVisible(fullData, plotData) {
	if (Array.isArray(fullData)) {
		return last(plotData) === last(fullData);
	}
	var visible = false;
	for (key in fullData) {
		visible = visible || last(fullData[key]) === last(plotData);
	}
	return visible;
}

class EventHandler extends React.Component {
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
		this.setInteractiveState = this.setInteractiveState.bind(this);

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
			receivedProps: 0,
		};
	}
	componentWillMount() {

		var { plotData, fullData, showingInterval, xExtentsCalculator } = this.props;
		var { xScale, xAccessor, dimensions, children, postCalculator } = this.props;

		// console.log(Array.isArray(fullData) ? fullData[60] : fullData);
		plotData = postCalculator(plotData);
		// console.log(last(fullData), last(plotData));

		var chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), plotData);

		this.setState({
			showingInterval,
			xScale: xScale.range([0, dimensions.width]),
			plotData,
			chartConfig,
		});
	}
	componentWillReceiveProps(nextProps) {

		var { plotData, fullData, showingInterval, xExtentsCalculator } = nextProps;
		var { xScale, xAccessor, dimensions, children, postCalculator, dataAltered } = nextProps;

		var reset = !shallowEqual(this.props.plotData, nextProps.plotData);

		// console.log(dimensions);
		// if plotData changed - reset the whole chart
		// else update the fullData from props and xScale from state with range updated to state

		// console.log("reset: ", reset, dimensions.width);
		// console.log(last(this.props.fullData), last(nextProps.fullData));
		var newState;
		if (reset) {
			if (process.env.NODE_ENV !== "production") {
				console.log("DATA VIEW PORT CHANGED - CHART RESET");
			}

			plotData = postCalculator(plotData);

			var chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), plotData);

			newState = {
				showingInterval,
				xScale: xScale.range([0, dimensions.width]),
				plotData,
				chartConfig,
			};
		} else if (dataAltered
				&& isLastItemVisible(this.props.fullData, this.state.plotData)) {

			if (process.env.NODE_ENV !== "production") {
				console.log("DATA CHANGED AND LAST ITEM VISIBLE");
			}
			// if last item was visible, then shift
			var updatedXScale = this.state.xScale.copy().range([0, dimensions.width])

			var [start, end] = this.state.xScale.domain();
			var l = last(isDefined(showingInterval) ? fullData[showingInterval] : fullData);
			if (end >= xAccessor(l)) {
				// get plotData between [start, end] and do not change the domain
				var plotData = getDataBetween(fullData, showingInterval, xAccessor, start, end)
			} else {
				// get plotData between [xAccessor(l) - (end - start), xAccessor(l)] and DO change the domain
				var newEnd = xAccessor(l);
				var newStart = newEnd - (end - start);
				var plotData = getDataBetween(fullData, showingInterval, xAccessor, newStart, newEnd);

				if (updatedXScale.isPolyLinear && updatedXScale.isPolyLinear() && updatedXScale.data) {
					updatedXScale.data(plotData);
				} else {
					updatedXScale.domain(newStart, newEnd);
				}
			}
			// plotData = getDataOfLength(fullData, showingInterval, plotData.length)
			var chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), plotData);

			newState = {
				xScale: updatedXScale,
				chartConfig,
				plotData,
			};
		} else {
			// console.log("TRIVIAL CHANGE");
			// this.state.plotData or plotData
			var chartConfig = getChartConfigWithUpdatedYScales(
				getNewChartConfig(dimensions, children), this.state.plotData);

			newState = {
				xScale: this.state.xScale.copy().range([0, dimensions.width]),
				chartConfig,
			};
		}

		if (!!newState) {
			if (!this.state.panInProgress) {
				this.clearBothCanvas(nextProps);
				this.clearInteractiveCanvas(nextProps);
				this.clearCanvasDrawCallbackList();
			}
			this.setState({
				...newState,
				receivedProps: this.state.receivedProps + 1,
			});
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !(this.state.receivedProps < nextState.receivedProps
					&& this.state.panInProgress)
				&& !(this.state.panInProgress
					&& this.state.show !== nextState.show
					&& this.state.receivedPropsOnPanStart < nextState.receivedProps
					&& this.state.receivedProps === nextState.receivedProps);
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
			setInteractiveState: this.setInteractiveState,
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
		}*/
		this.setState({
			show: true,
		});
	}
	handleMouseMove(mouseXY, inputType, e) {
		var { chartConfig, plotData, xScale } = this.state;
		var { xAccessor } = this.props;

		var currentCharts = getCurrentCharts(chartConfig, mouseXY);

		var currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
		// console.log(currentItem);
		// optimization oportunity do not change currentItem if it is not the same as prev

		// console.log(currentCharts, currentItem);

		var { interactiveState, callbackList } = inputType === "mouse"
			? this.triggerCallback(
				"mousemove",
				objectAssign({}, this.state, { currentItem, currentCharts }),
				this.state.interactiveState,
				e)
			: this.triggerCallback(
				"touch",
				objectAssign({}, this.state, { currentItem, currentCharts }),
				this.state.interactiveState,
				e);

		var contexts = this.getCanvasContexts();
		if (contexts && contexts.mouseCoord) {
			clearCanvas([contexts.mouseCoord]);
			this.clearInteractiveCanvas();
		}
		// console.log(interactiveState === this.state.interactiveState);
		// if (interactiveState !== this.state.interactiveState) this.clearInteractiveCanvas();

		this.setState({
			mouseXY,
			currentItem,
			currentCharts,
			interactiveState,
		});
	}

	handleMouseLeave() {
		var contexts = this.getCanvasContexts();

		this.clearInteractiveCanvas();

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
		var { xAccessor, fullData, interval, dimensions: { width }, xExtentsCalculator, postCalculator } = this.props;

		var item = getCurrentItem(initialXScale, xAccessor, mouseXY, plotData),
			cx = initialXScale(xAccessor(item)),
			c = zoomDirection > 0 ? 2 : 0.5,
			newDomain = initialXScale.range().map(x => cx + (x - cx) * c).map(initialXScale.invert);

		var { plotData, interval: updatedInterval, scale: updatedScale } = xExtentsCalculator
			.data(fullData)
			.width(width)
			.scale(initialXScale)
			.currentInterval(showingInterval)
			.currentDomain(initialXScale.domain())
			.currentPlotData(plotData)
			.interval(interval)(newDomain, xAccessor)

		plotData = postCalculator(plotData);
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
			// panStartDomain: panStartDomain,
			panStartXScale: this.state.xScale,
			panOrigin: panOrigin,
			focus: true,
			deltaXY: dxy, // used in EventCapture
			receivedPropsOnPanStart: this.state.receivedProps,
		});
		this.panHappened = false;
	}
	panHelper(mouseXY) {
		var { panStartXScale: initialXScale, chartConfig: initialChartConfig } = this.state;
		var { showingInterval, panOrigin } = this.state;
		var { xAccessor, dimensions: { width }, fullData, xExtentsCalculator, postCalculator } = this.props;

		var dx = mouseXY[0] - panOrigin[0];

		// console.log(initialXScale.range());
		var newDomain = initialXScale.range().map(x => x - dx).map(initialXScale.invert);

		var { plotData, interval: updatedInterval, scale: updatedScale } = xExtentsCalculator
			.data(fullData)
			.width(width)
			.scale(initialXScale)
			.interval(showingInterval)(newDomain, xAccessor)

		plotData = postCalculator(plotData);
		// console.log(last(plotData));
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
							} else if (each.type !== "interactive") {
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
	drawInteractive({ plotData, chartConfig, xScale }) {
		var { interactive } = this.getCanvasContexts();

		this.canvasDrawCallbackList
			.filter(each => each.type === "interactive")
			.forEach(each => {
				chartConfig
					.filter(eachChart => eachChart.id === each.chartId)
					.forEach(eachChart => {
						each.draw(interactive, { xScale, plotData,  chartConfig: eachChart });
						// console.log("DRAW");
					});
			});
	}
	clearCanvasDrawCallbackList() {
		this.canvasDrawCallbackList = [];
	}
	handlePanEnd(mousePosition, e) {
		var state = this.panHelper(mousePosition);
		// console.log(this.canvasDrawCallbackList.map(d => d.type));

		this.clearCanvasDrawCallbackList();

		var { interactiveState, callbackList } = this.panHappened
			? this.triggerCallback("panend", state, this.state.interactiveState, e)
			: this.triggerCallback("click", state, this.state.interactiveState, e);

		this.clearBothCanvas();
		if (interactiveState !== this.state.interactive) this.clearInteractiveCanvas();

		// console.log(interactiveState[0].interactive);
		this.setState({
			...state,
			show: this.state.show,
			panInProgress: false,
			panStartXScale: null,
			interactiveState,
		}, () => {
			if (!!callbackList) callbackList.forEach(callback => callback());
		});
	}
	setInteractiveState(interactiveState) {
		this.clearInteractiveCanvas();

		this.setState({
			interactiveState,
		});
	}
	triggerCallback(eventType, state, interactiveState, event) {
		var { currentCharts, chartConfig } = state;
		var subscribers = this.subscriptions.filter(each => each.eventType === eventType);
		var delta = subscribers.map(each => {
			var singleChartConfig = chartConfig.filter(eachItem => eachItem.id === each.forChart)[0];
			return {
				callback: each.callback,
				forChart: each.forChart,
				chartConfig: singleChartConfig
			};
		})
		.filter(each => currentCharts.indexOf(each.forChart) >= -1)
		.map(({callback, chartConfig}) => callback({ ...state, chartConfig }, event))
		.filter(each => each !== false);

		// console.log(delta);
		if (delta.length === 0) return { interactiveState };

		var i = 0, j = 0, added = false;
		var newInteractiveState = interactiveState.slice(0);
		var callbackList = [];
		for (i = 0; i < delta.length; i++) {
			var each = delta[i];
			for (j = 0; j < newInteractiveState.length; j++) {
				if (each.id === newInteractiveState[j].id) {
					newInteractiveState[j] = { id: each.id, interactive: each.interactive };
					if (each.callback) callbackList.push(each.callback);
					added = true;
				}
			}
			if (!added) newInteractiveState.push(each);
			added = false;
		}
		return { interactiveState: newInteractiveState, callbackList };
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
	setInteractiveState: React.PropTypes.func,
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
