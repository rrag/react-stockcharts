"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { extent as d3Extent, min, max } from "d3-array";

import {
	head,
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

/* eslint-disable no-unused-vars */
import {
	mouseBasedZoomAnchor,
	lastVisibleItemBasedZoomAnchor,
	rightDomainBasedZoomAnchor,
} from "./utils/zoomBehavior";
/* eslint-enable no-unused-vars */

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
	.react-stockcharts-tooltip-hover {
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
	.react-stockcharts-tooltip {
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
	const { xAccessor, displayXAccessor, minPointsPerPxThreshold } = props;

	const useWholeData = isDefined(plotFull)
		? plotFull
		: xAccessor === identity;

	const { filterData } = evaluator({
		xScale,
		useWholeData,
		clamp,
		pointsPerPxThreshold,
		minPointsPerPxThreshold,
	});

	return {
		xAccessor,
		displayXAccessor: displayXAccessor || xAccessor,
		xScale: xScale.copy(),
		fullData,
		filterData
	};
}
function resetChart(props, firstCalculation = false) {
	if (process.env.NODE_ENV !== "production") {
		if (!firstCalculation) log("CHART RESET");
	}

	const state = calculateState(props);
	const { xAccessor, displayXAccessor, fullData } = state;
	const { plotData: initialPlotData, xScale } = state;
	const { postCalculator, children } = props;

	const plotData = postCalculator(initialPlotData);

	const dimensions = getDimensions(props);
	const chartConfig = getChartConfigWithUpdatedYScales(
		getNewChartConfig(dimensions, children),
		{ plotData, xAccessor, displayXAccessor, fullData },
		xScale.domain()
	);

	return {
		...state,
		xScale,
		plotData,
		chartConfig,
	};
}

function updateChart(
	newState,
	initialXScale,
	props,
	lastItemWasVisible,
	initialChartConfig,
) {

	const { fullData, xScale, xAccessor, displayXAccessor, filterData } = newState;

	const lastItem = last(fullData);
	const [start, end] = initialXScale.domain();

	if (process.env.NODE_ENV !== "production") {
		log("TRIVIAL CHANGE");
	}

	const { postCalculator, children, padding, flipXScale } = props;
	const { maintainPointsPerPixelOnResize } = props;
	const direction = getXScaleDirection(flipXScale);
	const dimensions = getDimensions(props);

	const updatedXScale = setXRange(xScale, dimensions, padding, direction);

	// console.log("lastItemWasVisible =", lastItemWasVisible, end, xAccessor(lastItem), end >= xAccessor(lastItem));
	let initialPlotData;
	if (!lastItemWasVisible || end >= xAccessor(lastItem)) {
		// resize comes here...
		// get plotData between [start, end] and do not change the domain
		const [rangeStart, rangeEnd] = initialXScale.range();
		const [newRangeStart, newRangeEnd] = updatedXScale.range();
		const newDomainExtent = ((newRangeEnd - newRangeStart) / (rangeEnd - rangeStart)) * (end - start);
		const newStart = maintainPointsPerPixelOnResize
			? end - newDomainExtent
			: start;

		const lastItemX = initialXScale(xAccessor(lastItem));
		// console.log("pointsPerPixel => ", newStart, start, end, updatedXScale(end));
		const response = filterData(
			fullData, [newStart, end], xAccessor, updatedXScale,
			{ fallbackStart: start, fallbackEnd: { lastItem, lastItemX } }
		);
		initialPlotData = response.plotData;
		updatedXScale.domain(response.domain);
		// console.log("HERE!!!!!", start, end);
	} else if (lastItemWasVisible
			&& end < xAccessor(lastItem)) {
		// this is when a new item is added and last item was visible
		// so slide over and show the new item also

		// get plotData between [xAccessor(l) - (end - start), xAccessor(l)] and DO change the domain
		const dx = initialXScale(xAccessor(lastItem)) - initialXScale.range()[1];
		const [newStart, newEnd] = initialXScale.range().map(x => x + dx).map(initialXScale.invert);


		const response = filterData(fullData, [newStart, newEnd], xAccessor, updatedXScale);
		initialPlotData = response.plotData;
		updatedXScale.domain(response.domain);		// if last item was visible, then shift
	}
	// plotData = getDataOfLength(fullData, showingInterval, plotData.length)
	const plotData = postCalculator(initialPlotData);
	const chartConfig = getChartConfigWithUpdatedYScales(
		getNewChartConfig(dimensions, children, initialChartConfig),
		{ plotData, xAccessor, displayXAccessor, fullData },
		updatedXScale.domain()
	);

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

	const {
		xAccessor: inputXAccesor, xExtents: xExtentsProp, data, padding, flipXScale
	} = props;

	if (process.env.NODE_ENV !== "production" && isDefined(props.xScale.invert)) {
		for (let i = 1; i < data.length; i++) {
			const prev = data[i - 1];
			const curr = data[i];
			if (inputXAccesor(prev) > inputXAccesor(curr)) {
				throw new Error("'data' is not sorted on 'xAccessor', send 'data' sorted in ascending order of 'xAccessor'");
			}
		}
	}

	const direction = getXScaleDirection(flipXScale);
	const dimensions = getDimensions(props);

	const extent = typeof xExtentsProp === "function"
		? xExtentsProp(data)
		: d3Extent(xExtentsProp.map(d => functor(d)).map(each => each(data, inputXAccesor)));

	const { xAccessor, displayXAccessor, xScale, fullData, filterData } = calculateFullData(props);
	const updatedXScale = setXRange(xScale, dimensions, padding, direction);

	const { plotData, domain } = filterData(fullData, extent, inputXAccesor, updatedXScale);

	if (process.env.NODE_ENV !== "production" && plotData.length <= 1) {
		throw new Error(`Showing ${plotData.length} datapoints, review the 'xExtents' prop of ChartCanvas`);
	}
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

function pinchCoordinates(pinch) {
	const { touch1Pos, touch2Pos } = pinch;

	return {
		topLeft: [Math.min(touch1Pos[0], touch2Pos[0]), Math.min(touch1Pos[1], touch2Pos[1])],
		bottomRight: [Math.max(touch1Pos[0], touch2Pos[0]), Math.max(touch1Pos[1], touch2Pos[1])]
	};
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
		this.handlePinchZoomEnd = this.handlePinchZoomEnd.bind(this);
		this.handlePan = this.handlePan.bind(this);
		this.handlePanEnd = this.handlePanEnd.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);

		this.panHelper = this.panHelper.bind(this);
		this.pinchZoomHelper = this.pinchZoomHelper.bind(this);
		this.xAxisZoom = this.xAxisZoom.bind(this);
		this.yAxisZoom = this.yAxisZoom.bind(this);
		this.resetYDomain = this.resetYDomain.bind(this);
		this.calculateStateForDomain = this.calculateStateForDomain.bind(this);
		this.generateSubscriptionId = this.generateSubscriptionId.bind(this);
		this.draw = this.draw.bind(this);
		this.redraw = this.redraw.bind(this);
		this.getAllPanConditions = this.getAllPanConditions.bind(this);

		this.subscriptions = [];
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
		this.amIOnTop = this.amIOnTop.bind(this);
		this.saveEventCaptureNode = this.saveEventCaptureNode.bind(this);
		this.saveCanvasContainerNode = this.saveCanvasContainerNode.bind(this);
		this.setCursorClass = this.setCursorClass.bind(this);
		this.getMutableState = this.getMutableState.bind(this);
		// this.canvasDrawCallbackList = [];
		this.interactiveState = [];
		this.panInProgress = false;

		this.state = {};
		this.mutableState = {};
		this.lastSubscriptionId = 0;
	}
	saveEventCaptureNode(node) {
		this.eventCaptureNode = node;
	}
	saveCanvasContainerNode(node) {
		this.canvasContainerNode = node;
	}
	getMutableState() {
		return this.mutableState;
	}
	getDataInfo() {
		return {
			...this.state,
			fullData: this.fullData,
		};
	}
	getCanvasContexts() {
		if (this.canvasContainerNode) {
			return this.canvasContainerNode.getCanvasContexts();
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
				// canvases.hover,
				canvases.mouseCoord
			], this.props.ratio);
		}
	}
	clearMouseCanvas() {
		const canvases = this.getCanvasContexts();
		if (canvases && canvases.mouseCoord) {
			clearCanvas([
				canvases.mouseCoord,
				// canvases.hover,
			], this.props.ratio);
		}
	}
	clearThreeCanvas() {
		const canvases = this.getCanvasContexts();
		if (canvases && canvases.axes) {
			clearCanvas([
				canvases.axes,
				// canvases.hover,
				canvases.mouseCoord,
				canvases.bg
			], this.props.ratio);
		}
	}
	subscribe(id, rest) {
		const { getPanConditions = functor({
			draggable: false,
			panEnabled: true,
		}) } = rest;
		this.subscriptions = this.subscriptions.concat({
			id,
			...rest,
			getPanConditions,
		});
	}
	unsubscribe(id) {
		this.subscriptions = this.subscriptions.filter(each => each.id !== id);
	}
	getAllPanConditions() {
		return this.subscriptions
			.map(each => each.getPanConditions());
	}
	setCursorClass(className) {
		this.eventCaptureNode.setCursorClass(className);
	}
	amIOnTop(id) {
		const dragableComponents = this.subscriptions
			.filter(each => each.getPanConditions().draggable);

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
	calculateStateForDomain(newDomain) {
		const {
			xAccessor,
			displayXAccessor,
			xScale: initialXScale,
			chartConfig: initialChartConfig,
			plotData: initialPlotData
		} = this.state;
		const { filterData } = this.state;
		const { fullData } = this;
		const { postCalculator } = this.props;

		const { plotData: beforePlotData, domain } = filterData(
			fullData,
			newDomain,
			xAccessor,
			initialXScale,
			{
				currentPlotData: initialPlotData,
				currentDomain: initialXScale.domain()
			}
		);

		const plotData = postCalculator(beforePlotData);
		const updatedScale = initialXScale.copy().domain(domain);
		const chartConfig = getChartConfigWithUpdatedYScales(
			initialChartConfig,
			{ plotData, xAccessor, displayXAccessor, fullData },
			updatedScale.domain()
		);

		return {
			xScale: updatedScale,
			plotData,
			chartConfig,
		};
	}
	pinchZoomHelper(initialPinch, finalPinch) {
		const { xScale: initialPinchXScale } = initialPinch;

		const {
			xScale: initialXScale,
			chartConfig: initialChartConfig,
			plotData: initialPlotData,
			xAccessor,
			displayXAccessor,
		} = this.state;
		const { filterData } = this.state;
		const { fullData } = this;
		const { postCalculator } = this.props;

		const { topLeft: iTL, bottomRight: iBR } = pinchCoordinates(initialPinch);
		const { topLeft: fTL, bottomRight: fBR } = pinchCoordinates(finalPinch);

		const e = initialPinchXScale.range()[1];

		const xDash = Math.round(-(iBR[0] * fTL[0] - iTL[0] * fBR[0]) / (iTL[0] - iBR[0]));
		const yDash = Math.round(e + ((e - iBR[0]) * (e - fTL[0]) - (e - iTL[0]) * (e - fBR[0])) / ((e - iTL[0]) - (e - iBR[0])));

		const x = Math.round(-xDash * iTL[0] / (-xDash + fTL[0]));
		const y = Math.round(e - (yDash - e) * (e - iTL[0]) / (yDash + (e - fTL[0])));

		const newDomain = [x, y].map(initialPinchXScale.invert);
		// var domainR = initial.right + right;

		const { plotData: beforePlotData, domain } = filterData(
			fullData,
			newDomain,
			xAccessor,
			initialPinchXScale,
			{
				currentPlotData: initialPlotData,
				currentDomain: initialXScale.domain()
			}
		);

		const plotData = postCalculator(beforePlotData);
		const updatedScale = initialXScale.copy().domain(domain);

		const mouseXY = finalPinch.touch1Pos;
		const chartConfig = getChartConfigWithUpdatedYScales(
			initialChartConfig,
			{ plotData, xAccessor, displayXAccessor, fullData },
			updatedScale.domain()
		);
		const currentItem = getCurrentItem(updatedScale, xAccessor, mouseXY, plotData);

		return {
			chartConfig,
			xScale: updatedScale,
			plotData,
			mouseXY,
			currentItem,
		};
	}
	cancelDrag() {
		this.eventCaptureNode.cancelDrag();
		this.triggerEvent("dragcancel");
	}
	handlePinchZoom(initialPinch, finalPinch, e) {
		if (!this.waitingForAnimationFrame) {
			this.waitingForAnimationFrame = true;
			const state = this.pinchZoomHelper(initialPinch, finalPinch);

			this.triggerEvent("pinchzoom", state, e);

			this.finalPinch = finalPinch;

			requestAnimationFrame(() => {
				this.clearBothCanvas();
				this.draw({ trigger: "pinchzoom" });
				this.waitingForAnimationFrame = false;
			});
		}
	}
	handlePinchZoomEnd(initialPinch, e) {
		const { xAccessor } = this.state;

		if (this.finalPinch) {
			const state = this.pinchZoomHelper(initialPinch, this.finalPinch);
			const { xScale } = state;
			this.triggerEvent("pinchzoom", state, e);

			this.finalPinch = null;

			this.clearThreeCanvas();

			const { fullData } = this;
			const firstItem = head(fullData);

			const start = head(xScale.domain());
			const end = xAccessor(firstItem);
			const { onLoadMore } = this.props;

			this.setState(state, () => {
				if (start < end) {
					onLoadMore(start, end);
				}
			});
		}
	}
	handleZoom(zoomDirection, mouseXY, e) {
		if (this.panInProgress)
			return;
		// console.log("zoomDirection ", zoomDirection, " mouseXY ", mouseXY);
		const { xAccessor, xScale: initialXScale, plotData: initialPlotData } = this.state;
		const { zoomMultiplier, zoomAnchor } = this.props;
		const { fullData } = this;
		const item = zoomAnchor({
			xScale: initialXScale,
			xAccessor,
			mouseXY,
			plotData: initialPlotData,
			fullData,
		});

		const cx = initialXScale(item);
		const c = zoomDirection > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier;
		const newDomain = initialXScale.range().map(x => cx + (x - cx) * c).map(initialXScale.invert);

		const { xScale, plotData, chartConfig } = this.calculateStateForDomain(newDomain);

		const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
		const currentCharts = getCurrentCharts(chartConfig, mouseXY);

		this.clearThreeCanvas();

		const firstItem = head(fullData);

		const start = head(xScale.domain());
		const end = xAccessor(firstItem);
		const { onLoadMore } = this.props;

		this.mutableState = {
			mouseXY: mouseXY,
			currentItem: currentItem,
			currentCharts: currentCharts,
		};

		this.triggerEvent("zoom", {
			xScale,
			plotData,
			chartConfig,
			mouseXY,
			currentCharts,
			currentItem,
			show: true,
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
		const firstItem = head(fullData);
		const start = head(xScale.domain());
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
			if (isDefined(each.draw))
				each.draw(props);
		});
	}
	redraw() {
		this.clearThreeCanvas();
		this.draw({ force: true });
	}
	panHelper(mouseXY, initialXScale, { dx, dy }, chartsToPan) {
		const { xAccessor, displayXAccessor, chartConfig: initialChartConfig } = this.state;
		const { filterData } = this.state;
		const { fullData } = this;
		const { postCalculator } = this.props;

		// console.log(dx, dy);
		if (isNotDefined(initialXScale.invert))
			throw new Error("xScale provided does not have an invert() method."
				+ "You are likely using an ordinal scale. This scale does not support zoom, pan");

		const newDomain = initialXScale.range().map(x => x - dx).map(initialXScale.invert);

		const { plotData: beforePlotData, domain } = filterData(
			fullData,
			newDomain,
			xAccessor,
			initialXScale,
			{
				currentPlotData: this.hackyWayToStopPanBeyondBounds__plotData,
				currentDomain: this.hackyWayToStopPanBeyondBounds__domain
			}
		);

		const updatedScale = initialXScale.copy().domain(domain);
		const plotData = postCalculator(beforePlotData);
		// console.log(last(plotData));

		const currentItem = getCurrentItem(updatedScale, xAccessor, mouseXY, plotData);
		const chartConfig = getChartConfigWithUpdatedYScales(
			initialChartConfig,
			{ plotData, xAccessor, displayXAccessor, fullData },
			updatedScale.domain(),
			dy,
			chartsToPan
		);
		const currentCharts = getCurrentCharts(chartConfig, mouseXY);

		// console.log(initialXScale.domain(), newDomain, updatedScale.domain());
		return {
			xScale: updatedScale,
			plotData,
			chartConfig,
			mouseXY,
			currentCharts,
			currentItem,
		};
	}
	handlePan(mousePosition, panStartXScale, dxdy, chartsToPan, e) {
		if (!this.waitingForPanAnimationFrame) {
			this.waitingForPanAnimationFrame = true;

			this.hackyWayToStopPanBeyondBounds__plotData = this.hackyWayToStopPanBeyondBounds__plotData || this.state.plotData;
			this.hackyWayToStopPanBeyondBounds__domain = this.hackyWayToStopPanBeyondBounds__domain || this.state.xScale.domain();

			const state = this.panHelper(mousePosition, panStartXScale, dxdy, chartsToPan);

			this.hackyWayToStopPanBeyondBounds__plotData = state.plotData;
			this.hackyWayToStopPanBeyondBounds__domain = state.xScale.domain();

			this.panInProgress = true;
			// console.log(panStartXScale.domain(), state.xScale.domain());

			this.triggerEvent("pan", state, e);

			this.mutableState = {
				mouseXY: state.mouseXY,
				currentItem: state.currentItem,
				currentCharts: state.currentCharts,
			};
			requestAnimationFrame(() => {
				this.waitingForPanAnimationFrame = false;
				this.clearBothCanvas();
				this.draw({ trigger: "pan" });
			});
		}
	}
	handlePanEnd(mousePosition, panStartXScale, dxdy, chartsToPan, e) {
		const state = this.panHelper(mousePosition, panStartXScale, dxdy, chartsToPan);
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

			const firstItem = head(fullData);
			const start = head(xScale.domain());
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
	handleMouseDown(mousePosition, currentCharts, e) {
		this.triggerEvent("mousedown", this.mutableState, e);
	}
	handleMouseEnter(e) {
		this.triggerEvent("mouseenter", {
			show: true,
		}, e);
	}
	handleMouseMove(mouseXY, inputType, e) {
		if (!this.waitingForAnimationFrame) {
			this.waitingForAnimationFrame = true;

			const { chartConfig, plotData, xScale, xAccessor } = this.state;
			const currentCharts = getCurrentCharts(chartConfig, mouseXY);
			const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
			this.triggerEvent("mousemove", {
				show: true,
				mouseXY,
				// prevMouseXY is used in interactive components
				prevMouseXY: this.prevMouseXY,
				currentItem,
				currentCharts,
			}, e);

			this.prevMouseXY = mouseXY;
			this.mutableState = {
				mouseXY,
				currentItem,
				currentCharts,
			};

			requestAnimationFrame(() => {
				this.clearMouseCanvas();
				this.draw({ trigger: "mousemove" });
				this.waitingForAnimationFrame = false;
			});
		}
	}
	handleMouseLeave(e) {
		this.triggerEvent("mouseleave", { show: false }, e);
		this.clearMouseCanvas();
		this.draw({ trigger: "mouseleave" });
	}
	handleDragStart({ startPos }, e) {
		this.triggerEvent("dragstart", { startPos }, e);
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

		this.mutableState = {
			mouseXY,
			currentItem,
			currentCharts,
		};

		requestAnimationFrame(() => {
			this.clearMouseCanvas();
			this.draw({ trigger: "drag" });
		});
	}
	handleDragEnd({ mouseXY }, e) {
		this.triggerEvent("dragend", { mouseXY }, e);

		requestAnimationFrame(() => {
			this.clearMouseCanvas();
			this.draw({ trigger: "dragend" });
		});
	}
	handleClick(mousePosition, e) {
		this.triggerEvent("click", this.mutableState, e);

		requestAnimationFrame(() => {
			this.clearMouseCanvas();
			this.draw({ trigger: "click" });
		});
	}
	handleDoubleClick(mousePosition, e) {
		this.triggerEvent("dblclick", {}, e);
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
			getMutableState: this.getMutableState,
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
		const { chartConfig: initialChartConfig } = this.state;

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

			newState = updateChart(
				calculatedState,
				this.state.xScale,
				nextProps,
				lastItemWasVisible,
				initialChartConfig,
			);
		}

		const { fullData, ...state } = newState;

		if (this.panInProgress) {
			if (process.env.NODE_ENV !== "production") {
				log("Pan is in progress");
			}
		} else {
			/*
			if (!reset) {
				state.chartConfig
					.forEach((each) => {
						// const sourceChartConfig = initialChartConfig.filter(d => d.id === each.id);
						const prevChartConfig = find(initialChartConfig, d => d.id === each.id);
						if (isDefined(prevChartConfig) && prevChartConfig.yPanEnabled) {
							each.yScale.domain(prevChartConfig.yScale.domain());
							each.yPanEnabled = prevChartConfig.yPanEnabled;
						}
					});
			}
			*/
			this.clearThreeCanvas();

			this.setState(state);
		}
		this.fullData = fullData;
	}
	/*
	componentDidUpdate(prevProps, prevState) {
		console.error(this.state.chartConfig, this.state.chartConfig.map(d => d.yScale.domain()));
	}
	*/
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
		// console.log("Happneing.....", !this.panInProgress)
		return !this.panInProgress;
	}
	render() {

		const { type, height, width, margin, className, zIndex, defaultFocus, ratio, mouseMoveEvent, panEvent, zoomEvent } = this.props;
		const { useCrossHairStyleCursor, onSelect } = this.props;

		const { plotData, xScale, xAccessor, chartConfig } = this.state;
		const dimensions = getDimensions(this.props);

		const interaction = isInteractionEnabled(xScale, xAccessor, plotData);

		const cursor = getCursorStyle(useCrossHairStyleCursor && interaction);
		return (
			<div style={{ position: "relative", width, height }} className={className} onClick={onSelect}>
				<CanvasContainer ref={this.saveCanvasContainerNode}
					type={type}
					ratio={ratio}
					width={width} height={height} zIndex={zIndex}/>
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
							pan={panEvent && interaction}

							width={dimensions.width}
							height={dimensions.height}
							chartConfig={chartConfig}
							xScale={xScale}
							xAccessor={xAccessor}
							focus={defaultFocus}

							getAllPanConditions={this.getAllPanConditions}
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
							onPinchZoomEnd={this.handlePinchZoomEnd}
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
	const interaction = !isNaN(xScale(xAccessor(head(data)))) && isDefined(xScale.invert);
	return interaction;
}

ChartCanvas.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	margin: PropTypes.object,
	ratio: PropTypes.number.isRequired,
	// interval: PropTypes.oneOf(["D", "W", "M"]), // ,"m1", "m5", "m15", "W", "M"
	type: PropTypes.oneOf(["svg", "hybrid"]),
	pointsPerPxThreshold: PropTypes.number,
	minPointsPerPxThreshold: PropTypes.number,
	data: PropTypes.array.isRequired,
	// initialDisplay: PropTypes.number,
	xAccessor: PropTypes.func,
	xExtents: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]),
	zoomAnchor: PropTypes.func,

	className: PropTypes.string,
	seriesName: PropTypes.string.isRequired,
	zIndex: PropTypes.number,
	children: PropTypes.node.isRequired,
	xScale: PropTypes.func.isRequired,
	postCalculator: PropTypes.func,
	flipXScale: PropTypes.bool,
	useCrossHairStyleCursor: PropTypes.bool,
	padding: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.shape({
			left: PropTypes.number,
			right: PropTypes.number,
		})
	]),
	defaultFocus: PropTypes.bool,
	zoomMultiplier: PropTypes.number,
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
	mouseMoveEvent: PropTypes.bool,
	panEvent: PropTypes.bool,
	clamp: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	zoomEvent: PropTypes.bool,
	onSelect: PropTypes.func,
	maintainPointsPerPixelOnResize: PropTypes.bool,
};

ChartCanvas.defaultProps = {
	margin: { top: 20, right: 30, bottom: 30, left: 80 },
	type: "hybrid",
	pointsPerPxThreshold: 2,
	minPointsPerPxThreshold: 1 / 100,
	className: "react-stockchart",
	zIndex: 1,
	xExtents: [min, max],
	postCalculator: identity,
	padding: 0,
	xAccessor: identity,
	flipXScale: false,
	useCrossHairStyleCursor: true,
	defaultFocus: true,
	onLoadMore: noop,
	onSelect: noop,
	mouseMoveEvent: true,
	panEvent: true,
	zoomEvent: true,
	zoomMultiplier: 1.1,
	clamp: false,
	zoomAnchor: mouseBasedZoomAnchor,
	maintainPointsPerPixelOnResize: true,
	// ratio: 2,
};

ChartCanvas.childContextTypes = {
	plotData: PropTypes.array,
	fullData: PropTypes.array,
	chartConfig: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
	getMutableState: PropTypes.func,
};

ChartCanvas.ohlcv = d => ({ date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume });

export default ChartCanvas;
