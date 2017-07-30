"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";

import EachEquidistantChannel from "./hoc/EachEquidistantChannel";
import { getSlope, getYIntercept } from "./components/StraightLine";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";

class EquidistantChannel extends Component {
	constructor(props) {
		super(props);

		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.handleDrawChannel = this.handleDrawChannel.bind(this);
		this.handleDragChannel = this.handleDragChannel.bind(this);
		this.handleDragChannelComplete = this.handleDragChannelComplete.bind(this);

		this.state = {};
	}
	terminate() {
		this.setState({
			current: null,
			override: null,
		});
	}
	handleDragChannel(index, newXYValue) {
		this.setState({
			override: {
				index,
				...newXYValue
			}
		});
	}
	handleDragChannelComplete() {
		const { override } = this.state;
		const { channels } = this.props;
		if (isDefined(override)) {
			const { index, ...rest } = override;
			const newChannels = channels
				.map((each, idx) => idx === index
					? rest
					: each);
			this.setState({
				override: null
			}, () => {
				this.props.onComplete(newChannels);

			});
		}
	}
	handleDrawChannel(xyValue) {
		const { current } = this.state;

		if (isDefined(current)
				&& isDefined(current.startXY)) {
			this.mouseMoved = true;
			if (isNotDefined(current.dy)) {
				this.setState({
					current: {
						startXY: current.startXY,
						endXY: xyValue,
					}
				});
			} else {
				const m = getSlope(current.startXY, current.endXY);
				const b = getYIntercept(m, current.endXY);
				const y = m * xyValue[0] + b;
				const dy = xyValue[1] - y;

				this.setState({
					current: {
						...current,
						dy,
					}
				});
			}
		}
	}
	handleStart(xyValue) {
		const { current } = this.state;

		if (isNotDefined(current) || isNotDefined(current.startXY)) {
			this.mouseMoved = false;
			this.setState({
				current: {
					startXY: xyValue,
					endXY: null,
				}
			}, () => {
				this.props.onStart();
			});
		}
	}
	handleEnd() {
		const { current } = this.state;
		const { channels } = this.props;

		if (this.mouseMoved
			&& isDefined(current)
			&& isDefined(current.startXY)
		) {

			if (isNotDefined(current.dy)) {
				this.setState({
					current: {
						...current,
						dy: 0
					}
				});
			} else {
				this.setState({
					current: null,
				}, () => {
					const newChannels = channels
						.concat(current);
					this.props.onComplete(newChannels);
				});
			}
		}
	}
	render() {
		const { stroke, opacity, strokeWidth, fill } = this.props;
		const { enabled, channels } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { hoverText } = this.props;
		const { current, override } = this.state;
		const overrideIndex = isDefined(override) ? override.index : null;

		const tempChannel = isDefined(current) && isDefined(current.endXY)
			? <EachEquidistantChannel
				interactive={false}
				{...current}
				stroke={stroke}
				strokeWidth={strokeWidth}
				fill={fill}
				hoverText={hoverText}
				opacity={opacity} />
			: null;

		return <g>
			{channels.map((each, idx) => {
				return <EachEquidistantChannel
					key={idx}
					index={idx}
					{...(idx === overrideIndex ? override : each)}
					stroke={stroke}
					strokeWidth={strokeWidth}
					fill={fill}
					hoverText={hoverText}
					opacity={opacity}
					onDrag={this.handleDragChannel}
					onDragComplete={this.handleDragChannelComplete}
				/>;
			})}
			{tempChannel}
			<MouseLocationIndicator
				enabled={enabled}
				snap={false}
				r={currentPositionRadius}
				stroke={currentPositionStroke}
				opacity={currentPositionOpacity}
				strokeWidth={currentPositionStrokeWidth}
				onMouseDown={this.handleStart}
				onClick={this.handleEnd}
				onMouseMove={this.handleDrawChannel} />
		</g>;
	}
}


EquidistantChannel.propTypes = {
	enabled: PropTypes.bool.isRequired,
	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	fill: PropTypes.string,
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

EquidistantChannel.defaultProps = {
	stroke: "#000000",
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
	fill: "#8AAFE2",
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object",
	},
	channels: [],
};

export default EquidistantChannel;
