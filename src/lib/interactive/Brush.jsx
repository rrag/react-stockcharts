"use strict";

import React from "react";
import objectAssign from "object-assign";

import makeInteractive from "./makeInteractive";

import { hexToRGBA, isDefined } from "../utils/utils.js";

class Brush extends React.Component {
	constructor(props) {
		super(props);
		this.onMousemove = this.onMousemove.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	onMousemove(chartId, xAccessor, interactive, { currentItem, chartData, mouseXY } /* , e */) {
		var { enabled } = this.props;
		var { x1, y1 } = interactive;

		if (enabled && isDefined(x1) && isDefined(y1)) {
			var yScale = chartData.plot.scales.yScale;

			var x2 = xAccessor(currentItem);
			var y2 = yScale.invert(mouseXY[1]);

			return { ...interactive, x2, y2 };
		}
		return interactive;
	}
	onClick(chartId, xAccessor, interactive, { mouseXY, currentItem, currentChartstriggerCallback, chartData }, e) {
		var { enabled, onBrush, type } = this.props;

		if (enabled) {
			var { x1, y1, startItem, startClick } = interactive;
			var yScale = chartData.plot.scales.yScale;

			var xValue = xAccessor(currentItem);
			var yValue = yScale.invert(mouseXY[1]);

			if (x1) {
				setTimeout(() => {
					if (type === "1D")
						onBrush([x1, xValue], [startItem, currentItem]);
					else 
						onBrush({ x1, y1, x2: xValue, y2: yValue },
							[interactive.startItem, currentItem],
							[startClick, mouseXY]);
				}, 20);
				var brushCoords =  objectAssign({}, interactive, {
					x1: null, y1: null,
					x2: null, y2: null,
					startItem: null,
					startClick: null,
				});
				return brushCoords;
			} else if (e.button === 0) {
				return objectAssign({}, interactive, {
					x1: xValue,
					y1: yValue,
					startItem: currentItem,
					startClick: mouseXY,
					x2: null,
					y2: null,
				});
			}
		}
		return interactive;
	}
	render() {
		var { chartCanvasType, chartData, plotData, xAccessor, interactive, enabled } = this.props;
		var { type, fill, stroke, opacity } = this.props;

		if (chartCanvasType !== "svg") return null;

		var { startX, tempEndX } = interactive;

		if (enabled && startX && tempEndX) {
			var brush = [startX, tempEndX];
			var brush = Brush.helper(type, plotData, xAccessor, chartData, brush);
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

	var { x1, y1, x2, y2 } = interactive;
	var { enabled, stroke, opacity, fill, type } = props;

	// console.log("DRAWING", enabled, interactive);
	if (enabled && x1 && x2) {
		var { xAccessor } = context;
		var rect = Brush.helper(type, plotData, xAccessor, chartData, { x1, y1, x2, y2 });

		ctx.strokeStyle = stroke;
		ctx.fillStyle = hexToRGBA(fill, opacity);
		ctx.beginPath();
		ctx.rect(rect.x, rect.y, rect.width, rect.height);
		ctx.stroke();
		ctx.fill();
	}
};

Brush.helper = (type, plotData, xAccessor, chartData, { x1, y1, x2, y2 }) => {
	var { xScale, yScale } = chartData.plot.scales;

	var left = Math.min(x1, x2);
	var right = Math.max(x1, x2);

	var top = Math.min(y1, y2);
	var bottom = Math.max(y1, y2);

	var x = xScale(left);
	var width = xScale(right) - xScale(left);

	var y = type === "1D" ? 0 : yScale(top);
	var height = type === "1D" ? chartData.config.height : yScale(bottom) - yScale(top);

	// console.log(chartData);
	return {
		x,
		y,
		width,
		height,
	};
};

Brush.propTypes = {
	enabled: React.PropTypes.bool.isRequired,
	onBrush: React.PropTypes.func.isRequired,

	type: React.PropTypes.oneOf(["1D", "2D"]),
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
	type: "2D",
	stroke: "#000000",
	opacity: 0.3,
	fill: "#3h3h3h",
	onBrush: e => { console.log(e); },
};

export default makeInteractive(Brush, ["click", "mousemove"], {} );
