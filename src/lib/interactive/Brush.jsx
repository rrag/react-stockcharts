"use strict";

import React, { PropTypes, Component } from "react";

import makeInteractive from "./makeInteractive";

import { hexToRGBA, isDefined, noop } from "../utils";

class Brush extends Component {
	constructor(props) {
		super(props);
		this.onMousemove = this.onMousemove.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	terminate() {
		return {
			x1: null, y1: null,
			x2: null, y2: null,
			startItem: null,
			startClick: null,
		};
	}
	onMousemove({ chartId, xAccessor }, interactive, { currentItem, chartConfig, mouseXY } /* , e */) {
		var { enabled } = this.props;
		var { x1, y1 } = interactive;

		if (enabled && isDefined(x1) && isDefined(y1)) {
			var { yScale } = chartConfig;

			var x2 = xAccessor(currentItem);
			var y2 = yScale.invert(mouseXY[1]);

			return { interactive: { ...interactive, x2, y2 } };
		}
		return { interactive };
	}
	onClick(props, interactive, state, e) {
		var { displayXAccessor, xAccessor } = props;
		var { mouseXY, currentItem, chartConfig } = state;
		var { enabled, onStart, onBrush } = this.props;

		if (enabled) {
			var { x1, y1, startItem, startClick } = interactive;
			var { yScale } = chartConfig;

			var xValue = xAccessor(currentItem);
			var yValue = yScale.invert(mouseXY[1]);

			if (isDefined(x1)) {
				var onCompleteCallback = onBrush.bind(null, {
					x1: displayXAccessor(startItem),
					y1,
					x2: displayXAccessor(currentItem),
					y2: yValue
				}, [startItem, currentItem], [startClick, mouseXY], e);

				var onCompleteBrushCoords =  {
					...interactive,
					x1: null, y1: null,
					x2: null, y2: null,
					startItem: null,
					startClick: null,
				};
				return { interactive: onCompleteBrushCoords, callback: onCompleteCallback };
			} else if (e.button === 0) {

				var onStartCallback = onStart.bind(null, { currentItem, point: [xValue, yValue] }, e);

				let onStartBrushCoords =  {
					...interactive,
					x1: xValue,
					y1: yValue,
					startItem: currentItem,
					startClick: mouseXY,
					x2: null,
					y2: null,
				};
				return { interactive: onStartBrushCoords, callback: onStartCallback };
			}
		}
		return { interactive };
	}
	render() {
		var { chartCanvasType, chartConfig, plotData, xScale, xAccessor, interactive, enabled } = this.props;
		var { type, fill, stroke, opacity } = this.props;

		if (chartCanvasType !== "svg") return null;

		var { x1, y1, x2, y2 } = interactive;

		if (enabled && isDefined(x1) && isDefined(y1) && isDefined(x2) && isDefined(y2)) {
			var brush = Brush.helper(type, plotData, xScale, xAccessor, chartConfig, { x1, y1, x2, y2 });
			return <rect {...brush} fill={fill} stroke={stroke} fillOpacity={opacity} />;
		}
		return null;
	}
}

Brush.drawOnCanvas = (props,
		interactive,
		ctx,
		{ xScale, plotData, chartConfig }) => {

	var { x1, y1, x2, y2 } = interactive;
	var { xAccessor, enabled, stroke, opacity, fill, type } = props;

	if (enabled && x1 && x2) {
		var rect = Brush.helper(type, plotData, xScale, xAccessor, chartConfig, { x1, y1, x2, y2 });

		ctx.strokeStyle = stroke;
		ctx.fillStyle = hexToRGBA(fill, opacity);
		ctx.beginPath();
		ctx.rect(rect.x, rect.y, rect.width, rect.height);
		ctx.stroke();
		ctx.fill();
	}
};

Brush.helper = (type, plotData, xScale, xAccessor, chartConfig, { x1, y1, x2, y2 }) => {
	var { yScale } = chartConfig;

	var left = Math.min(x1, x2);
	var right = Math.max(x1, x2);

	var top = Math.max(y1, y2);
	var bottom = Math.min(y1, y2);

	var x = xScale(left);
	var width = xScale(right) - xScale(left);

	var y = type === "1D" ? 0 : yScale(top);
	var height = type === "1D" ? chartConfig.height : yScale(bottom) - yScale(top);

	// console.log(chartConfig);
	return {
		x,
		y,
		width,
		height,
	};
};

Brush.propTypes = {
	enabled: PropTypes.bool.isRequired,
	onStart: PropTypes.func.isRequired,
	onBrush: PropTypes.func.isRequired,

	type: PropTypes.oneOf(["1D", "2D"]),
	chartCanvasType: PropTypes.string,
	chartConfig: PropTypes.object,
	plotData: PropTypes.array,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	interactive: PropTypes.object,
	stroke: PropTypes.string,
	fill: PropTypes.string,
	opacity: PropTypes.number,
};

Brush.defaultProps = {
	type: "2D",
	stroke: "#000000",
	opacity: 0.3,
	fill: "#3h3h3h",
	onBrush: noop,
	onStart: noop,
};

export default makeInteractive(Brush, ["click", "mousemove"], {} );
