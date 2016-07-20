"use strict";

import React, { PropTypes, Component } from "react";

import makeInteractive from "./makeInteractive";

import { isDefined, noop } from "../utils";

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
			status: null,
		};
	}
	onMousemove(state) {
		var {
			// xScale,
			// plotData,
			mouseXY,
			// currentCharts,
			currentItem,
			chartConfig,
			interactiveState,
			// eventMeta,
		} = state;

		var { enabled, xAccessor } = this.props;
		var { x1, y1 } = interactiveState;

		var status = "mousemove";
		if (enabled && isDefined(x1) && isDefined(y1)) {
			var { yScale } = chartConfig;

			var x2 = xAccessor(currentItem);
			var y2 = yScale.invert(mouseXY[1]);

			return { ...interactiveState, x2, y2, status };
		}
		return { ...interactiveState, status, callbackProps: null };
	}
	onClick(state) {
		var {
			// xScale,
			// plotData,
			mouseXY,
			// currentCharts,
			currentItem,
			chartConfig,
			interactiveState,
			eventMeta,
		} = state;

		var { displayXAccessor, xAccessor } = this.props;
		var { enabled } = this.props;

		if (enabled) {
			var { x1, y1, startItem, startClick } = interactiveState;
			var { yScale } = chartConfig;

			var xValue = xAccessor(currentItem);
			var yValue = yScale.invert(mouseXY[1]);

			if (interactiveState.status === "brush") {
				return {
					...interactiveState,
					status: null,
				};
			} else if (isDefined(x1)) {
				var callbackProps = [{
					x1: displayXAccessor(startItem),
					y1,
					x2: displayXAccessor(currentItem),
					y2: yValue,
					startItem,
					currentItem,
					startClick,
					mouseXY
				}, eventMeta];

				var interactive =  {
					// ...interactiveState,
					x1: null, y1: null,
					x2: null, y2: null,
					startItem: null,
					startClick: null,
					status: "brush",
					callbackProps,
				};
				// return { interactive: onCompleteBrushCoords, callback: onCompleteCallback };
				return interactive;
			} else if (eventMeta.button === 0) {

				return {
					x1: xValue,
					y1: yValue,
					startItem: currentItem,
					startClick: mouseXY,
					x2: null,
					y2: null,
					status: "start",
				};
			}
		}
		return interactiveState;
	}
	render() {
		var { chartConfig, plotData, xScale, xAccessor, interactiveState, enabled } = this.props;
		var { type, fill, stroke, opacity } = this.props;

		var { x1, y1, x2, y2 } = interactiveState;

		if (enabled && isDefined(x1) && isDefined(y1) && isDefined(x2) && isDefined(y2)) {
			var brush = helper(type, plotData, xScale, xAccessor, chartConfig, { x1, y1, x2, y2 });
			return <rect className="react-stockcharts-avoid-interaction"
				{...brush} fill={fill} stroke={stroke} fillOpacity={opacity} />;
		}
		return null;
	}
}

function helper(type, plotData, xScale, xAccessor, chartConfig, { x1, y1, x2, y2 }) {
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
}

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
	displayXAccessor: PropTypes.func,
	interactiveState: PropTypes.object,
};

Brush.defaultProps = {
	type: "2D",
	stroke: "#000000",
	opacity: 0.3,
	fill: "#3h3h3h",
	onBrush: noop,
	onStart: noop,
};

export default makeInteractive(Brush, {});
