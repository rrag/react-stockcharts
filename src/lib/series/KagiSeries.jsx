"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { line, curveStepBefore } from "d3-shape";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";
import { isDefined, isNotDefined } from "../utils";

class KagiSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { xAccessor } = moreProps;

		drawOnCanvas(ctx, this.props, moreProps, xAccessor);
	}
	render() {
		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnPan
			/>;
	}
	renderSVG(moreProps) {
		var { xAccessor } = moreProps;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		var { className, stroke, fill, strokeWidth } = this.props;

		var paths = helper(plotData, xAccessor).map((each, i) => {
			var dataSeries = line()
				.x((item) => xScale(item[0]))
				.y((item) => yScale(item[1]))
				.curve(curveStepBefore);

			dataSeries(each.plot);

			return (<path key={i} d={dataSeries(each.plot)} className={each.type}
				stroke={stroke[each.type]} fill={fill[each.type]} strokeWidth={strokeWidth} />);
		});
		return (
			<g className={className}>
				{paths}
			</g>
		);
	}
}
KagiSeries.propTypes = {
	className: PropTypes.string,
	stroke: PropTypes.object,
	fill: PropTypes.object,
	strokeWidth: PropTypes.number.isRequired,
};

KagiSeries.defaultProps = {
	className: "react-stockcharts-kagi",
	strokeWidth: 2,
	stroke: {
		yang: "#6BA583",
		yin: "#E60000"
	},
	fill: {
		yang: "none",
		yin: "none"
	},
	currentValueStroke: "#000000",
};

function drawOnCanvas(ctx, props, moreProps, xAccessor) {
	var { stroke, strokeWidth, currentValueStroke } = props;
	var { xScale, chartConfig: { yScale }, plotData } = moreProps;

	var paths = helper(plotData, xAccessor);

	var begin = true;

	paths.forEach((each) => {
		ctx.strokeStyle = stroke[each.type];
		ctx.lineWidth = strokeWidth;

		ctx.beginPath();
		var prevX;
		each.plot.forEach(d => {
			var [x, y] = [xScale(d[0]), yScale(d[1])];
			if (begin) {
				ctx.moveTo(x, y);
				begin = false;
			} else {
				if (isDefined(prevX)) {
					ctx.lineTo(prevX, y);
				}
				ctx.lineTo(x, y);
			}
			prevX = x;
			// console.log(d);

		});
		ctx.stroke();
	});
	var lastPlot = paths[paths.length - 1].plot;
	var last = lastPlot[lastPlot.length - 1];
	ctx.beginPath();
	// ctx.strokeStyle = "black";
	ctx.lineWidth = 1;

	var [x, y1, y2] = [xScale(last[0]), yScale(last[2]), yScale(last[3])];
	// console.log(last, x, y);
	ctx.moveTo(x, y1);
	ctx.lineTo(x + 10, y1);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = currentValueStroke;
	ctx.moveTo(x - 10, y2);
	ctx.lineTo(x, y2);
	ctx.stroke();
}

function helper(plotData, xAccessor) {
	var kagiLine = [];
	var kagi = {};
	var d = plotData[0];
	var idx = xAccessor(d);

	for (let i = 0; i < plotData.length; i++) {
		d = plotData[i];

		if (isNotDefined(d.close)) continue;
		if (isNotDefined(kagi.type)) kagi.type = d.startAs;
		if (isNotDefined(kagi.plot)) kagi.plot = [];

		idx = xAccessor(d);
		kagi.plot.push([idx, d.open]);

		if (isDefined(d.changeTo)) {
			kagi.plot.push([idx, d.changePoint]);
			kagi.added = true;
			kagiLine.push(kagi);

			kagi = {
				type: d.changeTo,
				plot: [],
				added: false,
			};
			kagi.plot.push([idx, d.changePoint]);
		}
	}

	if (!kagi.added) {
		kagi.plot.push([idx, d.close, d.current, d.reverseAt]);
		kagiLine.push(kagi);
	}

	// console.log(d.reverseAt);

	return kagiLine;
}

export default KagiSeries;
