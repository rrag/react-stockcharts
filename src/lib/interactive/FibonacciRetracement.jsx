"use strict";

import React from "react";
import objectAssign from "object-assign";
import makeInteractive from "./makeInteractive";
import Utils from "../utils/utils.js";

class FibonacciRetracement extends React.Component {
	constructor(props) {
		super(props);
		this.onMousemove = this.onMousemove.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	removeIndicator(chartId, xAccessor, interactive) {
		var { start, retracements } = interactive;
		if (start) {
			return objectAssign({}, interactive, { start: null, tempEnd: null });
		} else {
			return objectAssign({}, interactive, { retracements: retracements.slice(0, retracements.length - 1) });
		}
	}
	onMousemove(chartId, xAccessor, interactive, { mouseXY, currentItem, currentCharts, chartData }, e) {
		var { enabled } = this.props;
		if (enabled) {
			var { xScale, yScale } = chartData.plot.scales;

			var yValue = yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);

			if (interactive.start) {
				return objectAssign({}, interactive, {
					tempEnd: [xValue, yValue],
				});
			}
		}
		return interactive;
	}
	onClick(chartId, xAccessor, interactive, { mouseXY, currentItem, currentChartstriggerCallback, chartData }, e) { 
		var { enabled } = this.props;
		if (enabled) {
			var { start, retracements } = interactive;

			var { xScale, yScale } = chartData.plot.scales;

			var yValue = yScale.invert(mouseXY[1]);
			var xValue = xAccessor(currentItem);interactive;

			if (start) {
				return objectAssign({}, interactive, {
					start: null,
					tempEnd: null,
					retracements: retracements.concat({start, end: [xValue, yValue]}),
				});
			} else if (e.button === 0) {
				return objectAssign({}, interactive, {
					start: [xValue, yValue],
					tempEnd: null,
				});
			}
		}
		return interactive;
	}
	render() {
		var { chartCanvasType, chartData, plotData, xAccessor, interactive, width } = this.props;
		var { stroke, opacity, fontFamily, fontSize, fontStroke } = this.props;

		if (chartCanvasType !== "svg") return null;

		var { xScale, yScale } = chartData.plot.scales;
		var retracements = FibonacciRetracement.helper(plotData, xAccessor, interactive, chartData);

		return (
			<g>
				{retracements.map((eachRetracement, idx) => {
					var dir = eachRetracement[0].y1 > eachRetracement[eachRetracement.length - 1].y1 ? 3 : -1.3;
					return <g key={idx}>
						{eachRetracement.map((line, i) => {
							var text = `${ line.y.toFixed(2) } (${ line.percent.toFixed(2) }%)`;

							return (<g key={i}>
								<line
									x1={0} y1={yScale(line.y)} x2={width} y2={yScale(line.y)} 
									stroke={stroke} opacity={opacity} />
								<text x={10} y={yScale(line.y) + dir * 4}
									fontFamily={fontFamily} fontSize={fontSize} fill={fontStroke}>{text}</text>
							</g>);
						})}
					</g>;
				})}
			</g>
		);
	}
}

FibonacciRetracement.drawOnCanvas = (context,
		props,
		interactive,
		ctx,
		{ plotData, chartData }) => {

	var { xAccessor, width } = context;
	var { xScale, yScale } = chartData.plot.scales;
	var { fontSize, fontFamily, fontStroke } = props;
	var lines = FibonacciRetracement.helper(plotData, xAccessor, interactive, chartData);

	ctx.strokeStyle = Utils.hexToRGBA(props.stroke, props.opacity);
	ctx.font = `${ fontSize }px ${ fontFamily }`;
	ctx.fillStyle = fontStroke;

	lines.forEach(retracements => {
		var dir = retracements[0].y1 > retracements[retracements.length - 1].y1 ? 3 : -1.3;

		retracements.forEach((each) => {
			ctx.beginPath();
			ctx.moveTo(0, yScale(each.y));
			ctx.lineTo(width, yScale(each.y));

			var text = `${ each.y.toFixed(2) } (${ each.percent.toFixed(2) }%)`;
			ctx.fillText(text, 10, yScale(each.y) + dir * 4);

			ctx.stroke();
		});
	});
};

FibonacciRetracement.helper = (plotData, xAccessor, interactive, chartData) => {
	var { retracements, start, tempEnd } = interactive;

	var temp = retracements;

	if (start && tempEnd) {
		temp = temp.concat({ start, end: tempEnd });
	}
	var lines = temp
		.map((each, idx) => generateLine(each.start, each.end, xAccessor, plotData));

	return lines;
};

function generateLine(start, end, xAccessor, plotData) {

	var first = xAccessor(plotData[0]);
	var last = xAccessor(plotData[plotData.length - 1]);
	var dy = end[1] - start[1];
	return [100, 61.8, 50, 38.2, 23.6, 0]
		.map(each => ({ percent: each, y: (end[1] - (each / 100) * dy) }));
}

FibonacciRetracement.propTypes = {
	snap: React.PropTypes.bool.isRequired,
	enabled: React.PropTypes.bool.isRequired,
	snapTo: React.PropTypes.func,
	fontFamily: React.PropTypes.string.isRequired,
	fontSize: React.PropTypes.number.isRequired,
};

FibonacciRetracement.defaultProps = {
	snap: true,
	enabled: true,
	stroke: "#000000",
	opacity: 0.4,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 10,
	fontStroke: "#000000",
};

export default makeInteractive(FibonacciRetracement, ["click", "mousemove"], { retracements: [] });
