"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import makeInteractive from "./makeInteractive";
import { isDefined, head, last, noop, d3Window, MOUSEMOVE, MOUSEUP } from "../utils";

function getYValue(values, currentValue) {
	var diff = values
		.map(each => each - currentValue)
		.reduce((diff1, diff2) => Math.abs(diff1) < Math.abs(diff2) ? diff1 : diff2);
	return currentValue + diff;
}

class TrendLine extends Component {
	constructor(props) {
		super(props);
		this.onMousemove = this.onMousemove.bind(this);
		this.onClick = this.onClick.bind(this);

		this.handleEnter = this.handleEnter.bind(this);
		this.handleLeave = this.handleLeave.bind(this);
		this.handleEdgeMouseDown = this.handleEdgeMouseDown.bind(this);
		this.handleEdgeDrag = this.handleEdgeDrag.bind(this);
		this.handleEdgeDrop = this.handleEdgeDrop.bind(this);

		this.handleLineMouseDown = this.handleLineMouseDown.bind(this);

		this.state = {
			hover: null,
		};
	}
	removeLast(interactive) {
		var { trends, start } = interactive;
		if (!start && trends.length > 0) {
			return { ...interactive, trends: trends.slice(0, trends.length - 1) };
		}
		return interactive;
	}
	terminate(interactive) {
		var { start } = interactive;
		if (start) {
			return { ...interactive, start: null };
		}
		return interactive;
	}
	onMousemove(state) {
		var {
			// xScale,
			// plotData,
			mouseXY,
			// currentCharts,
			currentItem,
			chartConfig,
			interactiveState,
			eventMeta,
		} = state;

		var { yScale } = chartConfig;
		var currentPos = currentPosition(this.props, { eventMeta, mouseXY, currentItem, yScale });
		var status = "inprogress";

		return { ...interactiveState, currentPos, status };
	}
	onClick(state) {
		var {
			// xScale,
			// plotData,
			mouseXY,
			// currentCharts,
			currentItem,
			chartConfig,
			interactiveState,
			eventMeta,
		} = state;

		var { enabled, snapTo, snap, shouldDisableSnap } = this.props;
		var { xAccessor } = this.props;

		if (enabled) {
			var { start, trends } = interactiveState;

			var { yScale } = chartConfig;
			var [xValue, yValue] = xy(snapTo, snap, shouldDisableSnap, xAccessor, eventMeta, currentItem, mouseXY, yScale);

			if (isDefined(start)) {
				return {
					...interactiveState,
					start: null,
					currentPos: null,
					trends: trends.concat({ start, end: [xValue, yValue] }),
					status: "complete",
				};
			} else if (eventMeta.button === 0) {
				return {
					...interactiveState,
					start: [xValue, yValue],
					status: "start",
				};
			}
		}
		return interactiveState;
	}
	handleEnter(idx) {
		this.setState({
			hover: idx
		});
	}
	handleLeave() {
		this.setState({
			hover: null
		});
	}
	handleLineMouseDown(idx, e) {
		var captureDOM = this.refs.trend;

		var { mouseXY, chartConfig, xAccessor, currentItem } = this.props;
		var { yScale } = chartConfig;

		var startY = mouseXY[1];
		this.moveStartPosition = [xAccessor(currentItem), yScale.invert(startY)];

		var win = d3Window(captureDOM);
		d3.select(win)
			.on(MOUSEMOVE, this.handleLineDrag.bind(this, idx))
			.on(MOUSEUP, this.handleLineDrop.bind(this, idx));
		e.preventDefault();
	}
	handleLineDrag(idx) {
		var { mouseXY, chartConfig, xAccessor, currentItem, interactiveState } = this.props;
		var { yScale } = chartConfig;

		var endXValue = xAccessor(currentItem);
		var endYValue = yScale.invert(mouseXY[1]);

		var [startXValue, startYValue] = this.moveStartPosition;

		var dx = endXValue - startXValue;
		var dy = endYValue - startYValue;

		var { start, end } = interactiveState.trends[idx];

		this.setState({
			hover: idx,
			override: {
				index: idx,
				x1: start[0] + dx,
				y1: start[1] + dy,
				x2: end[0] + dx,
				y2: end[1] + dy,
			}
		});
	}
	handleLineDrop(idx) {
		var { overrideInteractive, interactiveState } = this.props;
		var { override } = this.state;

		if (isDefined(override)) {
			var { x1, y1, x2, y2 } = override;
			var newTrend = {
				start: [x1, y1],
				end: [x2, y2]
			};

			var trends = interactiveState.trends
				.map((each, i) => (i === idx) ? newTrend : each);

			overrideInteractive({ trends }, () => {
				this.setState({
					override: null,
					hover: null,
				});
			});
		}

		this.moveStartPosition = null;
		var captureDOM = this.refs.trend;
		var win = d3Window(captureDOM);
		d3.select(win)
			.on(MOUSEMOVE, null)
			.on(MOUSEUP, null);
	}
	handleEdgeMouseDown(side, idx, e) {
		var captureDOM = this.refs.trend;

		var win = d3Window(captureDOM);
		d3.select(win)
			.on(MOUSEMOVE, this.handleEdgeDrag.bind(this, side, idx))
			.on(MOUSEUP, this.handleEdgeDrop.bind(this, side, idx));
		e.preventDefault();
	}
	handleEdgeDrag(side, idx) {
		var { mouseXY, chartConfig, xAccessor, currentItem } = this.props;
		var { yScale } = chartConfig;

		var xValue = xAccessor(currentItem);
		var yValue = yScale.invert(mouseXY[1]);

		if (side === "left") {
			this.setState({
				hover: idx,
				override: {
					index: idx,
					x1: xValue,
					y1: yValue,
				}
			});
		} else {
			this.setState({
				hover: idx,
				override: {
					index: idx,
					x2: xValue,
					y2: yValue,
				}
			});
		}

		// console.log("DRAG", side, idx, mouseXY)
	}
	handleEdgeDrop(side, idx) {
		// console.log("DROP", side, idx)

		var captureDOM = this.refs.trend;
		var { overrideInteractive, interactiveState } = this.props;

		var trend = interactiveState.trends[idx];
		var newTrend = trend;

		var { override } = this.state;
		if (isDefined(override)) {
			var { x1, y1, x2, y2 } = override;
			if (isDefined(x1) && isDefined(y1)) {
				newTrend = {
					start: [x1, y1],
					end: trend.end
				};
			} else if (isDefined(x2) && isDefined(y2)) {
				newTrend = {
					start: trend.start,
					end: [x2, y2],
				};
			}

			var trends = interactiveState.trends
				.map((each, i) => (i === idx) ? newTrend : each);


			overrideInteractive({ trends }, () => {
				this.setState({
					override: null,
					hover: null,
				});
			});
		}

		var win = d3Window(captureDOM);
		d3.select(win)
			.on(MOUSEMOVE, null)
			.on(MOUSEUP, null);
	}
	render() {

		var { enabled, endPointCircleFill, endPointCircleRadius } = this.props;
		var { xScale, chartConfig, plotData, xAccessor, interactiveState, show } = this.props;

		var { yScale } = chartConfig;

		var { currentPositionStroke, currentPositionStrokeWidth, currentPositionOpacity, currentPositionRadius } = this.props;
		var { stroke, opacity, type } = this.props;

		var { currentPos } = interactiveState;

		var circle = (currentPos && enabled && show)
			? <circle className="react-stockcharts-avoid-interaction" cx={xScale(currentPos[0])} cy={yScale(currentPos[1])}
				stroke={currentPositionStroke}
				opacity={currentPositionOpacity}
				fill="none"
				strokeWidth={currentPositionStrokeWidth}
				r={currentPositionRadius} />
			: null;

		var lines = helper(plotData, type, xAccessor, interactiveState);
		var adjustClassName = !enabled ? "react-stockcharts-move-cursor" : "";

		var { override, hover } = this.state;


		var className = enabled || isDefined(override) ? "react-stockcharts-avoid-interaction" : "";

		return (
			<g ref="trend" className={className}>
				{circle}
				{lines
					.map((coords, idx) => {
						var x1 = xScale(getCoordinate(idx, override, coords, "x1"));
						var y1 = yScale(getCoordinate(idx, override, coords, "y1"));
						var x2 = xScale(getCoordinate(idx, override, coords, "x2"));
						var y2 = yScale(getCoordinate(idx, override, coords, "y2"));

						var circleOpacity = hover === idx ? 0.5 : 0.1;
						var strokeWidth = hover === idx ? 2 : 1;

						return (<g key={idx}>
							<line className={adjustClassName}
								x1={x1} y1={y1} x2={x2} y2={y2}
								stroke={stroke} strokeWidth={strokeWidth}
								opacity={opacity} />
							<ClickableLine className={adjustClassName} idx={idx}
								onMouseEnter={this.handleEnter}
								onMouseLeave={this.handleLeave}
								onMouseDown={this.handleLineMouseDown}
								x1={x1} y1={y1} x2={x2} y2={y2}
								stroke={stroke} strokeWidth={8} opacity={0} />
							<ClickableCircle className={adjustClassName} idx={idx} side="left"
								onMouseEnter={this.handleEnter}
								onMouseLeave={this.handleLeave}
								onMouseDown={this.handleEdgeMouseDown}
								cx={x1} cy={y1} r={endPointCircleRadius}
								fill={endPointCircleFill} opacity={circleOpacity} />
							<ClickableCircle className={adjustClassName} idx={idx} side="right"
								onMouseEnter={this.handleEnter}
								onMouseLeave={this.handleLeave}
								onMouseDown={this.handleEdgeMouseDown}
								cx={x2} cy={y2} r={endPointCircleRadius}
								fill={endPointCircleFill} opacity={circleOpacity} />
						</g>);
					})
				}
			</g>
		);
	}
}

/* eslint-disable react/prop-types */
class ClickableLine extends Component {
	constructor(props) {
		super(props);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
	}
	handleMouseEnter(e) {
		var { idx, onMouseEnter } = this.props;
		onMouseEnter(idx, e);
	}
	handleMouseLeave(e) {
		var { idx, onMouseLeave } = this.props;
		onMouseLeave(idx, e);
	}
	handleMouseDown(e) {
		var { idx, onMouseDown } = this.props;
		onMouseDown(idx, e);
	}
	render() {
		var { className, x1, x2, y1, y2, stroke, strokeWidth, opacity } = this.props;

		return <line className={className}
			onMouseEnter={this.handleEnter}
			onMouseLeave={this.handleLeave}
			onMouseDown={this.handleMouseDown}
			x1={x1} y1={y1} x2={x2} y2={y2}
			stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} />;
	}
}

class ClickableCircle extends Component {
	constructor(props) {
		super(props);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
	}
	handleMouseEnter(e) {
		var { idx, onMouseEnter } = this.props;
		onMouseEnter(idx, e);
	}
	handleMouseLeave(e) {
		var { idx, onMouseLeave } = this.props;
		onMouseLeave(idx, e);
	}
	handleMouseDown(e) {
		var { idx, side, onMouseDown } = this.props;
		onMouseDown(side, idx, e);
	}
	render() {
		var { className, cx, cy, r, fill, opacity } = this.props;

		return <circle className={className}
			onMouseEnter={this.handleMouseEnter}
			onMouseLeave={this.handleMouseLeave}
			onMouseDown={this.handleMouseDown}
			cx={cx} cy={cy} r={r}
			fill={fill} opacity={opacity} />;
	}
}
/* eslint-enable react/prop-types */

function getCoordinate(idx, override, coords, key) {
	if (isDefined(override)) {
		var { index } = override;
		if (index === idx) {
			if (isDefined(override[key])) {
				return override[key];
			}
		}
	}
	return coords[key];
}

function currentPosition({ enabled, snapTo, snap, shouldDisableSnap, xAccessor }, { eventMeta, mouseXY, currentItem, yScale }) {
	if (enabled && eventMeta && currentItem) {

		return xy(snapTo, snap, shouldDisableSnap, xAccessor, eventMeta, currentItem, mouseXY, yScale);
	}
}

function xy(snapTo, snap, shouldDisableSnap, xAccessor, eventMeta, currentItem, mouseXY, yScale) {
	var yValue = (snap && !shouldDisableSnap(eventMeta))
		? getYValue(snapTo(currentItem), yScale.invert(mouseXY[1]))
		: yScale.invert(mouseXY[1]);
	var xValue = xAccessor(currentItem);

	return [xValue, yValue];
}

function helper(plotData, type, xAccessor, interactive/* , chartConfig */) {
	var { currentPos, start, trends } = interactive;
	var temp = trends;
	if (start && currentPos) {
		temp = temp.concat({ start, end: currentPos });
	}
	var lines = temp
		.filter(each => each.start[0] !== each.end[0])
		.map((each) => generateLine(type, each.start, each.end, xAccessor, plotData));

	return lines;
}

function generateLine(type, start, end, xAccessor, plotData) {
	/* if (end[0] - start[0] === 0) {
		// vertical line
		throw new Error("Trendline cannot be a vertical line")
	} */
	var m /* slope */ = (end[1] - start[1]) / (end[0] - start[0]);
	var b /* y intercept */ = -1 * m * end[0] + end[1];
	// y = m * x + b
	var x1 = type === "XLINE"
		? xAccessor(plotData[0])
		: start[0]; // RAY or LINE start is the same

	var y1 = m * x1 + b;

	var x2 = type === "XLINE"
		? xAccessor(last(plotData))
		: type === "RAY"
			? end[0] > start[0] ? xAccessor(last(plotData)) : xAccessor(head(plotData))
			: end[0];
	var y2 = m * x2 + b;
	return { x1, y1, x2, y2 };
}

TrendLine.propTypes = {
	snap: PropTypes.bool.isRequired,
	show: PropTypes.bool,
	enabled: PropTypes.bool.isRequired,
	snapTo: PropTypes.func,
	shouldDisableSnap: PropTypes.func.isRequired,
	chartCanvasType: PropTypes.string,
	chartConfig: PropTypes.object,
	plotData: PropTypes.array,
	xScale: PropTypes.func,
	xAccessor: PropTypes.func,
	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	interactive: PropTypes.object,
	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,
	stroke: PropTypes.string,
	opacity: PropTypes.number,
	type: PropTypes.oneOf([
		"XLINE", // extends from -Infinity to +Infinity
		"RAY", // extends to +/-Infinity in one direction
		"LINE", // extends between the set bounds
	]),
	interactiveState: PropTypes.object,
	currentItem: PropTypes.object,
	mouseXY: PropTypes.array,
	overrideInteractive: PropTypes.func,
	endPointCircleFill: PropTypes.string,
	endPointCircleRadius: PropTypes.number,
};

TrendLine.defaultProps = {
	stroke: "#000000",
	type: "XLINE",
	opacity: 0.7,
	onStart: noop,
	onComplete: noop,
	shouldDisableSnap: e => (e.button === 2 || e.shiftKey),
	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,
	endPointCircleFill: "#000000",
	endPointCircleRadius: 5,
};

export default makeInteractive(TrendLine, { trends: [] });
