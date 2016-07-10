"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";
import makeInteractive from "./makeInteractive";
import { isDefined, head, last, hexToRGBA, noop } from "../utils";

function getYValue(values, currentValue) {
	var diff = values
		.map(each => each - currentValue)
		.reduce((diff1, diff2) => Math.abs(diff1) < Math.abs(diff2) ? diff1 : diff2);
	return currentValue + diff;
}

class TrendLine extends Component {
	constructor(props) {
		super(props);
		this.onMousemove = this.onMousemove.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	removeLast(interactive) {
		var { trends, start } = interactive;
		if (!start && trends.length > 0) {
			return { ...interactive, trends: trends.slice(0, trends.length - 1) };
		}
		return interactive;
	}
	terminate(interactive) {
		var { start } = interactive;
		if (start) {
			return { ...interactive, start: null };
		}
		return interactive;
	}
	onMousemove(state) {
		var {
			xScale,
			plotData,
			mouseXY,
			currentCharts,
			currentItem,
			chartConfig,
			interactiveState,
			eventMeta,
		} = state;

		var { enabled, show, eventMeta } = this.props;
		var { yScale } = chartConfig;
		var currentPos = currentPosition(this.props, { eventMeta, mouseXY, currentItem, yScale });

		return { ...interactiveState, currentPos };
	}
	onClick(state) {
		var {
			xScale,
			plotData,
			mouseXY,
			currentCharts,
			currentItem,
			chartConfig,
			interactiveState,
			eventMeta,
		} = state;

		var { onStart, onComplete, enabled, snapTo, snap, shouldDisableSnap } = this.props;
		var { xAccessor } = this.props;

		if (enabled) {
			var { start, trends } = interactiveState;

			var { yScale } = chartConfig;
			var [xValue, yValue] = xy(snapTo, snap, shouldDisableSnap, xAccessor, eventMeta, currentItem, mouseXY, yScale)

			if (isDefined(start)) {
				return {
					...interactiveState,
					start: null,
					trends: trends.concat({ start, end: [xValue, yValue] }),
				};
			} else if (eventMeta.button === 0) {
				return {
					...interactiveState,
					start: [xValue, yValue],
				};
			}
		}
		return interactiveState;
	}
	render() {

		var { enabled, show, id, eventMeta } = this.props;
		var { xScale, chartCanvasType, currentItem, chartConfig, plotData, xAccessor, interactiveState, show } = this.props;

		var { yScale } = chartConfig;

		// var { interactive } = getInteractiveState(this.props, { trends: [] });

		var { currentPositionStroke, currentPositionStrokeWidth, currentPositionOpacity, currentPositionRadius } = this.props;
		var { stroke, opacity, type } = this.props;

		var { currentPos } = interactiveState

		var circle = (currentPos && enabled && show)
			? <circle className="react-stockcharts-avoid-interaction" cx={xScale(currentPos[0])} cy={yScale(currentPos[1])}
				stroke={currentPositionStroke}
				opacity={currentPositionOpacity}
				fill="none"
				strokeWidth={currentPositionStrokeWidth}
				r={currentPositionRadius} />
			: null;

		var lines = helper(plotData, type, xAccessor, interactiveState);
		var className = enabled ? "react-stockcharts-avoid-interaction" : "";
		return (
			<g className={className}>
				{circle}
				{lines
					.map((coords, idx) => {
						var x1 = xScale(coords.x1)
						var y1 = yScale(coords.y1)
						var x2 = xScale(coords.x2)
						var y2 = yScale(coords.y2)
						return (<g key={idx}>
							<line stroke={stroke} opacity={opacity}
								x1={x1} y1={y1} x2={x2} y2={y2}/>
							<circle cx={x1} cy={y1} r={4} />
							<circle cx={x2} cy={y2} r={4} />
						</g>)
					})
				}
			</g>
		);
	}
}

function currentPosition({ enabled, snapTo, snap, shouldDisableSnap, xAccessor }, { eventMeta, mouseXY, currentItem, yScale }) {
	if (enabled && event && currentItem) {
		
		return xy(snapTo, snap, shouldDisableSnap, xAccessor, eventMeta, currentItem, mouseXY, yScale)
	}
}

function xy(snapTo, snap, shouldDisableSnap, xAccessor, eventMeta, currentItem, mouseXY, yScale) {
	var yValue = (snap && !shouldDisableSnap(eventMeta))
		? getYValue(snapTo(currentItem), yScale.invert(mouseXY[1]))
		: yScale.invert(mouseXY[1]);
	var xValue = xAccessor(currentItem);

	return [xValue, yValue];
}

function getInteractiveState(props, initialState) {
	var { interactiveState, id } = props;
	// console.log(interactiveState);
	var state = interactiveState.filter(each => each.id === id);
	var response = { interactive: initialState };
	if (state.length > 0) {
		response = state[0];
	}
	// console.log(interactiveState, response.interactive, this.props.id);
	return response;
}

function helper(plotData, type, xAccessor, interactive/* , chartConfig */) {
	var { currentPos, start, trends } = interactive;
	var temp = trends;
	if (start && currentPos) {
		temp = temp.concat({ start, end: currentPos });
	}
	var lines = temp
		.filter(each => each.start[0] !== each.end[0])
		.map((each) => generateLine(type, each.start, each.end, xAccessor, plotData));

	return lines;
};

function generateLine(type, start, end, xAccessor, plotData) {
	/* if (end[0] - start[0] === 0) {
		// vertical line
		throw new Error("Trendline cannot be a vertical line")
	} */
	var m /* slope */ = (end[1] - start[1]) / (end[0] - start[0]);
	var b /* y intercept */ = -1 * m * end[0] + end[1];
	// y = m * x + b
	var x1 = type === "XLINE"
		? xAccessor(plotData[0])
		: start[0]; // RAY or LINE start is the same

	var y1 = m * x1 + b;

	var x2 = type === "XLINE"
		? xAccessor(last(plotData))
		: type === "RAY"
			? end[0] > start[0] ? xAccessor(last(plotData)) : xAccessor(head(plotData))
			: end[0];
	var y2 = m * x2 + b;
	return { x1, y1, x2, y2 };
}

TrendLine.propTypes = {
	snap: PropTypes.bool.isRequired,
	show: PropTypes.bool,
	enabled: PropTypes.bool.isRequired,
	snapTo: PropTypes.func,
	shouldDisableSnap: PropTypes.func.isRequired,
	chartCanvasType: PropTypes.string,
	chartConfig: PropTypes.object,
	plotData: PropTypes.array,
	xScale: PropTypes.func,
	xAccessor: PropTypes.func,
	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	interactive: PropTypes.object,
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
};

TrendLine.defaultProps = {
	stroke: "#000000",
	type: "XLINE",
	opacity: 0.7,
	onStart: noop,
	onComplete: noop,
	shouldDisableSnap: e => (e.button === 2 || e.shiftKey),
	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,
};

export default makeInteractive(TrendLine, { trends: [] })
/*
export default pure(TrendLine, {
	interactiveState: PropTypes.array.isRequired,
	show: PropTypes.bool,
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
	chartConfig: PropTypes.object.isRequired,
	mouseXY: PropTypes.array,
	currentItem: PropTypes.object,
	currentCharts: PropTypes.arrayOf(PropTypes.number),
	eventMeta: PropTypes.object,

	chartCanvasType: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
	xAccessor: PropTypes.func.isRequired,

	setInteractiveState: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
});*/