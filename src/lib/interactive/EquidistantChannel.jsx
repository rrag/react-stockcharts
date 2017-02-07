"use strict";

import React, { PropTypes, Component } from "react";

import { isDefined, isNotDefined, noop } from "../utils";

import InteractiveLine from "./components/InteractiveLine";
import EachEquidistantChannel from "./components/EachEquidistantChannel";
import { getSlope, getYIntercept } from "./components/StraightLine";
import MouseLocationIndicator from "./components/MouseLocationIndicator";


class EquidistantChannel extends Component {
	constructor(props) {
		super(props);

		this.handleStartAndEnd = this.handleStartAndEnd.bind(this);
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
	handleStartAndEnd(xyValue) {
		const { current } = this.state;
		const { channels } = this.props;

		if (isNotDefined(current) || isNotDefined(current.startXY)) {
			this.setState({
				current: {
					startXY: xyValue,
					endXY: null,
				}
			}, () => {
				this.props.onStart();
			});
		} else if (isNotDefined(current.dy)) {
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
	render() {
		const { stroke, opacity, strokeWidth, fill } = this.props;
		const { enabled, channels } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { current, override } = this.state;
		const overrideIndex = isDefined(override) ? override.index : null;

		const tempChannel = isDefined(current) && isDefined(current.endXY)
			? <EachEquidistantChannel
					interactive={false}
					{...current}
					stroke={stroke}
					strokeWidth={strokeWidth}
					fill={fill}
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
				onMouseDown={this.handleStartAndEnd}
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
	channels: PropTypes.array.isRequired,
};

EquidistantChannel.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
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
	channels: [],
};

EquidistantChannel.contextTypes = {
	redraw: PropTypes.func.isRequired,
};

class EachChannel extends Component {
	constructor(props) {
		super(props);
		this.handleDragChannel = this.handleDragChannel.bind(this);
	}
	handleDragChannel(...rest) {
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
			onDrag={this.handleDragChannel}
			onDragComplete={onDragComplete}
			edgeInteractiveCursor="react-stockcharts-move-cursor"
			lineInteractiveCursor="react-stockcharts-move-cursor"
			/>;
	}

}

EachChannel.propTypes = {
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

export default EquidistantChannel;
