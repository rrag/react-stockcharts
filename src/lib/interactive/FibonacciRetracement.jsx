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
		var indicators = interactive.retracements;
		return objectAssign({}, interactive, { retracements: indicators.slice(0, indicators.length - 1)})
	}
	onMousemove(chartId, xAccessor, interactive, { mouseXY, currentItem, currentCharts, chartData }, e) {
		var { enabled } = this.props;
		if (enabled) {
			// console.log("HERE");
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
			var xValue = xAccessor(currentItem);interactive

			// console.error(interactive, [xValue, yValue]);

			if (start) {
				return objectAssign({}, interactive, {
					start: null,
					tempEnd: null,
					retracements: retracements.concat({start, end: [xValue, yValue]}),
				});
			} else {
				return objectAssign({}, interactive, {
					start: [xValue, yValue],
					tempEnd: null,
				});
			}
		}
		return interactive;
	}
	render() {
		var { chartCanvasType, chartData, plotData, xAccessor } = this.props;

		if (chartCanvasType !== "svg") return null;

		var { xScale, yScale } = chartData.plot.scales;
		var { retracements, currentPos, start, tempEnd } = this.state.interactive;

		var temp = retracements;
		if (start && tempEnd) {
			temp = retracements.concat({ start, end: tempEnd });
		}

		var lines = FibonacciRetracement.helper(plotData, xAccessor, temp, chartData);

		var circle = (currentPos)
			? <circle cx={xScale(currentPos[0])} cy={yScale(currentPos[1])} stroke="steelblue" fill="none" strokeWidth={2} r={3} />
			: null;
		// console.log(circle);
		return (
			<g>
				{circle}
				{lines
				.map((coords, idx) => 
					<line key={idx} stroke="black" x1={xScale(coords.x1)} y1={yScale(coords.y1)}
						x2={xScale(coords.x2)} y2={yScale(coords.y2)} />)}
			</g>
		);
	}
}

FibonacciRetracement.drawOnCanvas = (context,
		props,
		interactive,
		ctx,
		{ plotData, chartData }) => {

		// console.error("DRAW")
	var { xAccessor, width } = context;
	var { xScale, yScale } = chartData.plot.scales;
	var lines = FibonacciRetracement.helper(plotData, xAccessor, interactive, chartData);

	ctx.strokeStyle = Utils.hexToRGBA(props.stroke, props.opacity);

	lines.forEach(retracements => {
		var dir = retracements[0].y1 > retracements[retracements.length - 1].y1 ? 3 : -1.3

		retracements.forEach((each) => {
			ctx.beginPath();
			ctx.moveTo(0, yScale(each.y));
			ctx.lineTo(width, yScale(each.y));

			var text = `${ each.y.toFixed(2) } (${ each.percent.toFixed(2) }%)`
			ctx.fillText(text, 10, yScale(each.y) + dir * 4);

			ctx.stroke();
		})
	});
};

FibonacciRetracement.helper = (plotData, xAccessor, interactive, chartData) => {
	var { retracements, start, tempEnd } = interactive;

	var temp = retracements;

	if (start && tempEnd) {
		temp = temp.concat({ start, end: tempEnd })
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
		.map(each => ({ percent: each, y: (end[1] - (each / 100) * dy) }))
		// .map(each => ({ percent: each.percent, y: each.y, y2: each.y }));
}

FibonacciRetracement.propTypes = {
	snap: React.PropTypes.bool.isRequired,
	enabled: React.PropTypes.bool.isRequired,
	snapTo: React.PropTypes.func,
};

FibonacciRetracement.defaultProps = {
	snap: true,
	enabled: true,
	stroke: "#000000",
	opacity: 0.4,
};

// export default preventUpdate(makeInteractive(FibonacciRetracement, ["click", "mousemove"], { retracements: [] }));
export default makeInteractive(FibonacciRetracement, ["click", "mousemove"], { retracements: [] });
