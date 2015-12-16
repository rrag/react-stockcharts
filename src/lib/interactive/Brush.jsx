"use strict";

import React from "react";
import objectAssign from "object-assign";

import makeInteractive from "./makeInteractive";
import Utils from "../utils/utils.js";

function getYValue(values, currentValue) {
	var diff = values
		.map(each => each - currentValue)
		.reduce((diff1, diff2) => Math.abs(diff1) < Math.abs(diff2) ? diff1 : diff2);
	return currentValue + diff;
}

class Brush extends React.Component {
	constructor(props) {
		super(props);
		this.onMousemove = this.onMousemove.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	onMousemove(chartId, xAccessor, interactive, { mouseXY, currentItem, currentCharts, chartData }, e) {
		var { enabled } = this.props;
		var { startX } = interactive;

		if (enabled && startX) {
			var { xScale, yScale } = chartData.plot.scales;

			var yValue = yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);
			return objectAssign({}, interactive, {
				tempEndX: xValue,
			});
		}
		return interactive;
	}
	onClick(chartId, xAccessor, interactive, { mouseXY, currentItem, currentChartstriggerCallback, chartData }, e) { 
		var { enabled, onBrush } = this.props;

		if (enabled) {
			var { startX, tempEndX } = interactive;

			var { xScale, yScale } = chartData.plot.scales;

			var yValue = yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);

			if (startX) {
				var brushCoords =  objectAssign({}, interactive, {
					startX: null,
					tempEndX: null,
					startItem: null,
					// brush: [interactive.startX, xValue]
				});
				setTimeout(() => {
					onBrush([interactive.startX, xValue], [interactive.startItem, currentItem]);
				}, 20);

				return brushCoords;
			} else if (e.button === 0) {
				return objectAssign({}, interactive, {
					startX: xValue,
					startItem: currentItem,
					tempEndX: null,
					// brush: null,
				})
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

		var lines = Brush.helper(plotData, xAccessor, interactive, chartData);
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

Brush.drawOnCanvas = (context,
		props,
		interactive,
		ctx,
		{ plotData, chartData }) => {

	var { startX, tempEndX } = interactive;
	var { enabled, stroke, opacity, fill } = props;

	if (enabled && startX && tempEndX) {
		var brush = [ startX, tempEndX ];

		var { xAccessor } = context;
		var rect = Brush.helper(plotData, xAccessor, chartData, brush);

		// console.log("DRAWING", enabled, rect);

		ctx.strokeStyle = stroke;
		ctx.fillStyle = Utils.hexToRGBA(fill, opacity);
		ctx.beginPath();
		ctx.rect(rect.x, rect.y, rect.width, rect.height);
		ctx.stroke();
		ctx.fill();
	}
};

Brush.helper = (plotData, xAccessor, chartData, brush) => {
	var { xScale, yScale } = chartData.plot.scales;

	var left = Math.min(brush[0], brush[1]);
	var right = Math.max(brush[0], brush[1]);

	var x = xScale(left);
	var width = xScale(right) - xScale(left);

	// console.log(chartData);
	return {
		x,
		y: 0,
		width,
		height: chartData.config.height
	}
};

Brush.propTypes = {
	enabled: React.PropTypes.bool.isRequired,
	onBrush: React.PropTypes.func.isRequired,
};

Brush.defaultProps = {
	stroke: "#000000",
	opacity: 0.3,
	fill: "#3h3h3h",
	onBrush: e => { console.log(e) },
};

export default makeInteractive(Brush, ["click", "mousemove"], {} );
