"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";
import {
	terminate,
	saveNodeList,
	handleClickInteractiveType,
} from "./utils";
import EachGannFan from "./hoc/EachGannFan";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

class GannFan extends Component {
	constructor(props) {
		super(props);

		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.handleDrawFan = this.handleDrawFan.bind(this);
		this.handleDragFan = this.handleDragFan.bind(this);
		this.handleDragFanComplete = this.handleDragFanComplete.bind(this);

		this.terminate = terminate.bind(this);
		this.handleClick = handleClickInteractiveType("fans").bind(this);
		this.saveNodeList = saveNodeList.bind(this);

		this.nodes = [];
		this.state = {};
	}
	componentWillMount() {
		this.updateInteractiveToState(this.props.fans);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.fans !== nextProps.fans) {
			this.updateInteractiveToState(nextProps.fans);
		}
	}
	updateInteractiveToState(fans) {
		this.setState({
			fans: fans.map(t => {
				return {
					...t,
					selected: !!t.selected
				};
			}),
		});
	}
	handleDragFan(index, newXYValue) {
		this.setState({
			override: {
				index,
				...newXYValue
			}
		});
	}
	handleDragFanComplete(moreProps) {
		const { override } = this.state;
		const { fans } = this.state;
		if (isDefined(override)) {
			const { index, ...rest } = override;
			const newfans = fans
				.map((each, idx) => idx === index
					? { ...rest, selected: true }
					: each);
			this.setState({
				override: null,
				fans: newfans,
			}, () => {
				this.props.onComplete(newfans, moreProps);
			});
		}
	}
	handleDrawFan(xyValue) {
		const { current } = this.state;

		if (isDefined(current) && isDefined(current.startXY)) {
			this.mouseMoved = true;

			this.setState({
				current: {
					startXY: current.startXY,
					endXY: xyValue,
				}
			});
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
	handleEnd(xyValyue, moreProps, e) {
		const { fans, current } = this.state;

		if (this.mouseMoved
			&& isDefined(current)
			&& isDefined(current.startXY)
		) {
			const newfans = [
				...fans,
				{ ...current, selected: true }
			];
			this.setState({
				current: null,
				fans: newfans
			}, () => {
				this.props.onComplete(newfans, moreProps, e);
			});
		}
	}
	render() {
		const { stroke, opacity, strokeWidth, fill, fillOpacity } = this.props;
		const { fontFamily, fontSize, fontStroke } = this.props;
		const { enabled } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { hoverText } = this.props;
		const { current, override, fans } = this.state;
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
				hoverText={hoverText}

				fontFamily={fontFamily}
				fontSize={fontSize}
				fontStroke={fontStroke}

			/>
			: null;

		return <g>
			{fans.map((each, idx) => {
				return <EachGannFan key={idx}
					ref={this.saveNodeList}
					index={idx}
					{...(idx === overrideIndex ? override : each)}
					stroke={stroke}
					strokeWidth={strokeWidth}
					fill={fill}
					opacity={opacity}
					fillOpacity={fillOpacity}
					hoverText={hoverText}

					fontFamily={fontFamily}
					fontSize={fontSize}
					fontStroke={fontStroke}

					onDrag={this.handleDragFan}
					onDragComplete={this.handleDragFanComplete}
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
				onMouseMove={this.handleDrawFan}
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


GannFan.propTypes = {
	enabled: PropTypes.bool.isRequired,

	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,

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
	hoverText: PropTypes.object.isRequired,

	fans: PropTypes.array.isRequired,
};

GannFan.defaultProps = {
	stroke: "#000000",
	opacity: 0.4,
	fillOpacity: 0.2,
	strokeWidth: 1,

	onStart: noop,
	onComplete: noop,
	onSelect: noop,

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
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object",
	},
	fans: [],
};

export default GannFan;
