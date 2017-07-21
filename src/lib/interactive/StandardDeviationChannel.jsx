"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";

import { getValueFromOverride } from "./utils";

import EachLinearRegressionChannel from "./hoc/EachLinearRegressionChannel";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";

class StandardDeviationChannel extends Component {
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
		if (isDefined(override)) {
			const { channels } = this.props;
			const newTrends = channels
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
		const { channels } = this.props;

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
				const newTrends = channels.concat({ start: current.start, end: xyValue });
				this.props.onComplete(newTrends);
			});
		}
	}
	render() {
		const { stroke, opacity, strokeWidth, channels } = this.props;
		const { enabled, snapTo } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { hoverText } = this.props;
		const { current, override } = this.state;

		const tempLine = isDefined(current) && isDefined(current.end)
			? <EachLinearRegressionChannel
				interactive={false}
				x1Value={current.start[0]}
				x2Value={current.end[0]}
				stroke={stroke}
				strokeWidth={strokeWidth}
				hoverText={hoverText}
				opacity={opacity} />
			: null;

		return <g>
			{channels.map((each, idx) => {
				return <EachLinearRegressionChannel
					key={idx}
					index={idx}
					x1Value={getValueFromOverride(override, idx, "x1Value", each.start[0])}
					x2Value={getValueFromOverride(override, idx, "x2Value", each.end[0])}
					stroke={stroke}
					strokeWidth={strokeWidth}
					hoverText={hoverText}
					opacity={opacity}
					snapTo={snapTo}
					onDrag={this.handleDragLine}
					onDragComplete={this.handleDragLineComplete}
					edgeInteractiveCursor="react-stockcharts-move-cursor"
				/>;
			})}
			{tempLine}
			<MouseLocationIndicator
				enabled={enabled}
				snap={false}
				r={currentPositionRadius}
				stroke={currentPositionStroke}
				opacity={currentPositionOpacity}
				strokeWidth={currentPositionStrokeWidth}
				onMouseDown={this.handleStartAndEnd}
				onMouseMove={this.handleDrawLine} />
		</g>;
	}
}

StandardDeviationChannel.propTypes = {
	enabled: PropTypes.bool.isRequired,
	snapTo: PropTypes.func.isRequired,
	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,
	stroke: PropTypes.string,
	opacity: PropTypes.number,
	endPointCircleFill: PropTypes.string,
	endPointCircleRadius: PropTypes.number,
	hoverText: PropTypes.object.isRequired,
	channels: PropTypes.array.isRequired,
};

StandardDeviationChannel.defaultProps = {
	stroke: "#000000",
	snapTo: d => d.close,
	opacity: 0.7,
	strokeWidth: 1,
	onStart: noop,
	onComplete: noop,
	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,
	endPointCircleFill: "#000000",
	endPointCircleRadius: 5,
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 175,
		text: "Click and drag the edge circles",
	},
	channels: [],
};

export default StandardDeviationChannel;
