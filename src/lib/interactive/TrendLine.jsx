"use strict";

import React from "react";
import objectAssign from "object-assign";

import makeInteractive from "./makeInteractive";
import { hexToRGBA } from "../utils/utils.js";

function getYValue(values, currentValue) {
	var diff = values
		.map(each => each - currentValue)
		.reduce((diff1, diff2) => Math.abs(diff1) < Math.abs(diff2) ? diff1 : diff2);
	return currentValue + diff;
}

class TrendLine extends React.Component {
	constructor(props) {
		super(props);
		this.onMousemove = this.onMousemove.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	removeIndicator(chartId, xAccessor, interactive) {
		var { trends, start } = interactive;
		if (start) {
			return objectAssign({}, interactive, { start: null });
		} else {
			return objectAssign({}, interactive, { trends: trends.slice(0, trends.length - 1) });
		}
	}
	onMousemove(chartId, xAccessor, interactive, { mouseXY, currentItem, currentCharts, chartData }, e) {
		var { enabled, snapTo, snap, shouldDisableSnap } = this.props;
		if (enabled) {
			var { yScale } = chartData.plot.scales;

			var yValue = (snap && !shouldDisableSnap(e))
				? getYValue(snapTo(currentItem), yScale.invert(mouseXY[1]))
				: yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);

			if (interactive.start) {
				return objectAssign({}, interactive, {
					tempEnd: [xValue, yValue],
					currentPos: [xValue, yValue],
				});
			} else {
				return objectAssign({}, interactive, {
					currentPos: [xValue, yValue],
				});
			}
		}
		return interactive;
	}
	onClick(chartId, xAccessor, interactive, { mouseXY, currentItem, currentChartstriggerCallback, chartData }, e) {
		var { enabled, snapTo, snap, shouldDisableSnap } = this.props;

		if (enabled) {
			var { start, trends } = interactive;

			var { yScale } = chartData.plot.scales;

			var yValue = (snap && !shouldDisableSnap(e))
				? getYValue(snapTo(currentItem), yScale.invert(mouseXY[1]))
				: yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);
			if (start) {
				return objectAssign({}, interactive, {
					start: null,
					trends: trends.concat({ start, end: [xValue, yValue] }),
				});
			} else if (e.button === 0) {
				return objectAssign({}, interactive, {
					start: [xValue, yValue],
				});
			}
		}
		return interactive;
	}
	render() {
		var { chartCanvasType, chartData, plotData, xAccessor, interactive, enabled } = this.props;

		if (chartCanvasType !== "svg") return null;

		var { xScale, yScale } = chartData.plot.scales;
		var { currentPos } = interactive;

		var { currentPositionStroke, currentPositionStrokeWidth, currentPositionOpacity, currentPositionRadius } = this.props;
		var { stroke, opacity } = this.props;

		var circle = (currentPos && enabled)
			? <circle cx={xScale(currentPos[0])} cy={yScale(currentPos[1])}
				stroke={currentPositionStroke}
				opacity={currentPositionOpacity}
				fill="none"
				strokeWidth={currentPositionStrokeWidth}
				r={currentPositionRadius} />
			: null;

		var lines = TrendLine.helper(plotData, xAccessor, interactive, chartData);
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
TrendLine.drawOnCanvas = (context,
		props,
		interactive,
		ctx,
		{ plotData, chartData }) => {

	var { currentPos } = interactive;

	var { xAccessor } = context;
	var lines = TrendLine.helper(plotData, xAccessor, interactive, chartData);

	var { xScale, yScale } = chartData.plot.scales;

	var { enabled, currentPositionStroke, currentPositionStrokeWidth, currentPositionOpacity, currentPositionRadius } = props;
	if (currentPos && enabled) {
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

TrendLine.helper = (plotData, xAccessor, interactive /* , chartData */) => {
	var { currentPos, start, trends } = interactive;
	var temp = trends;
	if (start && currentPos) {
		temp = temp.concat({ start, end: currentPos });
	}
	var lines = temp
		.filter(each => each.start[0] !== each.end[0])
		.map((each) => generateLine(each.start, each.end, xAccessor, plotData));

	return lines;
};

function generateLine(start, end, xAccessor, plotData) {
	/* if (end[0] - start[0] === 0) {
		// vertical line
		throw new Error("Trendline cannot be a vertical line")
	} */
	var m /* slope */ = (end[1] - start[1]) / (end[0] - start[0]);
	var b /* y intercept */ = -1 * m * end[0] + end[1];
	// y = m * x + b
	var x1 = xAccessor(plotData[0]);
	var y1 = m * x1 + b;

	var x2 = xAccessor(plotData[plotData.length - 1]);
	var y2 = m * x2 + b;
	return { x1, y1, x2, y2 };
}

TrendLine.propTypes = {
	snap: React.PropTypes.bool.isRequired,
	enabled: React.PropTypes.bool.isRequired,
	snapTo: React.PropTypes.func,
	shouldDisableSnap: React.PropTypes.func.isRequired,
	chartCanvasType: React.PropTypes.string,
	chartData: React.PropTypes.object,
	plotData: React.PropTypes.array,
	xAccessor: React.PropTypes.func,
	interactive: React.PropTypes.object,
	currentPositionStroke: React.PropTypes.string,
	currentPositionStrokeWidth: React.PropTypes.number,
	currentPositionOpacity: React.PropTypes.number,
	currentPositionRadius: React.PropTypes.number,
	stroke: React.PropTypes.string,
	opacity: React.PropTypes.number,
};

TrendLine.defaultProps = {
	stroke: "#000000",
	opacity: 0.7,
	shouldDisableSnap: (e) => (e.button === 2 || e.shiftKey),
	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,
};

export default makeInteractive(TrendLine, ["click", "mousemove"], { trends: [] });
