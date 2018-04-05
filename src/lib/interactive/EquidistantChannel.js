

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";
import {
	terminate,
	saveNodeType,
	isHoverForInteractiveType,
} from "./utils";
import EachEquidistantChannel from "./wrapper/EachEquidistantChannel";
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

		this.terminate = terminate.bind(this);
		this.saveNodeType = saveNodeType.bind(this);

		this.getSelectionState = isHoverForInteractiveType("channels")
			.bind(this);

		this.nodes = [];
		this.state = {
		};
	}
	handleDragChannel(index, newXYValue) {
		this.setState({
			override: {
				index,
				...newXYValue
			}
		});
	}
	handleDragChannelComplete(moreProps) {
		const { override } = this.state;
		const { channels } = this.props;

		if (isDefined(override)) {
			const { index, ...rest } = override;
			const newChannels = channels
				.map((each, idx) => idx === index
					? { ...each, ...rest, selected: true }
					: each);
			this.setState({
				override: null,
			}, () => {
				this.props.onComplete(newChannels, moreProps);
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
	handleEnd(xyValue, moreProps, e) {
		const { current } = this.state;
		const { channels, appearance } = this.props;

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
				const newChannels = [
					...channels.map(d => ({ ...d, selected: false })),
					{
						...current, selected: true,
						appearance,
					}
				];

				this.setState({
					current: null,
				}, () => {

					this.props.onComplete(newChannels, moreProps, e);
				});
			}
		}
	}
	render() {
		const { appearance } = this.props;
		const { enabled } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { channels, hoverText } = this.props;
		const { current, override } = this.state;
		const overrideIndex = isDefined(override) ? override.index : null;

		const tempChannel = isDefined(current) && isDefined(current.endXY)
			? <EachEquidistantChannel
				interactive={false}
				{...current}
				appearance={appearance}
				hoverText={hoverText} />
			: null;

		return <g>
			{channels.map((each, idx) => {
				const eachAppearance = isDefined(each.appearance)
					? { ...appearance, ...each.appearance }
					: appearance;

				return <EachEquidistantChannel key={idx}
					ref={this.saveNodeType(idx)}
					index={idx}
					selected={each.selected}
					hoverText={hoverText}
					{...(idx === overrideIndex ? override : each)}
					appearance={eachAppearance}
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
	onSelect: PropTypes.func.isRequired,

	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,

	hoverText: PropTypes.object.isRequired,
	channels: PropTypes.array.isRequired,

	appearance: PropTypes.shape({
		stroke: PropTypes.string.isRequired,
		strokeOpacity: PropTypes.number.isRequired,
		strokeWidth: PropTypes.number.isRequired,
		fill: PropTypes.string.isRequired,
		fillOpacity: PropTypes.number.isRequired,
		edgeStroke: PropTypes.string.isRequired,
		edgeFill: PropTypes.string.isRequired,
		edgeFill2: PropTypes.string.isRequired,
		edgeStrokeWidth: PropTypes.number.isRequired,
		r: PropTypes.number.isRequired,
	}).isRequired
};

EquidistantChannel.defaultProps = {
	onStart: noop,
	onComplete: noop,
	onSelect: noop,

	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,

	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object",
	},
	channels: [],
	appearance: {
		stroke: "#000000",
		strokeOpacity: 1,
		strokeWidth: 1,
		fill: "#8AAFE2",
		fillOpacity: 0.7,
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		edgeFill2: "#250B98",
		edgeStrokeWidth: 1,
		r: 5,
	}
};

export default EquidistantChannel;
