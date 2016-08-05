"use strict";

import React, { PropTypes, Component } from "react";

import {
	last,
	isDefined,
	isNotDefined,
	clearCanvas,
	shallowEqual,
} from "./utils";

import EventCapture from "./EventCapture";
import { getNewChartConfig, getChartConfigWithUpdatedYScales, getCurrentCharts, getCurrentItem } from "./utils/ChartDataUtil";

function setXRange(xScale, dimensions, padding, direction = 1) {
	if (xScale.rangeRoundPoints) {
		if (isNaN(padding)) throw new Error("padding has to be a number for ordinal scale");
		xScale.rangeRoundPoints([0, dimensions.width], padding);
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

function compareArray(a, b) {
	if (a.length === b.length) {
		var result = true;
		for (var i = 0; i < a.length; i++) {
			result = result && shallowEqual(a[i], b[i]);
		}
		return result;
	}
	return false;
}
/*
function compareChildren(current, after) {
	var curr = React.Children.toArray(current)
	var next = React.Children.toArray(after)

	if (curr.length === next.length) {
		var result = true;
		for (var i = 0; i < curr.length; i++) {
			let { children: currChildren, ...currProps } = curr[i].props;
			let { children: nextChildren, ...nextProps } = next[i].props;

			// compare props except children
			result = result && shallowEqual(currProps, nextProps)

			if (isDefined(currChildren) && isDefined(nextChildren)) {
				// recursively call compareChildren
				result = result && compareChildren(currChildren, nextChildren)
			} else if (isNotDefined(currChildren) && isNotDefined(nextChildren)) {
				// do nothing
			} else {
				return false;
			}
		}
		return result;
	}
	return false
}*/

class EventHandler extends Component {
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
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.getCanvasContexts = this.getCanvasContexts.bind(this);
		this.xAxisZoom = this.xAxisZoom.bind(this);
		this.yAxisZoom = this.yAxisZoom.bind(this);
		this.calculateStateForDomain = this.calculateStateForDomain.bind(this);

		// this.pushCallbackForCanvasDraw = this.pushCallbackForCanvasDraw.bind(this);
		// this.getAllCanvasDrawCallback = this.getAllCanvasDrawCallback.bind(this);

		this.pinchCoordinates = this.pinchCoordinates.bind(this);
		this.setInteractiveState = this.setInteractiveState.bind(this);
		this.getInteractiveState = this.getInteractiveState.bind(this);

		this.subscriptions = [];
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
		// this.canvasDrawCallbackList = [];
		this.panHappened = false;
		this.interactiveState = [];

		this.state = {
			focus: false,
			// currentItem: {},
			show: false,
			mouseXY: [0, 0],
			panInProgress: false,
			currentCharts: [],
			receivedProps: 0,
		};
	}
	componentWillMount() {

		/* var props = { padding, type, margin, postCalculator };
		var stateProps = { plotData, filterData, xScale, xAccessor, dataAltered }; */

		var { plotData, direction } = this.props;
		var { xScale, dimensions, children, postCalculator, padding } = this.props;

		plotData = postCalculator(plotData);

		var chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), plotData);

		this.setState({
			xScale: setXRange(xScale, dimensions, padding, direction),
			plotData,
			chartConfig,
		});
	}
	componentWillReceiveProps(nextProps) {
		var { plotData, padding, direction, lastItem, filterData } = nextProps;
		var { xScale, xAccessor, dimensions, children, postCalculator, dataAltered } = nextProps;

		var reset = !shallowEqual(this.props.plotData, nextProps.plotData);

		var newState;
		if (reset) {
			if (process.env.NODE_ENV !== "production") {
				console.log("DATA VIEW PORT CHANGED - CHART RESET");
			}

			plotData = postCalculator(plotData);

			let chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), plotData);

			newState = {
				xScale: setXRange(xScale, dimensions, padding, direction),
				plotData,
				chartConfig,
			};
		} else if (dataAltered
				&& this.props.lastItem === last(this.state.plotData)
				/* && xAccessor(this.props.lastItem) >= xAccessor(last(this.state.plotData))
				&& xAccessor(this.props.lastItem) <= xAccessor(last(this.state.plotData))*/) {

			if (process.env.NODE_ENV !== "production") {
				console.log("DATA CHANGED AND LAST ITEM VISIBLE");
			}
			// if last item was visible, then shift
			var [start, end] = this.state.xScale.domain();

			var updatedXScale = setXRange(xScale, dimensions, padding, direction);
			updatedXScale.domain([start, end]);

			if (end >= xAccessor(lastItem)) {
				// get plotData between [start, end] and do not change the domain
				plotData = filterData([start, end], xAccessor).plotData;
			} else {
				// get plotData between [xAccessor(l) - (end - start), xAccessor(l)] and DO change the domain
				var dx = updatedXScale(xAccessor(lastItem)) - updatedXScale.range()[1];
				var [newStart, newEnd] = updatedXScale.range().map(x => x + dx).map(updatedXScale.invert);

				plotData = filterData([newStart, newEnd], xAccessor).plotData;
				updatedXScale.domain([newStart, newEnd]);
			}
			// plotData = getDataOfLength(fullData, showingInterval, plotData.length)
			plotData = postCalculator(plotData);
			let chartConfig = getChartConfigWithUpdatedYScales(getNewChartConfig(dimensions, children), plotData);

			newState = {
				xScale: updatedXScale,
				chartConfig,
				plotData,
			};
		} else {
			console.log("TRIVIAL CHANGE");
			// this.state.plotData or plotData

			plotData = postCalculator(filterData(this.state.xScale.domain(), xAccessor).plotData);

			let chartConfig = getChartConfigWithUpdatedYScales(
				getNewChartConfig(dimensions, children), plotData);

			newState = {
				xScale: setXRange(xScale, dimensions, padding, direction).domain(this.state.xScale.domain()),
				chartConfig,
				plotData,
			};
		}

		if (isDefined(newState)) {
			if (!this.state.panInProgress) {
				this.clearThreeCanvas(nextProps);
				// this.clearInteractiveCanvas(nextProps);
				// this.clearCanvasDrawCallbackList();
			}
			var { chartConfig: initialChartConfig } = this.state;

			var a = newState.chartConfig.map(each => each.realYDomain);
			var b = initialChartConfig.map(each => each.realYDomain);

			if (compareArray(a, b)) {
				newState.chartConfig
					.forEach((each, idx) => {
						each.yScale.domain(initialChartConfig[idx].yScale.domain());
						each.yPanEnabled = initialChartConfig[idx].yPanEnabled;
					});
			}

			this.setState({
				...newState,
				receivedProps: this.state.receivedProps + 1,
			});
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !(this.state.receivedProps < nextState.receivedProps
					&& this.props.type === "hybrid"
					&& this.state.panInProgress)
				&& !(this.state.panInProgress
					&& this.props.type === "hybrid"
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
	clearMouseCanvas(props) {
		props = props || this.props;
		var canvases = props.canvasContexts();
		if (canvases && canvases.mouseCoord) {
			// console.log("CLEAR");
			clearCanvas([canvases.mouseCoord]);
		}
	}
	clearThreeCanvas(props) {
		props = props || this.props;
		var canvases = props.canvasContexts();
		if (canvases && canvases.axes) {
			// console.log("CLEAR");
			clearCanvas([canvases.axes, canvases.mouseCoord, canvases.bg]);
		}
	}
	/* clearInteractiveCanvas(props) {
		// DO NOTHING, since now the interactive canvas is no longer used
		props = props || this.props;
		var canvases = props.canvasContexts();
		if (canvases && canvases.interactive) {
			// console.error("CLEAR");
			clearCanvas([canvases.interactive]);
		}
	}*/
	subscribe(id, callback) {
		this.subscriptions = this.subscriptions.concat({
			id, callback
		});
	}
	unsubscribe(id) {
		this.subscriptions = this.subscriptions.filter(each => each.id !== id);
	}
	getChildContext() {
		return {
			plotData: this.state.plotData,
			chartConfig: this.state.chartConfig,
			width: this.props.dimensions.width,
			height: this.props.dimensions.height,
			chartCanvasType: this.props.type,
			xScale: this.state.xScale,
			xAccessor: this.props.xAccessor,
			displayXAccessor: this.props.displayXAccessor,
			margin: this.props.margin,
			xAxisZoom: this.xAxisZoom,
			yAxisZoom: this.yAxisZoom,
			getInteractiveState: this.getInteractiveState,
			setInteractiveState: this.setInteractiveState,
			getCanvasContexts: this.getCanvasContexts,
			subscribe: this.subscribe,
			unsubscribe: this.unsubscribe,
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
	getCanvasContexts() {
		// console.log(this.state.canvases, this.props.canvasContexts())
		return this.state.canvases || this.props.canvasContexts();
	}
	handleMouseEnter(e) {
		this.triggerEvent("mouseenter", {
			show: true,
		}, e);
	}
	handleMouseMove(mouseXY, inputType, e) {
		var { chartConfig, plotData, xScale } = this.state;
		var { xAccessor } = this.props;

		var currentCharts = getCurrentCharts(chartConfig, mouseXY);

		var currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
		// optimization oportunity do not change currentItem if it is not the same as prev

		requestAnimationFrame(() => {
			this.clearMouseCanvas();
			this.triggerEvent("mousemove", {
				mouseXY,
				currentItem,
				currentCharts,
			}, e);
		});
		// console.log(interactiveState === this.state.interactiveState);
		// if (interactiveState !== this.state.interactiveState) this.clearInteractiveCanvas();

		/* this.setState({
			mouseXY,
			currentItem,
			currentCharts,
			// show: true,
			// interactiveState,
		}); */
	}
	handleContextMenu(mouseXY, e) {
		var { chartConfig, plotData, xScale } = this.state;
		var { xAccessor } = this.props;

		var currentCharts = getCurrentCharts(chartConfig, mouseXY);
		var currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);

		this.contextMenuClicked = true;
		setTimeout(() => {
			this.contextMenuClicked = false;
		}, 300);

		this.triggerEvent("contextmenu", {
			mouseXY,
			currentItem,
			currentCharts,
		}, e);
	}
	handleMouseLeave(e) {
		var contexts = this.getCanvasContexts();

		// this.clearInteractiveCanvas();

		if (contexts && contexts.mouseCoord) {
			clearCanvas([contexts.mouseCoord]);
		}
		this.triggerEvent("mouseleave", { show: false }, e);
		/* this.setState({
			show: false
		}); */
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

		var { xScale: initialXScale, chartConfig: initialChartConfig, plotData: initialPlotData } = this.state;
		var { xAccessor, filterData, postCalculator } = this.props;

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

		var { plotData, domain } = filterData(newDomain,
			xAccessor,
			initialPlotData,
			initialXScale.domain());

		plotData = postCalculator(plotData);
		var updatedScale = initialXScale.copy().domain(domain);

		var chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData);

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
		var { xScale: initialXScale, plotData: initialPlotData } = this.state;
		var { xAccessor } = this.props;

		var item = getCurrentItem(initialXScale, xAccessor, mouseXY, initialPlotData),
			cx = initialXScale(xAccessor(item)),
			c = zoomDirection > 0 ? 2 : 0.5,
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

		this.setState({
			xScale,
			plotData,
			chartConfig,
		});
	}
	calculateStateForDomain(newDomain) {
		var { xScale: initialXScale, chartConfig: initialChartConfig, plotData: initialPlotData } = this.state;
		var { xAccessor, filterData, postCalculator } = this.props;

		var { plotData, domain } = filterData(newDomain,
			xAccessor,
			initialPlotData,
			initialXScale.domain());

		plotData = postCalculator(plotData);
		var updatedScale = initialXScale.copy().domain(domain);
		var chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData);

		return {
			xScale: updatedScale,
			plotData,
			chartConfig,
		};
	}
	xAxisZoom(newDomain) {
		var { xScale, plotData, chartConfig } = this.calculateStateForDomain(newDomain);
		this.clearBothCanvas();

		this.setState({ xScale, plotData, chartConfig });
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
	handlePanStart(panStartDomain, panOrigin, dxy) {
		// console.log("panStartDomain - ", panStartDomain, ", panOrigin - ", panOrigin);
		if (!this.state.panInProgress) {
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
	}
	panHelper(mouseXY) {
		var { panStartXScale: initialXScale, chartConfig: initialChartConfig } = this.state;
		var { panOrigin } = this.state;
		var { xAccessor, filterData, postCalculator } = this.props;

		var dx = mouseXY[0] - panOrigin[0];
		var dy = mouseXY[1] - panOrigin[1];

		if (isNotDefined(initialXScale.invert))
			throw new Error("xScale provided does not have an invert() method."
				+ "You are likely using an ordinal scale. This scale does not support zoom, pan");

		var newDomain = initialXScale.range().map(x => x - dx).map(initialXScale.invert);

		var { plotData, domain } = filterData(newDomain,
			xAccessor,
			this.hackyWayToStopPanBeyondBounds__plotData,
			this.hackyWayToStopPanBeyondBounds__domain);

		var updatedScale = initialXScale.copy().domain(domain);
		plotData = postCalculator(plotData);
		// console.log(last(plotData));
		var currentItem = getCurrentItem(updatedScale, xAccessor, mouseXY, plotData);

		var chartConfig = getChartConfigWithUpdatedYScales(initialChartConfig, plotData, dy, false);

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
	triggerEvent(type, props, e) {
		this.subscriptions.forEach(each => {
			// console.log(each)
			each.callback(type, props, e);
		});
	}
	handlePan(mousePosition, e) {
		this.panHappened = true;
		var state = this.panHelper(mousePosition);

		this.hackyWayToStopPanBeyondBounds__plotData = state.plotData;
		this.hackyWayToStopPanBeyondBounds__domain = state.xScale.domain();

		// if (this.props.type !== "svg") {
			// var { axes: axesCanvasContext, mouseCoord: mouseContext } = this.getCanvasContexts();
			// var { mouseXY, chartConfig, plotData, currentItem, xScale, currentCharts } = state;
			// var { show } = this.state;
			// var { canvasDrawCallbackList } = this;

		requestAnimationFrame(() => {
				// this.clearCanvas([axesCanvasContext, mouseContext]);
				// this.clearCanvas([axesCanvasContext, mouseContext]);
			this.clearBothCanvas();
			this.triggerEvent("pan", state, e);
				// this.clearInteractiveCanvas();

				// console.log(canvasDrawCallbackList.length)

				/* chartConfig.forEach(eachChart => {
					canvasDrawCallbackList
						.filter(each => eachChart.id === each.chartId)
						.forEach(each => {
							var { yScale } = eachChart;

							if (each.type === "axis") {
								each.draw(axesCanvasContext, xScale, yScale);
							} else if (each.type === "currentcoordinate") {
								each.draw(mouseContext, show, xScale, yScale, currentItem);
							} else if (each.type === "mouse") {
								each.draw(mouseContext, show, xScale, mouseXY, currentCharts, eachChart, currentItem);
							} else if (each.type !== "interactive") {
								each.draw(axesCanvasContext, xScale, yScale, plotData);
							}
						});

				});
				canvasDrawCallbackList
					.filter(each => isNotDefined(each.chartId))
					.filter(each => each.type === "axis")
					.forEach(each => each.draw(axesCanvasContext, chartConfig));

				canvasDrawCallbackList
					.filter(each => each.type === "mouse")
					.filter(each => isNotDefined(each.chartId))
					.forEach(each => each.draw(mouseContext, show,
						xScale, mouseXY, currentCharts, chartConfig, currentItem));

				canvasDrawCallbackList
					.filter(each => each.type === "annotation")
					.forEach(each => each.draw({
						xScale,
						chartConfig,
						plotData,
						mouseXY,
						currentCharts,
						currentItem
					}));*/

		});
		/* } else {
			this.setState(state);
		}*/
	}
	/* clearCanvasDrawCallbackList() {
		this.canvasDrawCallbackList = [];
	}*/
	handlePanEnd(mousePosition, e) {
		var state = this.panHelper(mousePosition);
		// console.log(this.canvasDrawCallbackList.map(d => d.type));
		this.hackyWayToStopPanBeyondBounds__plotData = null;
		this.hackyWayToStopPanBeyondBounds__domain = null;

		// this.clearCanvasDrawCallbackList();

		if (!this.panHappened) {

			if (!this.contextMenuClicked) {
				if (this.clicked) {
					this.triggerEvent("dblclick", {}, e);
					this.clicked = false;
				} else {
					this.triggerEvent("click", {}, e);
					this.clicked = true;
					setTimeout(() => {
						this.clicked = false;
					}, 300);
				}
			}

			this.setState({
				panInProgress: false,
				panStartXScale: null,
			});
		} else {
			this.clearThreeCanvas();
			this.triggerEvent("panend", state, e);

			var {
				xScale,
				plotData,
				chartConfig,
			} = state;

			this.setState({
				xScale,
				plotData,
				chartConfig,
				panInProgress: false,
				panStartXScale: null,
			});
		}
		// console.log(interactiveState[0].interactive);
	}
	setInteractiveState(id, chartId, interactive) {
		var everyThingElse = this.interactiveState
			.filter(each => !(each.id === id && each.chartId === chartId));

		this.interactiveState = everyThingElse.concat({ id, chartId, interactive });
	}
	getInteractiveState(forChart, id, initialState) {
		var state = this.interactiveState
			.filter(each => each.chartId === forChart)
			.filter(each => each.id === id);

		var response = (state.length > 0)
			? response = state[0].interactive
			: initialState;
		return response;
	}
	handleFocus(focus) {
		// console.log(focus);interactive
		this.setState({
			focus: focus,
		});
	}
	render() {
		var { xScale } = this.state;
		var { xAccessor, interaction } = this.props;
		// var { dimensions } = this.props;
		return (
			<g>
				<EventCapture
					mouseMove={interaction}
					zoom={interaction}
					pan={interaction}
					onContextMenu={this.handleContextMenu}/>
				<g className="react-stockcharts-avoid-interaction">
					{this.props.children}
				</g>
			</g>
		);
	}
}
EventHandler.propTypes = {
	children: PropTypes.node.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	xAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func.isRequired,
	// interval: PropTypes.string,
	dimensions: PropTypes.object,
	postCalculator: PropTypes.func.isRequired,
	canvasContexts: PropTypes.func.isRequired,
	margin: PropTypes.object.isRequired,
	plotData: PropTypes.array,
	padding: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.shape({
			left: PropTypes.number,
			right: PropTypes.number,
		})
	]).isRequired,
	direction: PropTypes.oneOf([-1, 1]).isRequired,
	lastItem: PropTypes.object,
	displayXAccessor: PropTypes.func,
	filterData: PropTypes.func,
	// showingInterval: PropTypes.string,
};

EventHandler.childContextTypes = {
	plotData: PropTypes.array,
	data: PropTypes.array,
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
			yExtents: PropTypes.arrayOf(PropTypes.func).isRequired,
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
	currentItem: PropTypes.object,
	show: PropTypes.bool,
	mouseXY: PropTypes.array,
	// interval: PropTypes.string,
	currentCharts: PropTypes.array,
	mainChart: PropTypes.number,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	chartCanvasType: PropTypes.oneOf(["svg", "hybrid"]).isRequired,

	margin: PropTypes.object.isRequired,
	dataTransform: PropTypes.array,

	getInteractiveState: PropTypes.func.isRequired,
	setInteractiveState: PropTypes.func,
	// callbackForCanvasDraw: PropTypes.func,
	// getAllCanvasDrawCallback: PropTypes.func,
	getCanvasContexts: PropTypes.func,
	xAxisZoom: PropTypes.func,
	yAxisZoom: PropTypes.func,
	subscribe: PropTypes.func,
	unsubscribe: PropTypes.func,
	onMouseMove: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	onZoom: PropTypes.func,
	onPinchZoom: PropTypes.func,
	onPanStart: PropTypes.func,
	onPan: PropTypes.func,
	onPanEnd: PropTypes.func,
	panInProgress: PropTypes.bool.isRequired,
	focus: PropTypes.bool.isRequired,
	onFocus: PropTypes.func,
	deltaXY: PropTypes.arrayOf(Number),
};

export default EventHandler;
