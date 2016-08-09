"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import makeInteractive from "./makeInteractive";
import { isDefined, isNotDefined, head, last, noop, d3Window, getClosestValue, MOUSEMOVE, MOUSEUP } from "../utils";

import InteractiveLine from "./InteractiveLine";
import MouseLocationIndicator from "./MouseLocationIndicator";


class TrendLine extends Component {
	constructor(props) {
		super(props);

		this.handleStartAndEnd = this.handleStartAndEnd.bind(this);
		this.handleDrawLine = this.handleDrawLine.bind(this);
		this.handleDragLine = this.handleDragLine.bind(this);
		this.handleDragLineComplete = this.handleDragLineComplete.bind(this);

		this.state = this.props.init;
	}
	removeLast(interactive) {
		var { trends } = this.state;
		if (isDefined(trends) && trends.length > 0) {
			this.setState({
				trends: trends.slice(0, trends.length - 1),
			});
		}
	}
	terminate(interactive) {
		this.setState({
			current: null
		})
	}
	handleDragLine(index, newXYValue, e) {
		this.setState({
			override: {
				index,
				...newXYValue
			}
		})
	}
	handleDragLineComplete(index, e) {
		var { trends, override } = this.state;
		var newTrends = trends
			.map((each, idx) => idx === override.index
				? {
					start: [override.x1Value, override.y1Value],
					end: [override.x2Value, override.y2Value],
				}
				: each);
		this.setState({
			trends: newTrends,
			override: null
		})
	}
	handleDrawLine(xyValue, e) {
		var { current, trends } = this.state;

		if (isDefined(current) && isDefined(current.start)) {
			this.setState({
				current: {
					start: current.start,
					end: xyValue,
				}
			})
		}
	}
	handleStartAndEnd(xyValue, e) {
		var { current, trends } = this.state;

		if (isNotDefined(current) || isNotDefined(current.start)) {
			this.setState({
				current: {
					start: xyValue,
					end: null,
				}
			}, () => {
				this.props.onStart()
			})
		} else {
			this.setState({
				trends: trends.concat({ start: current.start, end: xyValue }),
				current: null,
			}, () => {
				this.props.onComplete()
			})
		}
	}
	render() {
		var { stroke, opacity, strokeWidth } = this.props;
		var { enabled, snap, shouldDisableSnap, snapTo } = this.props;
		var { currentPositionRadius, currentPositionStroke } = this.props;
		var { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		var { trends, current, override } = this.state;

		var x1 = 10, y1 = 10, x2 = 200, y2 = 200;

		var tempLine = isDefined(current) && isDefined(current.end)
			? <InteractiveLine
					x1Value={current.start[0]} y1Value={current.start[1]}
					x2Value={current.end[0]} y2Value={current.end[1]}
					stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} />
			: null

		return <g>
			{trends.map((each, idx) => 
				<InteractiveLine key={idx} withEdge
					index={idx}
					defaultClassName="react-stockcharts-enable-interaction react-stockcharts-move-cursor"
					x1Value={getValueFromOverride(override, idx, "x1Value") || each.start[0]}
					y1Value={getValueFromOverride(override, idx, "y1Value") || each.start[1]}
					x2Value={getValueFromOverride(override, idx, "x2Value") || each.end[0]}
					y2Value={getValueFromOverride(override, idx, "y2Value") || each.end[1]}
					stroke={stroke} strokeWidth={strokeWidth} opacity={opacity}
					onDrag={this.handleDragLine}
					onDragComplete={this.handleDragLineComplete}
					/>)
			}
			{tempLine}
			<MouseLocationIndicator 
				enabled={enabled} 
				snap={snap} 
				shouldDisableSnap={shouldDisableSnap} 
				snapTo={snapTo}
				r={currentPositionRadius}
				stroke={currentPositionStroke}
				opacity={currentPositionOpacity}
				strokeWidth={currentPositionStrokeWidth}
				onMouseDown={this.handleStartAndEnd}
				onMouseMove={this.handleDrawLine} />
		</g>
	}
}

function getValueFromOverride(override, index, key) {
	if (isDefined(override) && override.index === index)
		return override[key]
}

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
		? getClosestValue(snapTo(currentItem), yScale.invert(mouseXY[1]))
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
	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	interactive: PropTypes.object,
	strokeWidth: PropTypes.number.isRequired,
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
	endPointCircleFill: PropTypes.string,
	endPointCircleRadius: PropTypes.number,
};

TrendLine.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
};

TrendLine.defaultProps = {
	stroke: "#000000",
	type: "XLINE",
	opacity: 0.7,
	strokeWidth: 2,
	onStart: noop,
	onComplete: noop,
	shouldDisableSnap: e => (e.button === 2 || e.shiftKey),
	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,
	endPointCircleFill: "#000000",
	endPointCircleRadius: 5,
	init: { trends: [] },
};

export default TrendLine;
