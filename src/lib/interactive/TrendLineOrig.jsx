"use strict";

import React, { PropTypes, Component } from "react";

import makeInteractive from "./makeInteractive";
import { head, last, hexToRGBA, noop } from "../utils";

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
	onMousemove({ chartId, xAccessor }, interactive, { mouseXY, currentItem, currentCharts, chartConfig }, e) {
		var { enabled, snapTo, snap, shouldDisableSnap } = this.props;
		if (enabled) {
			var { yScale } = chartConfig;

			var yValue = (snap && !shouldDisableSnap(e))
				? getYValue(snapTo(currentItem), yScale.invert(mouseXY[1]))
				: yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);

			return { interactive: { ...interactive, currentPos: [xValue, yValue], } };
		}
		return { interactive };
	}
	onClick({ chartId, xAccessor }, interactive, { mouseXY, currentItem, currentChartstriggerCallback, chartConfig }, e) {
		var { onStart, onComplete, enabled, snapTo, snap, shouldDisableSnap } = this.props;

		if (enabled) {
			var { start, trends } = interactive;

			var { yScale } = chartConfig;

			var yValue = (snap && !shouldDisableSnap(e))
				? getYValue(snapTo(currentItem), yScale.invert(mouseXY[1]))
				: yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);
			if (start) {
				return {
					interactive: {
						...interactive,
						start: null,
						trends: trends.concat({ start, end: [xValue, yValue] }),
					},
					callback: onComplete.bind(null, { currentItem, point: [xValue, yValue] }, e),
				};
			} else if (e.button === 0) {
				return {
					interactive: { ...interactive, start: [xValue, yValue], },
					callback: onStart.bind(null, { currentItem, point: [xValue, yValue] }, e),
				};
			}
		}
		return { interactive };
	}
	render() {
		var { xScale, chartCanvasType, chartConfig, plotData, xAccessor, interactive, enabled, show } = this.props;

		if (chartCanvasType !== "svg") return null;

		var { yScale } = chartConfig;
		var { currentPos } = interactive;

		var { currentPositionStroke, currentPositionStrokeWidth, currentPositionOpacity, currentPositionRadius } = this.props;
		var { stroke, opacity, type } = this.props;

		var circle = (currentPos && enabled && show)
			? <circle cx={xScale(currentPos[0])} cy={yScale(currentPos[1])}
				stroke={currentPositionStroke}
				opacity={currentPositionOpacity}
				fill="none"
				strokeWidth={currentPositionStrokeWidth}
				r={currentPositionRadius} />
			: null;

		var lines = TrendLine.helper(plotData, type, xAccessor, interactive);
		return (
			<g>
				{circle}
				{lines
				.map((coords, idx) =>
					<line key={idx} stroke={stroke} opacity={opacity} x1={xScale(coords.x1)} y1={yScale(coords.y1)}
						x2={xScale(coords.x2)} y2={yScale(coords.y2)} />)}
			</g>
		);
	}
}
TrendLine.drawOnCanvas = (props,
		interactive,
		ctx,
		{ show, xScale, plotData, chartConfig }) => {

	var { currentPos } = interactive;

	var { type, xAccessor } = props;
	var lines = TrendLine.helper(plotData, type, xAccessor, interactive);

	var { yScale } = chartConfig;
	// console.error(show);

	var { enabled, currentPositionStroke, currentPositionStrokeWidth, currentPositionOpacity, currentPositionRadius } = props;
	if (currentPos && enabled && show) {
		ctx.strokeStyle = hexToRGBA(currentPositionStroke, currentPositionOpacity);
		ctx.lineWidth = currentPositionStrokeWidth;
		ctx.beginPath();
		ctx.arc(xScale(currentPos[0]), yScale(currentPos[1]), currentPositionRadius, 0, 2 * Math.PI, false);
		ctx.stroke();
	}
	ctx.lineWidth = 1;
	ctx.strokeStyle = hexToRGBA(props.stroke, props.opacity);

	lines.forEach(each => {
		ctx.beginPath();
		ctx.moveTo(xScale(each.x1), yScale(each.y1));
		ctx.lineTo(xScale(each.x2), yScale(each.y2));
		// console.log(each);
		ctx.stroke();
	});
};

TrendLine.helper = (plotData, type, xAccessor, interactive/* , chartConfig */) => {
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

export default makeInteractive(TrendLine, ["click", "mousemove"], { trends: [] });
