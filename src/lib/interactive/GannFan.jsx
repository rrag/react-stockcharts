"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";

import EachGannFan from "./hoc/EachGannFan";
import MouseLocationIndicator from "./components/MouseLocationIndicator";

class GannFan extends Component {
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
		const { fans } = this.props;
		if (isDefined(override)) {
			const { index, ...rest } = override;
			const newfans = fans
				.map((each, idx) => idx === index
					? rest
					: each);
			this.setState({
				override: null
			}, () => {
				this.props.onComplete(newfans);

			});
		}
	}
	handleDrawChannel(xyValue) {
		const { current } = this.state;

		if (isDefined(current)
				&& isDefined(current.startXY)) {

			this.setState({
				current: {
					startXY: current.startXY,
					endXY: xyValue,
				}
			});
		}
	}
	handleStartAndEnd(xyValue) {
		const { current } = this.state;
		const { fans } = this.props;

		if (isNotDefined(current) || isNotDefined(current.startXY)) {
			this.setState({
				current: {
					startXY: xyValue,
					endXY: null,
				}
			}, () => {
				this.props.onStart();
			});
		} else {
			this.setState({
				current: null,
			}, () => {
				const newfans = fans
					.concat(current);
				this.props.onComplete(newfans);
			});
		}
	}
	render() {
		const { stroke, opacity, strokeWidth, fill, fillOpacity } = this.props;
		const { fontFamily, fontSize, fontStroke } = this.props;
		const { enabled, fans } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { current, override } = this.state;
		const overrideIndex = isDefined(override) ? override.index : null;

		const tempChannel = isDefined(current) && isDefined(current.endXY)
			? <EachGannFan
				interactive={false}
				{...current}
				stroke={stroke}
				strokeWidth={strokeWidth}
				fill={fill}
				opacity={opacity}
				fillOpacity={fillOpacity}

				fontFamily={fontFamily}
				fontSize={fontSize}
				fontStroke={fontStroke}

			/>
			: null;

		return <g>
			{fans.map((each, idx) => {
				return <EachGannFan
					key={idx}
					index={idx}
					{...(idx === overrideIndex ? override : each)}
					stroke={stroke}
					strokeWidth={strokeWidth}
					fill={fill}
					opacity={opacity}
					fillOpacity={fillOpacity}

					fontFamily={fontFamily}
					fontSize={fontSize}
					fontStroke={fontStroke}

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


GannFan.propTypes = {
	enabled: PropTypes.bool.isRequired,
	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	fill: PropTypes.arrayOf(PropTypes.string).isRequired,

	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	fontStroke: PropTypes.string,

	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,
	stroke: PropTypes.string,
	opacity: PropTypes.number,
	fillOpacity: PropTypes.number,
	endPointCircleFill: PropTypes.string,
	endPointCircleRadius: PropTypes.number,
	fans: PropTypes.array.isRequired,
};

GannFan.defaultProps = {
	stroke: "#000000",
	opacity: 0.4,
	fillOpacity: 0.2,
	strokeWidth: 1,
	onStart: noop,
	onComplete: noop,

	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 10,
	fontStroke: "#000000",

	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,
	endPointCircleFill: "#000000",
	endPointCircleRadius: 5,
	fill: [
		"#1f77b4",
		"#ff7f0e",
		"#2ca02c",
		"#d62728",
		"#9467bd",
		"#8c564b",
		"#e377c2",
		"#7f7f7f",
	],
	fans: [],
};

export default GannFan;
