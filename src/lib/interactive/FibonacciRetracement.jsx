"use strict";

import React, { PropTypes, Component } from "react";
import makeInteractive from "./makeInteractive";
import { head, last, hexToRGBA } from "../utils";

class FibonacciRetracement extends Component {
	constructor(props) {
		super(props);
		this.onMousemove = this.onMousemove.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	removeLast(interactive) {
		var { retracements, start } = interactive;
		if (!start && retracements.length > 0) {
			return { ...interactive, retracements: retracements.slice(0, retracements.length - 1) };
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

		var { enabled, xAccessor } = this.props;
		if (enabled) {
			var { yScale } = chartConfig;

			var yValue = yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);

			if (interactiveState.start) {
				return { ...interactiveState, tempEnd: [xValue, yValue], };
			}
		}
		return interactiveState;
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

		var { enabled, xAccessor } = this.props;
		if (enabled) {
			var { start, retracements } = interactiveState;

			var { yScale } = chartConfig;

			var yValue = yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);

			if (start) {
				return {
					...interactiveState,
					start: null,
					tempEnd: null,
					retracements: retracements.concat({ start, end: [xValue, yValue] }),
				};
			} else if (eventMeta.button === 0) {
				return {
					...interactiveState,
					start: [xValue, yValue],
					tempEnd: null,
				};
			}
		}
		return interactiveState;
	}
	render() {
		var { chartCanvasType, chartConfig, plotData, xScale, xAccessor, interactiveState } = this.props;
		var { stroke, opacity, fontFamily, fontSize, fontStroke, type, enabled } = this.props;

		var { yScale } = chartConfig;
		var retracements = helper(plotData, type, xAccessor, interactiveState, chartConfig);
		var className = enabled ? "react-stockcharts-avoid-interaction" : ""
		return (
			<g className={className}>
				{retracements.map((eachRetracement, idx) => {
					var dir = eachRetracement[0].y1 > eachRetracement[eachRetracement.length - 1].y1 ? 3 : -1.3;

					return <g key={idx}>
						{eachRetracement.map((line, i) => {
							var text = `${ line.y.toFixed(2) } (${ line.percent.toFixed(2) }%)`;
							var cursorClassName = enabled ? "" : (i === 0 || i === eachRetracement.length - 1)
								? "react-stockcharts-ns-resize-cursor"
								: "react-stockcharts-move-cursor"
							return (<g key={i} className={cursorClassName}>
								<line
									x1={xScale(line.x1)} y1={yScale(line.y)}
									x2={xScale(line.x2)} y2={yScale(line.y)}
									stroke={stroke} opacity={opacity} />
								<text x={xScale(Math.min(line.x1, line.x2)) + 10} y={yScale(line.y) + dir * 4}
									fontFamily={fontFamily} fontSize={fontSize} fill={fontStroke}>{text}</text>
							</g>);
						})}
					</g>;
				})}
			</g>
		);
	}
}

function helper(plotData, type, xAccessor, interactive/* , chartConfig */) {
	var { retracements, start, tempEnd } = interactive;

	var temp = retracements;

	if (start && tempEnd) {
		temp = temp.concat({ start, end: tempEnd });
	}
	var lines = temp
		.map((each) => generateLine(type, each.start, each.end, xAccessor, plotData));

	return lines;
};

function generateLine(type, start, end, xAccessor, plotData) {
	var dy = end[1] - start[1];
	var retracements = [100, 61.8, 50, 38.2, 23.6, 0]
		.map(each => ({
			percent: each,
			x1: type === "EXTEND" ? xAccessor(head(plotData)) : start[0],
			x2: type === "EXTEND" ? xAccessor(last(plotData)) : end[0],
			y: (end[1] - (each / 100) * dy)
		}));

	return retracements
}

FibonacciRetracement.propTypes = {
	snap: PropTypes.bool.isRequired,
	enabled: PropTypes.bool.isRequired,
	snapTo: PropTypes.func,
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	chartCanvasType: PropTypes.string,
	chartConfig: PropTypes.object,
	plotData: PropTypes.array,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	interactive: PropTypes.object,
	width: PropTypes.number,
	stroke: PropTypes.string,
	opacity: PropTypes.number,
	fontStroke: PropTypes.string,
	onStart: PropTypes.func,
	onComplete: PropTypes.func,
	type: PropTypes.oneOf([
		"EXTEND", // extends from -Infinity to +Infinity
		"BOUND", // extends between the set bounds
	]).isRequired,
};

FibonacciRetracement.defaultProps = {
	snap: true,
	enabled: true,
	stroke: "#000000",
	opacity: 0.4,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 10,
	fontStroke: "#000000",
	type: "EXTEND",

};

export default makeInteractive(FibonacciRetracement, { retracements: [] });
