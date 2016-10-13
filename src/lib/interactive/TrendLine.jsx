"use strict";

import React, { PropTypes, Component } from "react";

import { isDefined, isNotDefined, noop } from "../utils";

import { getValueFromOverride } from "./utils";

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
	removeLast() {
		var { trends } = this.state;
		if (isDefined(trends) && trends.length > 0) {
			this.setState({
				trends: trends.slice(0, trends.length - 1),
			});
		}
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
		});
	}
	handleDrawLine(xyValue) {
		var { current } = this.state;

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
		var { current, trends } = this.state;

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
				trends: trends.concat({ start: current.start, end: xyValue }),
				current: null,
			}, () => {
				this.props.onComplete();
			});
		}
	}
	render() {
		var { stroke, opacity, strokeWidth } = this.props;
		var { enabled, snap, shouldDisableSnap, snapTo, type } = this.props;
		var { currentPositionRadius, currentPositionStroke } = this.props;
		var { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		var { trends, current, override } = this.state;

		var tempLine = isDefined(current) && isDefined(current.end)
			? <InteractiveLine type={type}
					x1Value={current.start[0]} y1Value={current.start[1]}
					x2Value={current.end[0]} y2Value={current.end[1]}
					stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} />
			: null;

		return <g>
			{trends.map((each, idx) =>
				<InteractiveLine key={idx} withEdge
					echo={idx} type={type}
					defaultClassName="react-stockcharts-enable-interaction react-stockcharts-move-cursor"
					x1Value={getValueFromOverride(override, idx, "x1Value", each.start[0])}
					y1Value={getValueFromOverride(override, idx, "y1Value", each.start[1])}
					x2Value={getValueFromOverride(override, idx, "x2Value", each.end[0])}
					y2Value={getValueFromOverride(override, idx, "y2Value", each.end[1])}
					stroke={stroke} strokeWidth={strokeWidth} opacity={opacity}
					onDrag={this.handleDragLine}
					onEdge1Drag={this.handleDragLine}
					onEdge2Drag={this.handleDragLine}
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
		</g>;
	}
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
	init: PropTypes.object.isRequired,
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
