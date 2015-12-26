"use strict";

import React from "react";
import objectAssign from "object-assign";

import makeInteractive from "./makeInteractive";

import { hexToRGBA } from "../utils/utils.js";

class Brush extends React.Component {
	constructor(props) {
		super(props);
		this.onMousemove = this.onMousemove.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	onMousemove(chartId, xAccessor, interactive, { currentItem } /* , e */) {
		var { enabled } = this.props;
		var { startX } = interactive;

		if (enabled && startX) {
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
			var { startX } = interactive;

			var xValue = xAccessor(currentItem);

			if (startX) {
				var brushCoords =  objectAssign({}, interactive, {
					startX: null,
					tempEndX: null,
					startItem: null,
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
				});
			}
		}
		return interactive;
	}
	render() {
		var { chartCanvasType, chartData, plotData, xAccessor, interactive, enabled } = this.props;
		var { fill, stroke, opacity } = this.props;

		if (chartCanvasType !== "svg") return null;

		var { startX, tempEndX } = interactive;

		if (enabled && startX && tempEndX) {
			var brush = [startX, tempEndX];
			var brush = Brush.helper(plotData, xAccessor, chartData, brush);
			return <rect {...brush} fill={fill} stroke={stroke} fillOpacity={opacity} />;
		}
		return null;
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
		var brush = [startX, tempEndX];

		var { xAccessor } = context;
		var rect = Brush.helper(plotData, xAccessor, chartData, brush);

		// console.log("DRAWING", enabled, rect);

		ctx.strokeStyle = stroke;
		ctx.fillStyle = hexToRGBA(fill, opacity);
		ctx.beginPath();
		ctx.rect(rect.x, rect.y, rect.width, rect.height);
		ctx.stroke();
		ctx.fill();
	}
};

Brush.helper = (plotData, xAccessor, chartData, brush) => {
	var { xScale } = chartData.plot.scales;

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
	};
};

Brush.propTypes = {
	enabled: React.PropTypes.bool.isRequired,
	onBrush: React.PropTypes.func.isRequired,

	chartCanvasType: React.PropTypes.string,
	chartData: React.PropTypes.object,
	plotData: React.PropTypes.array,
	xAccessor: React.PropTypes.func,
	interactive: React.PropTypes.object,
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string,
	opacity: React.PropTypes.number,
};

Brush.defaultProps = {
	stroke: "#000000",
	opacity: 0.3,
	fill: "#3h3h3h",
	onBrush: e => { console.log(e); },
};

export default makeInteractive(Brush, ["click", "mousemove"], {} );
