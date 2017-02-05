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

const CANDIDATES_FOR_RESET = [
	"seriesName",
	/* "data",*/
	/* "xAccessor",*/
];

function shouldResetChart(thisProps, nextProps) {
	return !CANDIDATES_FOR_RESET.every(key => {
		const result = shallowEqual(thisProps[key], nextProps[key]);
		// console.log(key, result);
		return result;
	});
}

function getCursorStyle(useCrossHairStyleCursor) {
	const style = `
	.react-stockcharts-grabbing-cursor {
		pointer-events: all;
		cursor: -moz-grabbing;
		cursor: -webkit-grabbing;
		cursor: grabbing;
	}
	.react-stockcharts-crosshair-cursor {
		pointer-events: all;
		cursor: crosshair;
	}
	.react-stockcharts-toottip-hover {
		pointer-events: all;
		cursor: pointer;
	}`;
	const tooltipStyle = `
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
	.react-stockcharts-pointer-cursor {
		cursor: pointer;
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
	const { data: fullData, plotFull, xScale, clamp, pointsPerPxThreshold } = props;
	const { xAccessor, displayXAccessor } = props;

	const useWholeData = isDefined(plotFull)
			? plotFull
			: xAccessor === identity;

	const filterData = evaluator({
		xAccessor,
		xScale,
		useWholeData,
		clamp,
		pointsPerPxThreshold
	});

	return {
		xAccessor,
		displayXAccessor: displayXAccessor || xAccessor,
		xScale,
		fullData,
		filterData
	};
}
function resetChart(props, firstCalculation = false) {
	if (process.env.NODE_ENV !== "production") {
		if (!firstCalculation) log("CHART RESET");
	}

	const state = calculateState(props);
	const { plotData: initialPlotData, xScale } = state;
	const { postCalculator, children } = props;

	const plotData = postCalculator(initialPlotData);

	const dimensions = getDimensions(props);
	const chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), plotData, xScale.domain());

	return {
		...state,
		xScale,
		plotData,
		chartConfig,
	};
}

function updateChart(newState, initialXScale, props, lastItemWasVisible) {

	const { fullData, xScale, xAccessor, filterData } = newState;

	const lastItem = last(fullData);
	const [start, end] = initialXScale.domain();

	if (process.env.NODE_ENV !== "production") {
		log("TRIVIAL CHANGE");
	}

	const { postCalculator, children, padding, flipXScale } = props;
	const direction = getXScaleDirection(flipXScale);
	const dimensions = getDimensions(props);

	const updatedXScale = setXRange(xScale, dimensions, padding, direction);

	let initialPlotData;
	if (!lastItemWasVisible || end >= xAccessor(lastItem)) {
		// get plotData between [start, end] and do not change the domain
		initialPlotData = filterData(fullData, [start, end], xAccessor, updatedXScale).plotData;
		updatedXScale.domain([start, end]);
		// console.log("HERE!!!!!", start, end);
	} else if (lastItemWasVisible
			&& end < xAccessor(lastItem)) {

		// get plotData between [xAccessor(l) - (end - start), xAccessor(l)] and DO change the domain
		const dx = initialXScale(xAccessor(lastItem)) - initialXScale.range()[1];
		const [newStart, newEnd] = initialXScale.range().map(x => x + dx).map(initialXScale.invert);

		initialPlotData = filterData(fullData, [newStart, newEnd], xAccessor, updatedXScale).plotData;
		updatedXScale.domain([newStart, newEnd]);
		// if last item was visible, then shift
	}
	// plotData = getDataOfLength(fullData, showingInterval, plotData.length)
	const plotData = postCalculator(initialPlotData);
	const chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), plotData, updatedXScale.domain());

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

	const { xAccessor: inputXAccesor, xExtents: xExtentsProp, data, padding, flipXScale } = props;

	const direction = getXScaleDirection(flipXScale);
	const dimensions = getDimensions(props);

	const extent = typeof xExtentsProp === "function"
		? xExtentsProp(data)
		: d3Extent(xExtentsProp.map(d => functor(d)).map(each => each(data, inputXAccesor)));

	const { xAccessor, displayXAccessor, xScale, fullData, filterData } = calculateFullData(props);
	const updatedXScale = setXRange(xScale, dimensions, padding, direction);

	const { plotData, domain } = filterData(fullData, extent, inputXAccesor, updatedXScale);

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
		const { left, right } = isNaN(padding)
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
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);

		this.xAxisZoom = this.xAxisZoom.bind(this);
		this.yAxisZoom = this.yAxisZoom.bind(this);
		this.resetYDomain = this.resetYDomain.bind(this);
		this.calculateStateForDomain = this.calculateStateForDomain.bind(this);
		this.generateSubscriptionId = this.generateSubscriptionId.bind(this);
		this.draw = this.draw.bind(this);
		this.redraw = this.redraw.bind(this);
		this.isSomethingSelectedAndHovering = this.isSomethingSelectedAndHovering.bind(this);

		this.pinchCoordinates = this.pinchCoordinates.bind(this);

		this.subscriptions = [];
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
		this.amIOnTop = this.amIOnTop.bind(this);
		this.saveEventCaptureNode = this.saveEventCaptureNode.bind(this);
		this.setCursorClass = this.setCursorClass.bind(this);
		// this.canvasDrawCallbackList = [];
		this.interactiveState = [];
		this.panInProgress = false;

		this.state = {};
		this.lastSubscriptionId = 0;
	}
	saveEventCaptureNode(node) {
		this.eventCaptureNode = node;
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
		const canvases = this.getCanvasContexts();
		if (canvases && canvases.axes) {
			clearCanvas([
				canvases.axes,
				canvases.hover,
				canvases.mouseCoord
			], this.props.ratio);
		}
	}
	clearMouseCanvas() {
		const canvases = this.getCanvasContexts();
		if (canvases && canvases.mouseCoord) {
			clearCanvas([
				canvases.mouseCoord,
				canvases.hover,
			], this.props.ratio);
		}
	}
	clearThreeCanvas() {
		const canvases = this.getCanvasContexts();
		if (canvases && canvases.axes) {
			clearCanvas([
				canvases.axes,
				canvases.hover,
				canvases.mouseCoord,
				canvases.bg
			], this.props.ratio);
		}
	}
	subscribe(id, rest) {
		const { isDraggable = functor(false) } = rest;
		this.subscriptions = this.subscriptions.concat({
			id,
			...rest,
			isDraggable,
		});
	}
	unsubscribe(id) {
		this.subscriptions = this.subscriptions.filter(each => each.id !== id);
	}
	isSomethingSelectedAndHovering() {
		return this.subscriptions
			.filter(each => each.isDraggable()).length > 0;
	}
	setCursorClass(className) {
		this.eventCaptureNode.setCursorClass(className);
	}
	amIOnTop(id) {
		const dragableComponents = this.subscriptions
			.filter(each => each.isDraggable());

		return dragableComponents.length > 0
			&& last(dragableComponents).id === id;
	}
	handleContextMenu(mouseXY, e) {
		const { xAccessor, chartConfig, plotData, xScale } = this.state;

		const currentCharts = getCurrentCharts(chartConfig, mouseXY);
		const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);

		this.triggerEvent("contextmenu", {
			mouseXY,
			currentItem,
			currentCharts,
		}, e);
	}
	pinchCoordinates(pinch) {
		const { touch1Pos, touch2Pos } = pinch;

		return {
			topLeft: [Math.min(touch1Pos[0], touch2Pos[0]), Math.min(touch1Pos[1], touch2Pos[1])],
			bottomRight: [Math.max(touch1Pos[0], touch2Pos[0]), Math.max(touch1Pos[1], touch2Pos[1])]
		};
	}
	handlePinchZoom(initialPinch, finalPinch) {
		const { xScale: initialPinchXScale } = initialPinch;

		const { xScale: initialXScale, chartConfig: initialChartConfig, plotData: initialPlotData, xAccessor } = this.state;
		const { filterData } = this.state;
		const { fullData } = this;
		const { postCalculator } = this.props;

		const { topLeft: iTL, bottomRight: iBR } = this.pinchCoordinates(initialPinch);
		const { topLeft: fTL, bottomRight: fBR } = this.pinchCoordinates(finalPinch);

		const e = initialPinchXScale.range()[1];

		// var fR1 = e - fTL[0];
		// var fR2 = e - fBR[0];
		// var iR1 = e - iTL[0];
		// var iR2 = e - iBR[0];

		const xDash = Math.round(-(iBR[0] * fTL[0] - iTL[0] * fBR[0]) / (iTL[0] - iBR[0]));
		const yDash = Math.round(e + ((e - iBR[0]) * (e - fTL[0]) - (e - iTL[0]) * (e - fBR[0])) / ((e - iTL[0]) - (e - iBR[0])));


		const x = Math.round(-xDash * iTL[0] / (-xDash + fTL[0]));
		const y = Math.round(e - (yDash - e) * (e - iTL[0]) / (yDash + (e - fTL[0])));

		// document.getElementById("debug_here").innerHTML = `**${[s, e]} to ${[xDash, yDash]} to ${[x, y]}`;
		// var left = ((final.leftxy[0] - range[0]) / (final.rightxy[0] - final.leftxy[0])) * (initial.right - initial.left);
		// var right = ((range[1] - final.rightxy[0]) / (final.rightxy[0] - final.leftxy[0])) * (initial.right - initial.left);

		const newDomain = [x, y].map(initialPinchXScale.invert);
		// var domainR = initial.right + right;

		const { plotData: beforePlotData, domain } = filterData(fullData,
			newDomain,
			xAccessor,
			initialPinchXScale,
			initialPlotData,
			initialXScale.domain());

		const plotData = postCalculator(beforePlotData);
		const updatedScale = initialXScale.copy().domain(domain);

		const chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData, updatedScale.domain());

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
	calculateStateForDomain(newDomain) {
		const { xAccessor, xScale: initialXScale, chartConfig: initialChartConfig, plotData: initialPlotData } = this.state;
		const { filterData } = this.state;
		const { fullData } = this;
		const { postCalculator } = this.props;

		const { plotData: beforePlotData, domain } = filterData(fullData,
			newDomain,
			xAccessor,
			initialXScale,
			initialPlotData,
			initialXScale.domain());

		const plotData = postCalculator(beforePlotData);
		const updatedScale = initialXScale.copy().domain(domain);
		const chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData, updatedScale.domain());

		return {
			xScale: updatedScale,
			plotData,
			chartConfig,
		};
	}
	handleZoom(zoomDirection, mouseXY, e) {
		// console.log("zoomDirection ", zoomDirection, " mouseXY ", mouseXY);
		const { xAccessor, xScale: initialXScale, plotData: initialPlotData } = this.state;
		const { zoomMultiplier } = this.props;

		const item = getCurrentItem(initialXScale, xAccessor, mouseXY, initialPlotData),
			cx = initialXScale(xAccessor(item)),
			c = zoomDirection > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier,
			newDomain = initialXScale.range().map(x => cx + (x - cx) * c).map(initialXScale.invert);

		const { xScale, plotData, chartConfig } = this.calculateStateForDomain(newDomain);

		const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
		const currentCharts = getCurrentCharts(chartConfig, mouseXY);

		this.clearThreeCanvas();

		const { fullData } = this;
		const firstItem = first(fullData);

		const start = first(xScale.domain());
		const end = xAccessor(firstItem);
		const { onLoadMore } = this.props;

		this.triggerEvent("zoom", {
			show: true,
			mouseXY,
			currentCharts,
			currentItem,
		}, e);

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
	xAxisZoom(newDomain) {
		const { xScale, plotData, chartConfig } = this.calculateStateForDomain(newDomain);
		this.clearThreeCanvas();

		const { xAccessor } = this.state;
		const { fullData } = this;
		const firstItem = first(fullData);
		const start = first(xScale.domain());
		const end = xAccessor(firstItem);
		const { onLoadMore } = this.props;

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
		const { chartConfig: initialChartConfig } = this.state;
		const chartConfig = initialChartConfig
			.map(each => {
				if (each.id === chartId) {
					const { yScale } = each;
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
	triggerEvent(type, props, e) {
		// console.log("triggering ->", type);

		this.subscriptions.forEach(each => {
			const state = {
				...this.state,
				fullData: this.fullData,
				subscriptions: this.subscriptions,
			};
			each.listener(type, props, state, e);
		});
	}
	draw(props) {
		this.subscriptions.forEach(each => {
			each.draw(props);
		});
	}
	redraw() {
		this.clearThreeCanvas();
		this.draw({ force: true });
	}
	panHelper(mouseXY, initialXScale, panOrigin, chartsToPan) {
		const { xAccessor, chartConfig: initialChartConfig } = this.state;
		const { filterData } = this.state;
		const { fullData } = this;
		const { postCalculator } = this.props;

		const dx = mouseXY[0] - panOrigin[0];
		const dy = mouseXY[1] - panOrigin[1];

		if (isNotDefined(initialXScale.invert))
			throw new Error("xScale provided does not have an invert() method."
				+ "You are likely using an ordinal scale. This scale does not support zoom, pan");

		const newDomain = initialXScale.range().map(x => x - dx).map(initialXScale.invert);

		const { plotData: beforePlotData, domain } = filterData(fullData,
			newDomain,
			xAccessor,
			initialXScale,
			this.hackyWayToStopPanBeyondBounds__plotData,
			this.hackyWayToStopPanBeyondBounds__domain);

		const updatedScale = initialXScale.copy().domain(domain);
		const plotData = postCalculator(beforePlotData);
		// console.log(last(plotData));

		const currentItem = getCurrentItem(updatedScale, xAccessor, mouseXY, plotData);
		const chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData, updatedScale.domain(), dy, chartsToPan);
		const currentCharts = getCurrentCharts(chartConfig, mouseXY);

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
	handlePan(mousePosition, panStartXScale, panOrigin, chartsToPan, e) {
		this.hackyWayToStopPanBeyondBounds__plotData = this.hackyWayToStopPanBeyondBounds__plotData || this.state.plotData;
		this.hackyWayToStopPanBeyondBounds__domain = this.hackyWayToStopPanBeyondBounds__domain || this.state.xScale.domain();

		const state = this.panHelper(mousePosition, panStartXScale, panOrigin, chartsToPan);

		this.hackyWayToStopPanBeyondBounds__plotData = state.plotData;
		this.hackyWayToStopPanBeyondBounds__domain = state.xScale.domain();

		this.panInProgress = true;

		// Q: why cant panend be inside requestAnimationFrame
		// A: the event e is a synthetic event and will be reused by react.
		// Moving it inside the rAF means react cannot reuse the event

		this.triggerEvent("pan", state, e);

		requestAnimationFrame(() => {
			this.clearBothCanvas();
			this.draw({ trigger: "pan" });
		});
	}
	handleMouseDown(mousePosition, currentCharts, e) {
		this.triggerEvent("mousedown", null, e);
	}
	handleMouseEnter(e) {
		this.triggerEvent("mouseenter", {
			show: true,
		}, e);
	}
	handleMouseMove(mouseXY, inputType, e) {
		const { chartConfig, plotData, xScale, xAccessor } = this.state;
		const currentCharts = getCurrentCharts(chartConfig, mouseXY);
		const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);

		this.triggerEvent("mousemove", {
			show: true,
			mouseXY,
			currentItem,
			currentCharts,
		}, e);

		requestAnimationFrame(() => {
			this.clearMouseCanvas();
			this.draw({ trigger: "mousemove" });
		});
	}
	handleMouseLeave(e) {
		this.triggerEvent("mouseleave", { show: false }, e);
		this.clearMouseCanvas();
		this.draw({ trigger: "mouseleave" });
	}
	handleDragStart(mousePosition, e) {
		this.triggerEvent("dragstart", { mousePosition }, e);
	}
	handleDrag({ startPos, mouseXY }, e) {
		const { chartConfig, plotData, xScale, xAccessor } = this.state;
		const currentCharts = getCurrentCharts(chartConfig, mouseXY);
		const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);

		this.triggerEvent("drag", {
			startPos,
			mouseXY,
			currentItem,
			currentCharts,
		}, e);

		requestAnimationFrame(() => {
			this.clearMouseCanvas();
			this.draw({ trigger: "drag" });
		});
	}
	handleDragEnd(mousePosition, e) {
		this.triggerEvent("dragend", { mousePosition }, e);

		requestAnimationFrame(() => {
			this.clearMouseCanvas();
			this.draw({ trigger: "dragend" });
		});
	}
	handleClick(mousePosition, e) {
		this.triggerEvent("click", {}, e);

		requestAnimationFrame(() => {
			this.clearMouseCanvas();
			this.draw({ trigger: "click" });
		});
	}
	handleDoubleClick(mousePosition, e) {
		this.triggerEvent("dblclick", {}, e);
	}
	handlePanEnd(mousePosition, panStartXScale, panOrigin, chartsToPan, e) {
		const state = this.panHelper(mousePosition, panStartXScale, panOrigin, chartsToPan);
		// console.log(this.canvasDrawCallbackList.map(d => d.type));
		this.hackyWayToStopPanBeyondBounds__plotData = null;
		this.hackyWayToStopPanBeyondBounds__domain = null;

		this.panInProgress = false;

		// console.log("PANEND", panEnd++);
		const {
			xScale,
			plotData,
			chartConfig,
		} = state;

		this.triggerEvent("panend", state, e);

		requestAnimationFrame(() => {
			const { xAccessor } = this.state;
			const { fullData } = this;

			const firstItem = first(fullData);
			const start = first(xScale.domain());
			const end = xAccessor(firstItem);
			// console.log(start, end, start < end ? "Load more" : "I have it");

			const { onLoadMore } = this.props;

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
		const dimensions = getDimensions(this.props);
		return {
			fullData: this.fullData,
			plotData: this.state.plotData,
			width: dimensions.width,
			height: dimensions.height,
			chartConfig: this.state.chartConfig,
			xScale: this.state.xScale,
			xAccessor: this.state.xAccessor,
			displayXAccessor: this.state.displayXAccessor,
			chartCanvasType: this.props.type,
			margin: this.props.margin,
			ratio: this.props.ratio,
			xAxisZoom: this.xAxisZoom,
			yAxisZoom: this.yAxisZoom,
			getCanvasContexts: this.getCanvasContexts,
			redraw: this.redraw,
			subscribe: this.subscribe,
			unsubscribe: this.unsubscribe,
			generateSubscriptionId: this.generateSubscriptionId,
			amIOnTop: this.amIOnTop,
			setCursorClass: this.setCursorClass,
		};
	}
	componentWillMount() {
		const { fullData, ...state } = resetChart(this.props, true);

		this.setState(state);
		this.fullData = fullData;
	}
	componentWillReceiveProps(nextProps) {
		const reset = shouldResetChart(this.props, nextProps);

		const interaction = isInteractionEnabled(this.state.xScale, this.state.xAccessor, this.state.plotData);

		let newState;
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

			const [start, end] = this.state.xScale.domain();
			const prevLastItem = last(this.fullData);

			const calculatedState = calculateFullData(nextProps);
			const { xAccessor } = calculatedState;
			const lastItemWasVisible = xAccessor(prevLastItem) <= end && xAccessor(prevLastItem) >= start;

			if (process.env.NODE_ENV !== "production") {
				if (this.props.data !== nextProps.data)
					log("data is changed but seriesName did not, change the seriesName if you wish to reset the chart and lastItemWasVisible = ", lastItemWasVisible);
				else
					log("Trivial change, may be width/height or type changed, but that does not matter");
			}
			newState = updateChart(calculatedState, this.state.xScale, nextProps, lastItemWasVisible);
		}

		const { fullData, ...state } = newState;
		const { chartConfig: initialChartConfig } = this.state;

		if (this.panInProgress) {
			if (process.env.NODE_ENV !== "production") {
				log("Pan is in progress");
			}
		} else {
			if (!reset) {
				state.chartConfig
					.forEach((each) => {
						const sourceChartConfig = initialChartConfig.filter(d => d.id === each.id);
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
		const { chartConfig } = this.state;
		let changed = false;
		const newChartConfig = chartConfig
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

		const { type, height, width, margin, className, zIndex, defaultFocus, ratio, mouseMoveEvent, panEvent, zoomEvent } = this.props;
		const { useCrossHairStyleCursor, drawMode, onSelect } = this.props;

		const { plotData, xScale, xAccessor, chartConfig } = this.state;
		const dimensions = getDimensions(this.props);

		const interaction = isInteractionEnabled(xScale, xAccessor, plotData);

		const cursor = getCursorStyle(useCrossHairStyleCursor && interaction);
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
							ref={this.saveEventCaptureNode}
							mouseMove={mouseMoveEvent && interaction}
							zoom={zoomEvent && interaction}
							pan={panEvent && interaction && !drawMode}

							width={dimensions.width}
							height={dimensions.height}
							chartConfig={chartConfig}
							xScale={xScale}
							xAccessor={xAccessor}
							focus={defaultFocus}

							isSomethingSelectedAndHovering={this.isSomethingSelectedAndHovering}
							onContextMenu={this.handleContextMenu}
							onClick={this.handleClick}
							onDoubleClick={this.handleDoubleClick}
							onMouseDown={this.handleMouseDown}
							onMouseMove={this.handleMouseMove}
							onMouseEnter={this.handleMouseEnter}
							onMouseLeave={this.handleMouseLeave}

							onDragStart={this.handleDragStart}
							onDrag={this.handleDrag}
							onDragComplete={this.handleDragEnd}

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
	const interaction = !isNaN(xScale(xAccessor(first(data)))) && isDefined(xScale.invert);
	return interaction;
}

ChartCanvas.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	margin: PropTypes.object,
	ratio: PropTypes.number.isRequired,
	// interval: PropTypes.oneOf(["D", "W", "M"]), // ,"m1", "m5", "m15", "W", "M"
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	pointsPerPxThreshold: PropTypes.number,
	data: PropTypes.array.isRequired,
	// initialDisplay: PropTypes.number,
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
	xScale: PropTypes.func.isRequired,
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
	displayXAccessor: function(props, propName/* , componentName */) {
		if (isNotDefined(props[propName])) {
			console.warn("`displayXAccessor` is not defined,"
				+ " will use the value from `xAccessor` as `displayXAccessor`."
				+ " This might be ok if you do not use a discontinuous scale"
				+ " but if you do, provide a `displayXAccessor` prop to `ChartCanvas`");
		} else if (typeof props[propName] !== "function") {
			return new Error("displayXAccessor has to be a function");
		}
	},
	mouseMoveEvent: PropTypes.bool.isRequired,
	panEvent: PropTypes.bool.isRequired,
	zoomEvent: PropTypes.bool.isRequired,
	onSelect: PropTypes.func,
};

ChartCanvas.defaultProps = {
	margin: { top: 20, right: 30, bottom: 30, left: 80 },
	type: "hybrid",
	pointsPerPxThreshold: 2,
	className: "react-stockchart",
	zIndex: 1,
	xExtents: [min, max],
	postCalculator: identity,
	padding: 0,
	xAccessor: identity,
	flipXScale: false,
	useCrossHairStyleCursor: true,
	drawMode: false,
	defaultFocus: true,
	onLoadMore: noop,
	onSelect: noop,
	mouseMoveEvent: true,
	panEvent: true,
	zoomEvent: true,
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
	amIOnTop: PropTypes.func,
	redraw: PropTypes.func,
	subscribe: PropTypes.func,
	unsubscribe: PropTypes.func,
	setCursorClass: PropTypes.func,
	generateSubscriptionId: PropTypes.func,
};

ChartCanvas.ohlcv = d => ({ date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume });

export default ChartCanvas;
