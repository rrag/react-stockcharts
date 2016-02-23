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
	onMousemove({ chartId, xAccessor }, interactive, { mouseXY, currentItem, chartConfig } /* , e */) {
		var { enabled } = this.props;
		if (enabled) {
			var { yScale } = chartConfig;

			var yValue = yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);

			if (interactive.start) {
				return { interactive: { ...interactive, tempEnd: [xValue, yValue], } };
			}
		}
		return { interactive };
	}
	onClick({ chartId, xAccessor }, interactive, { mouseXY, currentItem, currentChartstriggerCallback, chartConfig }, e) {
		var { enabled, onStart, onComplete } = this.props;
		if (enabled) {
			var { start, retracements } = interactive;

			var { yScale } = chartConfig;

			var yValue = yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);

			if (start) {
				return {
					interactive: {
						...interactive,
						start: null,
						tempEnd: null,
						retracements: retracements.concat({ start, end: [xValue, yValue] }),
					},
					callback: onComplete.bind(null, { currentItem, point: [xValue, yValue] }, e),
				};
			} else if (e.button === 0) {
				return {
					interactive: {
						...interactive,
						start: [xValue, yValue],
						tempEnd: null,
					},
					callback: onStart.bind(null, { currentItem, point: [xValue, yValue] }, e),
				};
			}
		}
		return { interactive };
	}
	render() {
		var { chartCanvasType, chartConfig, plotData, xScale, xAccessor, interactive } = this.props;
		var { stroke, opacity, fontFamily, fontSize, fontStroke, type } = this.props;

		if (chartCanvasType !== "svg") return null;

		var { yScale } = chartConfig;
		var retracements = FibonacciRetracement.helper(plotData, type, xAccessor, interactive, chartConfig);

		return (
			<g>
				{retracements.map((eachRetracement, idx) => {
					var dir = eachRetracement[0].y1 > eachRetracement[eachRetracement.length - 1].y1 ? 3 : -1.3;
					return <g key={idx}>
						{eachRetracement.map((line, i) => {
							var text = `${ line.y.toFixed(2) } (${ line.percent.toFixed(2) }%)`;

							return (<g key={i}>
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

FibonacciRetracement.drawOnCanvas = (props,
		interactive,
		ctx,
		{ xScale, plotData, chartConfig }) => {

	var { xAccessor } = props;
	var { yScale } = chartConfig;
	var { fontSize, fontFamily, fontStroke, type } = props;
	var lines = FibonacciRetracement.helper(plotData, type, xAccessor, interactive, chartConfig);

	ctx.strokeStyle = hexToRGBA(props.stroke, props.opacity);
	ctx.font = `${ fontSize }px ${ fontFamily }`;
	ctx.fillStyle = fontStroke;

	lines.forEach(retracements => {
		var dir = retracements[0].y1 > retracements[retracements.length - 1].y1 ? 3 : -1.3;

		retracements.forEach((each) => {
			ctx.beginPath();
			ctx.moveTo(xScale(each.x1), yScale(each.y));
			ctx.lineTo(xScale(each.x2), yScale(each.y));

			var text = `${ each.y.toFixed(2) } (${ each.percent.toFixed(2) }%)`;
			ctx.fillText(text, xScale(Math.min(each.x1, each.x2)) + 10, yScale(each.y) + dir * 4);

			ctx.stroke();
		});
	});
};

FibonacciRetracement.helper = (plotData, type, xAccessor, interactive/* , chartConfig */) => {
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
	return [100, 61.8, 50, 38.2, 23.6, 0]
		.map(each => ({
			percent: each,
			x1: type === "EXTEND" ? xAccessor(head(plotData)) : start[0],
			x2: type === "EXTEND" ? xAccessor(last(plotData)) : end[0],
			y: (end[1] - (each / 100) * dy)
		}));
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

export default makeInteractive(FibonacciRetracement, ["click", "mousemove"], { retracements: [] });
