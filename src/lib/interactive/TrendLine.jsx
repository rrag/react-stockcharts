"use strict";

import React, { PropTypes, Component } from "react";

import { isDefined, isNotDefined, noop } from "../utils";

import { getValueFromOverride } from "./utils";

import InteractiveLine from "./InteractiveLine";
import StraightLine from "./StraightLine";
import MouseLocationIndicator from "./MouseLocationIndicator";


class TrendLine extends Component {
	constructor(props) {
		super(props);

		this.handleStartAndEnd = this.handleStartAndEnd.bind(this);
		this.handleDrawLine = this.handleDrawLine.bind(this);
		this.handleDragLine = this.handleDragLine.bind(this);
		this.handleDragLineComplete = this.handleDragLineComplete.bind(this);

		this.state = {};
	}
	terminate() {
		this.setState({
			current: null,
			override: null,
		});
	}
	handleDragLine(index, newXYValue) {
		this.setState({
			override: {
				index,
				...newXYValue
			}
		});
	}
	handleDragLineComplete() {
		const { override } = this.state;
		const { trends } = this.props;
		const newTrends = trends
			.map((each, idx) => idx === override.index
				? {
					start: [override.x1Value, override.y1Value],
					end: [override.x2Value, override.y2Value],
				}
				: each);
		this.setState({
			override: null
		}, () => {
			this.props.onComplete(newTrends);

		});
	}
	handleDrawLine(xyValue) {
		const { current } = this.state;

		if (isDefined(current) && isDefined(current.start)) {
			this.setState({
				current: {
					start: current.start,
					end: xyValue,
				}
			});
		}
	}
	handleStartAndEnd(xyValue) {
		const { current } = this.state;
		const { trends } = this.props;

		if (isNotDefined(current) || isNotDefined(current.start)) {
			this.setState({
				current: {
					start: xyValue,
					end: null,
				}
			}, () => {
				this.props.onStart();
			});
		} else {
			this.setState({
				current: null,
			}, () => {
				const newTrends = trends.concat({ start: current.start, end: xyValue });
				this.props.onComplete(newTrends);
			});
		}
	}
	render() {
		const { stroke, opacity, strokeWidth, trends } = this.props;
		const { enabled, snap, shouldDisableSnap, snapTo, type } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { current, override } = this.state;

		const tempLine = isDefined(current) && isDefined(current.end)
			? <StraightLine type={type}
					noHover
					x1Value={current.start[0]}
					y1Value={current.start[1]}
					x2Value={current.end[0]}
					y2Value={current.end[1]}
					stroke={stroke}
					strokeWidth={strokeWidth}
					opacity={opacity} />
			: null;

		return <g>
			{trends.map((each, idx) => {
				return <EachTrendLine
					key={idx}
					index={idx}
					type={type}
					x1Value={getValueFromOverride(override, idx, "x1Value", each.start[0])}
					y1Value={getValueFromOverride(override, idx, "y1Value", each.start[1])}
					x2Value={getValueFromOverride(override, idx, "x2Value", each.end[0])}
					y2Value={getValueFromOverride(override, idx, "y2Value", each.end[1])}
					stroke={stroke}
					strokeWidth={strokeWidth}
					opacity={opacity}
					onDrag={this.handleDragLine}
					onDragComplete={this.handleDragLineComplete}
					/>;
			})}
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
		</g>;
	}
}


TrendLine.propTypes = {
	snap: PropTypes.bool.isRequired,
	enabled: PropTypes.bool.isRequired,
	snapTo: PropTypes.func.isRequired,
	shouldDisableSnap: PropTypes.func.isRequired,
	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
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
	trends: PropTypes.array.isRequired,
};

TrendLine.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
};

TrendLine.defaultProps = {
	stroke: "#000000",
	type: "XLINE",
	opacity: 0.7,
	strokeWidth: 1,
	onStart: noop,
	onComplete: noop,
	shouldDisableSnap: e => (e.button === 2 || e.shiftKey),
	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,
	endPointCircleFill: "#000000",
	endPointCircleRadius: 5,
	trends: [],
};

TrendLine.contextTypes = {
	redraw: PropTypes.func.isRequired,
};

class EachTrendLine extends Component {
	constructor(props) {
		super(props);
		this.handleDragLine = this.handleDragLine.bind(this);
	}
	handleDragLine(...rest) {
		const { index, onDrag } = this.props;
		onDrag(index, ...rest);
	}
	render() {
		const {
			type,
			x1Value,
			y1Value,
			x2Value,
			y2Value,
			stroke,
			strokeWidth,
			opacity,
			onDragComplete,
		} = this.props;
		return <InteractiveLine
			type={type}
			x1Value={x1Value}
			y1Value={y1Value}
			x2Value={x2Value}
			y2Value={y2Value}
			stroke={stroke}
			strokeWidth={strokeWidth}
			opacity={opacity}
			onDrag={this.handleDragLine}
			onDragComplete={onDragComplete}
			edgeInteractiveCursor="react-stockcharts-move-cursor"
			lineInteractiveCursor="react-stockcharts-move-cursor"
			/>;
	}

}

EachTrendLine.propTypes = {
	index: PropTypes.number.isRequired,
	type: PropTypes.string,
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number.isRequired,
	opacity: PropTypes.number,
	onDrag: PropTypes.func,
	onDragComplete: PropTypes.func,
	x1Value: PropTypes.any.isRequired,
	y1Value: PropTypes.any.isRequired,
	x2Value: PropTypes.any.isRequired,
	y2Value: PropTypes.any.isRequired,
};

export default TrendLine;
