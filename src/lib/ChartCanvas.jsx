"use strict";

import React, { PropTypes, Component } from "react";
import { extent as d3Extent, min, max } from "d3-array";

import {
	first,
	last,
	isDefined,
	isNotDefined,
	clearCanvas,
	shallowEqual,
	identity,
	noop,
	functor,
	getLogger,
} from "./utils";

import { getNewChartConfig, getChartConfigWithUpdatedYScales, getCurrentCharts, getCurrentItem } from "./utils/ChartDataUtil";

import EventCapture from "./EventCapture";

import CanvasContainer from "./CanvasContainer";
import evaluator from "./scale/evaluator";

const log = getLogger("ChartCanvas");

const CANDIDATES_FOR_RESET = ["seriesName", /* "data",*/
	"xScaleProvider", /* "xAccessor",*/"map",
	"indexAccessor", "indexMutator"];

function shouldResetChart(thisProps, nextProps) {
	return !CANDIDATES_FOR_RESET.every(key => {
		var result = shallowEqual(thisProps[key], nextProps[key]);
		// console.log(key, result);
		return result;
	});
}

function getCursorStyle(useCrossHairStyleCursor) {
	var style = `
	.react-stockcharts-grabbing-cursor {
		pointer-events: all;
		cursor: -webkit-grabbing;
	}
	.react-stockcharts-crosshair-cursor {
		pointer-events: all;
		cursor: crosshair;
	}
	.react-stockcharts-toottip-hover {
		pointer-events: all;
		cursor: pointer;
	}`;
	var tooltipStyle = `
	.react-stockcharts-avoid-interaction {
		pointer-events: none;
	}
	.react-stockcharts-enable-interaction {
		pointer-events: all;
	}
	.react-stockcharts-toottip {
		pointer-events: all;
		cursor: pointer;
	}
	.react-stockcharts-default-cursor {
		cursor: default;
	}
	.react-stockcharts-move-cursor {
		cursor: move;
	}
	.react-stockcharts-ns-resize-cursor {
		cursor: ns-resize;
	}
	.react-stockcharts-ew-resize-cursor {
		cursor: ew-resize;
	}`;
	return (<style type="text/css">{useCrossHairStyleCursor ? style + tooltipStyle : tooltipStyle}</style>);
}

function getDimensions(props) {
	return {
		height: props.height - props.margin.top - props.margin.bottom,
		width: props.width - props.margin.left - props.margin.right,
	};
}

function getXScaleDirection(flipXScale) {
	return flipXScale ? -1 : 1;
}

function calculateFullData(props) {
	var { data: inputData, calculator, plotFull, xScale: xScaleProp, clamp } = props;
	var { xAccessor: inputXAccesor, map, xScaleProvider, indexAccessor, indexMutator } = props;

	var wholeData = isDefined(plotFull)
			? plotFull
			: inputXAccesor === identity;

	// xScale = discontinuousTimeScaleProvider(data);
	var dimensions = getDimensions(props);
	var evaluate = evaluator()
		// .allowedIntervals(allowedIntervals)
		// .intervalCalculator(intervalCalculator)
		.xAccessor(inputXAccesor)
		// .discontinuous(discontinuous)
		.indexAccessor(indexAccessor)
		.indexMutator(indexMutator)
		.map(map)
		.useWholeData(wholeData)
		.width(dimensions.width)
		.scaleProvider(xScaleProvider)
		.xScale(xScaleProp)
		.clamp(clamp)
		.calculator(calculator);

	var { xAccessor, displayXAccessor, xScale, fullData, filterData } = evaluate(inputData);

	return { xAccessor, displayXAccessor, xScale, fullData, filterData };
}
function resetChart(props, firstCalculation = false) {
	if (process.env.NODE_ENV !== "production") {
		if (!firstCalculation) log("CHART RESET");
	}

	var state = calculateState(props);
	var { plotData: initialPlotData, xScale } = state;
	var { postCalculator, children } = props;

	var plotData = postCalculator(initialPlotData);

	var dimensions = getDimensions(props);
	var chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), plotData, xScale.domain());

	return {
		...state,
		xScale,
		plotData,
		chartConfig,
	};
}

function updateChart(newState, initialXScale, props, lastItemWasVisible) {

	var { fullData, xScale, xAccessor, filterData } = newState;

	var lastItem = last(fullData);
	var [start, end] = initialXScale.domain();

	if (process.env.NODE_ENV !== "production") {
		log("TRIVIAL CHANGE");
	}

	var { postCalculator, children, padding, flipXScale } = props;
	var direction = getXScaleDirection(flipXScale);
	var dimensions = getDimensions(props);

	var updatedXScale = setXRange(xScale, dimensions, padding, direction);

	var initialPlotData;
	if (!lastItemWasVisible || end >= xAccessor(lastItem)) {
		// get plotData between [start, end] and do not change the domain
		initialPlotData = filterData(fullData, [start, end], xAccessor, updatedXScale).plotData;
		updatedXScale.domain([start, end]);
		// console.log("HERE!!!!!", start, end);
	} else if (lastItemWasVisible
			&& end < xAccessor(lastItem)) {

		// get plotData between [xAccessor(l) - (end - start), xAccessor(l)] and DO change the domain
		var dx = initialXScale(xAccessor(lastItem)) - initialXScale.range()[1];
		var [newStart, newEnd] = initialXScale.range().map(x => x + dx).map(initialXScale.invert);

		initialPlotData = filterData(fullData, [newStart, newEnd], xAccessor, updatedXScale).plotData;
		updatedXScale.domain([newStart, newEnd]);
		// if last item was visible, then shift
	}
	// plotData = getDataOfLength(fullData, showingInterval, plotData.length)
	var plotData = postCalculator(initialPlotData);
	let chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), plotData, updatedXScale.domain());

	return {
		xScale: updatedXScale,
		xAccessor,
		chartConfig,
		plotData,
		fullData,
		filterData,
	};
}

function calculateState(props) {

	var { xAccessor: inputXAccesor, xExtents: xExtentsProp, data, padding, flipXScale } = props;

	var direction = getXScaleDirection(flipXScale);
	var dimensions = getDimensions(props);

	var extent = typeof xExtentsProp === "function"
		? xExtentsProp(data)
		: d3Extent(xExtentsProp.map(d => functor(d)).map(each => each(data, inputXAccesor)));

	var { xAccessor, displayXAccessor, xScale, fullData, filterData } = calculateFullData(props);
	var updatedXScale = setXRange(xScale, dimensions, padding, direction);

	var { plotData, domain } = filterData(fullData, extent, inputXAccesor, updatedXScale);

	return {
		plotData,
		xScale: updatedXScale.domain(domain),
		xAccessor,
		displayXAccessor,
		fullData,
		filterData,
	};
}

function setXRange(xScale, dimensions, padding, direction = 1) {
	if (xScale.rangeRoundPoints) {
		if (isNaN(padding)) throw new Error("padding has to be a number for ordinal scale");
		xScale.rangeRoundPoints([0, dimensions.width], padding);
	} else if (xScale.padding) {
		if (isNaN(padding)) throw new Error("padding has to be a number for ordinal scale");
		xScale.range([0, dimensions.width]);
		xScale.padding(padding / 2);
	} else {
		var { left, right } = isNaN(padding)
			? padding
			: { left: padding, right: padding };
		if (direction > 0) {
			xScale.range([left, dimensions.width - right]);
		} else {
			xScale.range([dimensions.width - right, left]);
		}
	}
	return xScale;
}

class ChartCanvas extends Component {
	constructor() {
		super();
		this.getDataInfo = this.getDataInfo.bind(this);
		this.getCanvasContexts = this.getCanvasContexts.bind(this);

		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleZoom = this.handleZoom.bind(this);
		this.handlePinchZoom = this.handlePinchZoom.bind(this);
		this.handlePan = this.handlePan.bind(this);
		this.handlePanEnd = this.handlePanEnd.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		// this.handleFocus = this.handleFocus.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.xAxisZoom = this.xAxisZoom.bind(this);
		this.yAxisZoom = this.yAxisZoom.bind(this);
		this.resetYDomain = this.resetYDomain.bind(this);
		this.calculateStateForDomain = this.calculateStateForDomain.bind(this);
		this.generateSubscriptionId = this.generateSubscriptionId.bind(this);

		this.pinchCoordinates = this.pinchCoordinates.bind(this);

		// this.setInteractiveState = this.setInteractiveState.bind(this);
		// this.getInteractiveState = this.getInteractiveState.bind(this);

		this.subscriptions = [];
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
		// this.canvasDrawCallbackList = [];
		this.interactiveState = [];
		this.panInProgress = false;

		this.state = {};
		this.lastSubscriptionId = 0;
	}
	getDataInfo() {
		return {
			...this.state,
			fullData: this.fullData,
		};
	}
	getCanvasContexts() {
		if (this.refs && this.refs.canvases) {
			return this.refs.canvases.getCanvasContexts();
		}
	}
	generateSubscriptionId() {
		this.lastSubscriptionId++;
		return this.lastSubscriptionId;
	}
	clearBothCanvas() {
		var canvases = this.getCanvasContexts();
		if (canvases && canvases.axes) {
			clearCanvas([canvases.axes, canvases.mouseCoord], this.props.ratio);
		}
	}
	clearMouseCanvas() {
		var canvases = this.getCanvasContexts();
		if (canvases && canvases.mouseCoord) {
			clearCanvas([canvases.mouseCoord], this.props.ratio);
		}
	}
	clearThreeCanvas() {
		var canvases = this.getCanvasContexts();
		if (canvases && canvases.axes) {
			clearCanvas([canvases.axes, canvases.mouseCoord, canvases.bg], this.props.ratio);
		}
	}
	subscribe(id, callback) {
		this.subscriptions = this.subscriptions.concat({
			id, callback
		});
	}
	unsubscribe(id) {
		this.subscriptions = this.subscriptions.filter(each => each.id !== id);
	}
	handleMouseEnter(e) {
		this.triggerEvent("mouseenter", {
			show: true,
		}, e);
	}
	handleMouseMove(mouseXY, inputType, e) {
		var { chartConfig, plotData, xScale, xAccessor } = this.state;

		var currentCharts = getCurrentCharts(chartConfig, mouseXY);

		var currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);

		requestAnimationFrame(() => {
			this.clearMouseCanvas();
			this.triggerEvent("mousemove", {
				show: true,
				mouseXY,
				currentItem,
				currentCharts,
			}, e);
		});
	}
	handleContextMenu(mouseXY, e) {
		var { xAccessor, chartConfig, plotData, xScale } = this.state;

		var currentCharts = getCurrentCharts(chartConfig, mouseXY);
		var currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);

		this.triggerEvent("contextmenu", {
			mouseXY,
			currentItem,
			currentCharts,
		}, e);
	}
	handleMouseLeave(e) {
		this.clearMouseCanvas();
		this.triggerEvent("mouseleave", { show: false }, e);
	}
	pinchCoordinates(pinch) {
		var { touch1Pos, touch2Pos } = pinch;

		return {
			topLeft: [Math.min(touch1Pos[0], touch2Pos[0]), Math.min(touch1Pos[1], touch2Pos[1])],
			bottomRight: [Math.max(touch1Pos[0], touch2Pos[0]), Math.max(touch1Pos[1], touch2Pos[1])]
		};
	}
	handlePinchZoom(initialPinch, finalPinch) {
		var { xScale: initialPinchXScale } = initialPinch;

		var { xScale: initialXScale, chartConfig: initialChartConfig, plotData: initialPlotData, xAccessor } = this.state;
		var { filterData } = this.state;
		var { fullData } = this;
		var { postCalculator } = this.props;

		var { topLeft: iTL, bottomRight: iBR } = this.pinchCoordinates(initialPinch);
		var { topLeft: fTL, bottomRight: fBR } = this.pinchCoordinates(finalPinch);

		var e = initialPinchXScale.range()[1];

		// var fR1 = e - fTL[0];
		// var fR2 = e - fBR[0];
		// var iR1 = e - iTL[0];
		// var iR2 = e - iBR[0];

		var xDash = Math.round(-(iBR[0] * fTL[0] - iTL[0] * fBR[0]) / (iTL[0] - iBR[0]));
		var yDash = Math.round(e + ((e - iBR[0]) * (e - fTL[0]) - (e - iTL[0]) * (e - fBR[0])) / ((e - iTL[0]) - (e - iBR[0])));


		var x = Math.round(-xDash * iTL[0] / (-xDash + fTL[0]));
		var y = Math.round(e - (yDash - e) * (e - iTL[0]) / (yDash + (e - fTL[0])));

		// document.getElementById("debug_here").innerHTML = `**${[s, e]} to ${[xDash, yDash]} to ${[x, y]}`;
		// var left = ((final.leftxy[0] - range[0]) / (final.rightxy[0] - final.leftxy[0])) * (initial.right - initial.left);
		// var right = ((range[1] - final.rightxy[0]) / (final.rightxy[0] - final.leftxy[0])) * (initial.right - initial.left);

		var newDomain = [x, y].map(initialPinchXScale.invert);
		// var domainR = initial.right + right;

		var { plotData, domain } = filterData(fullData,
			newDomain,
			xAccessor,
			initialPinchXScale,
			initialPlotData,
			initialXScale.domain());

		plotData = postCalculator(plotData);
		var updatedScale = initialXScale.copy().domain(domain);

		var chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData, updatedScale.domain());

		requestAnimationFrame(() => {
			this.clearThreeCanvas();
			// this.clearInteractiveCanvas();

			// this.clearCanvasDrawCallbackList();
			this.setState({
				chartConfig,
				xScale: updatedScale,
				plotData,
			});
		});

		// document.getElementById("debug_here").innerHTML = `${panInProgress}`;

		// document.getElementById("debug_here").innerHTML = `${initial.left} - ${initial.right} to ${final.left} - ${final.right}`;
		// document.getElementById("debug_here").innerHTML = `${id[1] - id[0]} = ${initial.left - id[0]} + ${initial.right - initial.left} + ${id[1] - initial.right}`;
		// document.getElementById("debug_here").innerHTML = `${range[1] - range[0]}, ${i1[0]}, ${i2[0]}`;
	}
	handleZoom(zoomDirection, mouseXY, e) {
		// console.log("zoomDirection ", zoomDirection, " mouseXY ", mouseXY);
		var { xAccessor, xScale: initialXScale, plotData: initialPlotData } = this.state;
		var { zoomMultiplier } = this.props;

		var item = getCurrentItem(initialXScale, xAccessor, mouseXY, initialPlotData),
			cx = initialXScale(xAccessor(item)),
			c = zoomDirection > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier,
			newDomain = initialXScale.range().map(x => cx + (x - cx) * c).map(initialXScale.invert);

		var { xScale, plotData, chartConfig } = this.calculateStateForDomain(newDomain);

		var currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
		var currentCharts = getCurrentCharts(chartConfig, mouseXY);
		this.clearBothCanvas();
		// this.clearInteractiveCanvas();

		this.triggerEvent("zoom", {
			mouseXY,
			currentCharts,
			currentItem,
		}, e);

		var { fullData } = this;
		var firstItem = first(fullData);

		var start = first(xScale.domain());
		var end = xAccessor(firstItem);
		var { onLoadMore } = this.props;

		this.setState({
			xScale,
			plotData,
			chartConfig,
		}, () => {
			if (start < end) {
				onLoadMore(start, end);
			}
		});
	}
	calculateStateForDomain(newDomain) {
		var { xAccessor, xScale: initialXScale, chartConfig: initialChartConfig, plotData: initialPlotData } = this.state;
		var { filterData } = this.state;
		var { fullData } = this;
		var { postCalculator } = this.props;

		var { plotData, domain } = filterData(fullData,
			newDomain,
			xAccessor,
			initialXScale,
			initialPlotData,
			initialXScale.domain());

		plotData = postCalculator(plotData);
		var updatedScale = initialXScale.copy().domain(domain);
		var chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData, updatedScale.domain());

		return {
			xScale: updatedScale,
			plotData,
			chartConfig,
		};
	}
	xAxisZoom(newDomain) {
		var { xScale, plotData, chartConfig } = this.calculateStateForDomain(newDomain);
		this.clearBothCanvas();

		var { xAccessor } = this.state;
		var { fullData } = this;
		var firstItem = first(fullData);
		var start = first(xScale.domain());
		var end = xAccessor(firstItem);
		var { onLoadMore } = this.props;

		this.setState({
			xScale,
			plotData,
			chartConfig,
		}, () => {
			if (start < end) onLoadMore(start, end);
		});
	}
	yAxisZoom(chartId, newDomain) {
		this.clearThreeCanvas();
		var { chartConfig: initialChartConfig } = this.state;
		var chartConfig = initialChartConfig
			.map(each => {
				if (each.id === chartId) {
					var { yScale } = each;
					return {
						...each,
						yScale: yScale.copy().domain(newDomain),
						yPanEnabled: true,
					};
				} else {
					return each;
				}
			});

		this.setState({
			chartConfig,
		});
	}
	panHelper(mouseXY, initialXScale, panOrigin, chartsToPan) {
		var { xAccessor, chartConfig: initialChartConfig } = this.state;
		var { filterData } = this.state;
		var { fullData } = this;
		var { postCalculator } = this.props;

		var dx = mouseXY[0] - panOrigin[0];
		var dy = mouseXY[1] - panOrigin[1];

		if (isNotDefined(initialXScale.invert))
			throw new Error("xScale provided does not have an invert() method."
				+ "You are likely using an ordinal scale. This scale does not support zoom, pan");

		var newDomain = initialXScale.range().map(x => x - dx).map(initialXScale.invert);

		var { plotData, domain } = filterData(fullData,
			newDomain,
			xAccessor,
			initialXScale,
			this.hackyWayToStopPanBeyondBounds__plotData,
			this.hackyWayToStopPanBeyondBounds__domain);

		var updatedScale = initialXScale.copy().domain(domain);
		plotData = postCalculator(plotData);
		// console.log(last(plotData));
		var currentItem = getCurrentItem(updatedScale, xAccessor, mouseXY, plotData);

		var chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData, updatedScale.domain(), dy, chartsToPan);

		var currentCharts = getCurrentCharts(chartConfig, mouseXY);

		// console.log(initialXScale.domain(), newDomain, updatedScale.domain());
		return {
			xScale: updatedScale,
			plotData,
			mouseXY,
			currentCharts,
			chartConfig,
			currentItem,
		};
	}
	triggerEvent(type, props, e) {
		this.subscriptions.forEach(each => {
			// console.log(each)
			each.callback(type, props, e);
		});
	}
	handlePan(mousePosition, panStartXScale, panOrigin, chartsToPan, e) {
		this.hackyWayToStopPanBeyondBounds__plotData = this.hackyWayToStopPanBeyondBounds__plotData || this.state.plotData;
		this.hackyWayToStopPanBeyondBounds__domain = this.hackyWayToStopPanBeyondBounds__domain || this.state.xScale.domain();

		var state = this.panHelper(mousePosition, panStartXScale, panOrigin, chartsToPan);

		this.hackyWayToStopPanBeyondBounds__plotData = state.plotData;
		this.hackyWayToStopPanBeyondBounds__domain = state.xScale.domain();

		this.panInProgress = true;

		requestAnimationFrame(() => {
			this.clearBothCanvas();
			this.triggerEvent("pan", state, e);
		});
	}
	handleMouseDown(mousePosition, currentCharts, e) {
		this.triggerEvent("mousedown", null, e);
	}
	handleClick(mousePosition, e) {
		// console.log("clicked", e.shiftKey);
		this.triggerEvent("click", {}, e);
	}
	handleDoubleClick(mousePosition, e) {
		// if (debug) console.log("double clicked");
		log("double clicked");
		this.triggerEvent("dblclick", {}, e);
	}
	handlePanEnd(mousePosition, panStartXScale, panOrigin, chartsToPan, e) {
		var state = this.panHelper(mousePosition, panStartXScale, panOrigin, chartsToPan);
		// console.log(this.canvasDrawCallbackList.map(d => d.type));
		this.hackyWayToStopPanBeyondBounds__plotData = null;
		this.hackyWayToStopPanBeyondBounds__domain = null;

		this.panInProgress = false;

		this.triggerEvent("panend", state, e);
		// console.log("PANEND", panEnd++);
		var {
			xScale,
			plotData,
			chartConfig,
		} = state;

		requestAnimationFrame(() => {
			var { xAccessor } = this.state;
			var { fullData } = this;

			var firstItem = first(fullData);
			var start = first(xScale.domain());
			var end = xAccessor(firstItem);
			// console.log(start, end, start < end ? "Load more" : "I have it");

			var { onLoadMore } = this.props;
			this.clearThreeCanvas();
			this.setState({
				xScale,
				plotData,
				chartConfig,
			}, () => {
				if (start < end) onLoadMore(start, end);
			});
		});
	}
	getChildContext() {
		var dimensions = getDimensions(this.props);

		return {
			fullData: this.fullData,
			plotData: this.state.plotData,
			width: dimensions.width,
			height: dimensions.height,
			chartConfig: this.state.chartConfig,
			xScale: this.state.xScale,
			xAccessor: this.state.xAccessor,
			displayXAccessor: this.props.displayXAccessor || this.state.displayXAccessor,
			chartCanvasType: this.props.type,
			margin: this.props.margin,
			ratio: this.props.ratio,
			xAxisZoom: this.xAxisZoom,
			yAxisZoom: this.yAxisZoom,
			// getInteractiveState: this.getInteractiveState,
			// setInteractiveState: this.setInteractiveState,
			getCanvasContexts: this.getCanvasContexts,
			subscribe: this.subscribe,
			unsubscribe: this.unsubscribe,
			generateSubscriptionId: this.generateSubscriptionId,
		};
	}
	componentWillMount() {
		var { fullData, ...state } = resetChart(this.props, true);

		this.setState(state);
		this.fullData = fullData;
	}
	componentWillReceiveProps(nextProps) {
		var reset = shouldResetChart(this.props, nextProps);

		var interaction = isInteractionEnabled(this.state.xScale, this.state.xAccessor, this.state.plotData);

		var newState;
		if (!interaction || reset || !shallowEqual(this.props.xExtents, nextProps.xExtents)) {
			if (process.env.NODE_ENV !== "production") {
				if (!interaction)
					log("RESET CHART, changes to a non interactive chart");
				else if (reset)
					log("RESET CHART, one or more of these props changed", CANDIDATES_FOR_RESET);
				else
					log("xExtents changed");
			}
			// do reset
			newState = resetChart(nextProps);
		} else {

			var [start, end] = this.state.xScale.domain();
			var prevLastItem = last(this.fullData);

			let calculatedState = calculateFullData(nextProps);
			var { xAccessor } = calculatedState;
			var lastItemWasVisible = xAccessor(prevLastItem) <= end && xAccessor(prevLastItem) >= start;

			if (process.env.NODE_ENV !== "production") {
				if (this.props.data !== nextProps.data)
					log("data is changed but seriesName did not, change the seriesName if you wish to reset the chart and lastItemWasVisible = ", lastItemWasVisible);
				else if (!shallowEqual(this.props.calculator, nextProps.calculator))
					log("calculator changed");
				else
					log("Trivial change, may be width/height or type changed, but that does not matter");
			}
			newState = updateChart(calculatedState, this.state.xScale, nextProps, lastItemWasVisible);
		}

		var { fullData, ...state } = newState;
		var { chartConfig: initialChartConfig } = this.state;

		if (this.panInProgress) {
			if (process.env.NODE_ENV !== "production") {
				log("Pan is in progress");
			}
		} else {
			if (!reset) {
				state.chartConfig
					.forEach((each) => {
						var sourceChartConfig = initialChartConfig.filter(d => d.id === each.id);
						if (sourceChartConfig.length > 0 && sourceChartConfig[0].yPanEnabled) {
							each.yScale.domain(sourceChartConfig[0].yScale.domain());
							each.yPanEnabled = sourceChartConfig[0].yPanEnabled;
						}
					});
			}
			this.clearThreeCanvas();

			this.setState(state);
		}
		this.fullData = fullData;
	}
	resetYDomain(chartId) {
		var { chartConfig } = this.state;
		var changed = false;
		var newChartConfig = chartConfig
			.map(each => {
				if ((isNotDefined(chartId) || each.id === chartId)
						&& !shallowEqual(each.yScale.domain(), each.realYDomain)) {
					changed = true;
					return {
						...each,
						yScale: each.yScale.domain(each.realYDomain),
						yPanEnabled: false,
					};
				}
				return each;
			});

		if (changed) {
			this.clearThreeCanvas();
			this.setState({
				chartConfig: newChartConfig
			});
		}
	}
	shouldComponentUpdate() {
		return !this.panInProgress;
	}
	render() {

		var { type, height, width, margin, className, zIndex, defaultFocus, ratio, disableMouseMoveEvent, disablePanEvent, disableZoomEvent } = this.props;
		var { useCrossHairStyleCursor, drawMode, onSelect } = this.props;

		var { plotData, xScale, xAccessor, chartConfig } = this.state;
		var dimensions = getDimensions(this.props);

		var interaction = isInteractionEnabled(xScale, xAccessor, plotData);

		var cursor = getCursorStyle(useCrossHairStyleCursor && interaction);
		return (
			<div style={{ position: "relative", width, height }} className={className} onClick={onSelect}>
				<CanvasContainer ref="canvases" width={width} height={height} ratio={ratio} type={type} zIndex={zIndex}/>
				<svg className={className} width={width} height={height} style={{ position: "absolute", zIndex: (zIndex + 5) }}>
					{cursor}
					<defs>
						<clipPath id="chart-area-clip">
							<rect x="0" y="0" width={dimensions.width} height={dimensions.height} />
						</clipPath>
						{chartConfig
							.map((each, idx) => <clipPath key={idx} id={`chart-area-clip-${each.id}`}>
								<rect x="0" y="0" width={each.width} height={each.height} />
							</clipPath>)}
					</defs>
					<g transform={`translate(${margin.left + 0.5}, ${margin.top + 0.5})`}>
						<EventCapture
							mouseMove={!disableMouseMoveEvent && interaction}
							zoom={!disableZoomEvent && interaction}
							pan={!disablePanEvent && interaction && !drawMode}

							width={dimensions.width}
							height={dimensions.height}
							chartConfig={chartConfig}
							xScale={xScale}
							xAccessor={xAccessor}
							focus={defaultFocus}

							onContextMenu={this.handleContextMenu}
							onClick={this.handleClick}
							onDoubleClick={this.handleDoubleClick}
							onMouseDown={this.handleMouseDown}
							onMouseMove={this.handleMouseMove}
							onMouseEnter={this.handleMouseEnter}
							onMouseLeave={this.handleMouseLeave}
							onZoom={this.handleZoom}
							onPinchZoom={this.handlePinchZoom}
							onPan={this.handlePan}
							onPanEnd={this.handlePanEnd}
							/>

						<g className="react-stockcharts-avoid-interaction">
							{this.props.children}
						</g>
					</g>
				</svg>
			</div>
		);
	}
}

function isInteractionEnabled(xScale, xAccessor, data) {
	var interaction = !isNaN(xScale(xAccessor(first(data)))) && isDefined(xScale.invert);
	return interaction;
}

ChartCanvas.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	margin: PropTypes.object,
	ratio: PropTypes.number.isRequired,
	// interval: PropTypes.oneOf(["D", "W", "M"]), // ,"m1", "m5", "m15", "W", "M"
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	data: PropTypes.array.isRequired,
	// initialDisplay: PropTypes.number,
	calculator: PropTypes.arrayOf(PropTypes.func).isRequired,
	xAccessor: PropTypes.func,
	xExtents: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	// xScale: PropTypes.func.isRequired,
	className: PropTypes.string,
	seriesName: PropTypes.string.isRequired,
	zIndex: PropTypes.number,
	children: PropTypes.node.isRequired,
	xScaleProvider: function(props, propName/* , componentName */) {
		if (isDefined(props[propName]) &&  typeof props[propName] === "function" && isDefined(props.xScale)) {
			return new Error("Do not define both xScaleProvider and xScale choose only one");
		}
	},
	xScale: function(props, propName/* , componentName */) {
		if (isDefined(props[propName]) &&  typeof props[propName] === "function" && isDefined(props.xScaleProvider)) {
			return new Error("Do not define both xScaleProvider and xScale choose only one");
		}
	},
	postCalculator: PropTypes.func.isRequired,
	flipXScale: PropTypes.bool.isRequired,
	useCrossHairStyleCursor: PropTypes.bool.isRequired,
	drawMode: PropTypes.bool.isRequired,
	padding: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.shape({
			left: PropTypes.number,
			right: PropTypes.number,
		})
	]).isRequired,
	defaultFocus: PropTypes.bool,
	zoomMultiplier: PropTypes.number.isRequired,
	onLoadMore: PropTypes.func,
	displayXAccessor: PropTypes.func,
	disableMouseMoveEvent: PropTypes.bool.isRequired,
	disablePanEvent: PropTypes.bool.isRequired,
	disableZoomEvent: PropTypes.bool.isRequired,
	onSelect: PropTypes.func,
};

ChartCanvas.defaultProps = {
	margin: { top: 20, right: 30, bottom: 30, left: 80 },
	indexAccessor: d => d.idx,
	indexMutator: (d, idx) => ({ ...d, idx }),
	map: identity,
	type: "hybrid",
	calculator: [],
	className: "react-stockchart",
	zIndex: 1,
	xExtents: [min, max],
	// dataEvaluator: evaluator,
	postCalculator: identity,
	padding: 0,
	xAccessor: identity,
	flipXScale: false,
	useCrossHairStyleCursor: true,
	drawMode: false,
	defaultFocus: true,
	onLoadMore: noop,
	onSelect: noop,
	disableMouseMoveEvent: false,
	disablePanEvent: false,
	disableZoomEvent: false,
	zoomMultiplier: 1.1,
	// ratio: 2,
};

ChartCanvas.childContextTypes = {
	plotData: PropTypes.array,
	fullData: PropTypes.array,
	chartConfig: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			origin: PropTypes.arrayOf(PropTypes.number).isRequired,
			padding: PropTypes.oneOfType([
				PropTypes.number,
				PropTypes.shape({
					top: PropTypes.number,
					bottom: PropTypes.number,
				})
			]),
			yExtents: PropTypes.arrayOf(PropTypes.func),
			yExtentsProvider: PropTypes.func,
			yScale: PropTypes.func.isRequired,
			mouseCoordinates: PropTypes.shape({
				at: PropTypes.string,
				format: PropTypes.func
			}),
			width: PropTypes.number.isRequired,
			height: PropTypes.number.isRequired,
		})
	).isRequired,
	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	chartCanvasType: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	margin: PropTypes.object.isRequired,
	ratio: PropTypes.number.isRequired,
	getCanvasContexts: PropTypes.func,
	xAxisZoom: PropTypes.func,
	yAxisZoom: PropTypes.func,
	subscribe: PropTypes.func,
	unsubscribe: PropTypes.func,
	generateSubscriptionId: PropTypes.func,
};

ChartCanvas.ohlcv = d => ({ date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume });

export default ChartCanvas;
