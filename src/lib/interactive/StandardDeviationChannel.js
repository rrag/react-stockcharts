"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";

import {
	getValueFromOverride,
	terminate,
	saveNodeList,
	handleClickInteractiveType,
} from "./utils";

import EachLinearRegressionChannel from "./hoc/EachLinearRegressionChannel";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

class StandardDeviationChannel extends Component {
	constructor(props) {
		super(props);

		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.handleDrawLine = this.handleDrawLine.bind(this);
		this.handleDragLine = this.handleDragLine.bind(this);
		this.handleDragLineComplete = this.handleDragLineComplete.bind(this);

		this.terminate = terminate.bind(this);
		this.handleClick = handleClickInteractiveType("channels").bind(this);
		this.saveNodeList = saveNodeList.bind(this);

		this.nodes = [];
		this.state = {};
	}
	componentWillMount() {
		this.updateInteractiveToState(this.props.channels);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.channels !== nextProps.channels) {
			this.updateInteractiveToState(nextProps.channels);
		}
	}
	updateInteractiveToState(channels) {
		this.setState({
			channels: channels.map(t => {
				return {
					...t,
					selected: !!t.selected
				};
			}),
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
			const newChannels = channels
				.map((each, idx) => idx === override.index
					? {
						start: [override.x1Value, override.y1Value],
						end: [override.x2Value, override.y2Value],
						selected: true,
					}
					: each);
			this.setState({
				override: null,
				channels: newChannels,
			}, () => {
				this.props.onComplete(newChannels);
			});
		}
	}
	handleDrawLine(xyValue) {
		const { current } = this.state;

		if (isDefined(current) && isDefined(current.start)) {
			this.mouseMoved = true;
			this.setState({
				current: {
					start: current.start,
					end: xyValue,
				}
			});
		}
	}
	handleStart(xyValue) {
		const { current } = this.state;

		if (isNotDefined(current) || isNotDefined(current.start)) {
			this.mouseMoved = false;

			this.setState({
				current: {
					start: xyValue,
					end: null,
				}
			}, () => {
				this.props.onStart();
			});
		}
	}
	handleEnd(xyValue) {
		const { current } = this.state;
		const { channels } = this.props;

		if (this.mouseMoved
			&& isDefined(current)
			&& isDefined(current.start)
		) {
			const newChannels = channels.concat(
				{ start: current.start, end: xyValue, selected: true, }
			);

			this.setState({
				current: null,
				channels: newChannels,
			}, () => {
				this.props.onComplete(newChannels);
			});
		}
	}
	render() {
		const { stroke, opacity, strokeWidth } = this.props;
		const { enabled, snapTo } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { hoverText } = this.props;
		const { current, override } = this.state;
		const { channels } = this.state;

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
				return <EachLinearRegressionChannel key={idx}
					ref={this.saveNodeList}
					index={idx}
					selected={each.selected}
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
				onMouseDown={this.handleStart}
				onClick={this.handleEnd}
				onMouseMove={this.handleDrawLine}
			/>
			<GenericChartComponent

				svgDraw={noop}
				canvasToDraw={getMouseCanvas}
				canvasDraw={noop}

				onClick={this.handleClick}

				drawOn={["mousemove", "pan", "drag"]}
			/>
		</g>;
	}
}

StandardDeviationChannel.propTypes = {
	enabled: PropTypes.bool.isRequired,
	snapTo: PropTypes.func.isRequired,

	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,

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
	onSelect: noop,

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
