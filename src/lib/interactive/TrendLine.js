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
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

import EachTrendLine from "./hoc/EachTrendLine";
import StraightLine from "./components/StraightLine";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";

class TrendLine extends Component {
	constructor(props) {
		super(props);

		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.handleDrawLine = this.handleDrawLine.bind(this);
		this.handleDragLine = this.handleDragLine.bind(this);
		this.handleDragLineComplete = this.handleDragLineComplete.bind(this);

		this.terminate = terminate.bind(this);
		this.handleClick = handleClickInteractiveType("trends").bind(this);
		this.saveNodeList = saveNodeList.bind(this);

		this.updateInteractiveToState = this.updateInteractiveToState.bind(this);

		this.state = {
			trends: [],
		};
		this.nodes = [];
	}
	componentWillMount() {
		this.updateInteractiveToState(this.props.trends);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.trends !== nextProps.trends) {
			this.updateInteractiveToState(nextProps.trends);
		}
	}
	updateInteractiveToState(trends) {
		this.setState({
			trends: trends.map(t => {
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
	handleDragLineComplete(moreProps) {
		const { override } = this.state;
		if (isDefined(override)) {
			const { trends } = this.state;
			const newTrends = trends
				.map((each, idx) => idx === override.index
					? {
						...each,
						start: [override.x1Value, override.y1Value],
						end: [override.x2Value, override.y2Value],
						selected: true,
					}
					: {
						...each,
						selected: false,
					});

			this.setState({
				override: null,
				trends: newTrends
			}, () => {
				this.props.onComplete(newTrends, moreProps);
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
	handleStart(xyValue, moreProps, e) {
		const { current, trends } = this.state;

		if (isNotDefined(current) || isNotDefined(current.start)) {
			this.mouseMoved = false;
			const newTrends = trends.map(t => {
				return { ...t, selected: false };
			});
			this.setState({
				current: {
					start: xyValue,
					end: null,
				},
				trends: newTrends
			}, () => {
				this.props.onStart(moreProps, e);
			});
		}
	}
	handleEnd(xyValue, moreProps, e) {
		const { trends, current } = this.state;
		const { appearance, type } = this.props;

		if (this.mouseMoved
			&& isDefined(current)
			&& isDefined(current.start)
		) {
			const newTrends = [
				...trends,
				{
					start: current.start,
					end: xyValue,
					selected: true,
					appearance,
					type,
				}
			];
			this.setState({
				current: null,
				trends: newTrends
			}, () => {
				this.props.onComplete(newTrends, moreProps, e);
			});
		}
	}
	render() {
		const { appearance } = this.props;
		const { enabled, snap, shouldDisableSnap, snapTo, type } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { hoverText } = this.props;
		const { current, override, trends } = this.state;

		const tempLine = isDefined(current) && isDefined(current.end)
			? <StraightLine type={type}
				noHover
				x1Value={current.start[0]}
				y1Value={current.start[1]}
				x2Value={current.end[0]}
				y2Value={current.end[1]}
				stroke={appearance.stroke}
				strokeWidth={appearance.strokeWidth}
				opacity={appearance.opacity} />
			: null;

		return <g>
			{trends.map((each, idx) => {
				const eachAppearance = isDefined(each.appearance)
					? { ...appearance, ...each.appearance }
					: appearance;

				return <EachTrendLine key={idx}
					ref={this.saveNodeList}
					index={idx}
					type={each.type}
					selected={each.selected}
					x1Value={getValueFromOverride(override, idx, "x1Value", each.start[0])}
					y1Value={getValueFromOverride(override, idx, "y1Value", each.start[1])}
					x2Value={getValueFromOverride(override, idx, "x2Value", each.end[0])}
					y2Value={getValueFromOverride(override, idx, "y2Value", each.end[1])}
					stroke={eachAppearance.stroke}
					strokeWidth={eachAppearance.strokeWidth}
					opacity={eachAppearance.opacity}
					edgeStroke={eachAppearance.edgeStroke}
					edgeFill={eachAppearance.edgeFill}
					edgeStrokeWidth={eachAppearance.edgeStrokeWidth}
					r={eachAppearance.r}
					hoverText={hoverText}
					onDrag={this.handleDragLine}
					onDragComplete={this.handleDragLineComplete}
					edgeInteractiveCursor="react-stockcharts-move-cursor"
					lineInteractiveCursor="react-stockcharts-move-cursor"
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


TrendLine.propTypes = {
	snap: PropTypes.bool.isRequired,
	enabled: PropTypes.bool.isRequired,
	snapTo: PropTypes.func,
	shouldDisableSnap: PropTypes.func.isRequired,

	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,

	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,
	type: PropTypes.oneOf([
		"XLINE", // extends from -Infinity to +Infinity
		"RAY", // extends to +/-Infinity in one direction
		"LINE", // extends between the set bounds
	]),
	hoverText: PropTypes.object.isRequired,

	trends: PropTypes.array.isRequired,

	appearance: PropTypes.shape({
		stroke: PropTypes.string.isRequired,
		opacity: PropTypes.number.isRequired,
		strokeWidth: PropTypes.number.isRequired,
		edgeStrokeWidth: PropTypes.number.isRequired,
		edgeFill: PropTypes.string.isRequired,
		edgeStroke: PropTypes.string.isRequired,
	}).isRequired
};

TrendLine.defaultProps = {
	type: "XLINE",

	onStart: noop,
	onComplete: noop,
	onSelect: noop,

	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 0,

	shouldDisableSnap: e => (e.button === 2 || e.shiftKey),
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object",
	},
	trends: [],

	appearance: {
		stroke: "#000000",
		opacity: 0.7,
		strokeWidth: 1,
		edgeStrokeWidth: 1,
		edgeFill: "#FFFFFF",
		edgeStroke: "#000000",
		r: 6,
	}
};

export default TrendLine;
