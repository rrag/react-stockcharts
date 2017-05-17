"use strict";

import { nest } from "d3-collection";
import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";

import { isDefined, functor } from "../utils";

class OHLCSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { yAccessor } = this.props;
		var { xAccessor } = moreProps;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		var barData = getOHLCBars(this.props, xAccessor, yAccessor, xScale, yScale, plotData);
		drawOnCanvas(ctx, barData);
	}
	render() {
		var { clip } = this.props;

		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			clip={clip}
			drawOnPan
			/>;
	}
	renderSVG(moreProps) {
		var { className, yAccessor } = this.props;
		var { xAccessor } = moreProps;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;


		var barData = getOHLCBars(this.props, xAccessor, yAccessor, xScale, yScale, plotData);

		var { strokeWidth, bars } = barData;

		return <g className={className}>
			{bars.map((d, idx) => <path key={idx}
				className={d.className} stroke={d.stroke} strokeWidth={strokeWidth}
				d={`M${d.openX1} ${d.openY} L${d.openX2} ${d.openY} M${d.x} ${d.y1} L${d.x} ${d.y2} M${d.closeX1} ${d.closeY} L${d.closeX2} ${d.closeY}`}/>)}
		</g>;
	}
}

OHLCSeries.propTypes = {
	className: PropTypes.string,
	classNames: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string
	]).isRequired,
	stroke: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string
	]).isRequired,
	yAccessor: PropTypes.func.isRequired,
	clip: PropTypes.bool.isRequired,
};

OHLCSeries.defaultProps = {
	className: "react-stockcharts-ohlc",
	yAccessor: (d) => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
	classNames: d => isDefined(d.absoluteChange) ? (d.absoluteChange > 0 ? "up" : "down") : "firstbar",
	stroke: d => isDefined(d.absoluteChange) ? (d.absoluteChange > 0 ? "#6BA583" : "#FF0000") : "#000000",
	clip: true,
};

function drawOnCanvas(ctx, barData) {

	var { strokeWidth, bars } = barData;

	var wickNest = nest()
		.key(d => d.stroke)
		.entries(bars);

	ctx.lineWidth = strokeWidth;

	wickNest.forEach(outer => {
		var { key, values } = outer;
		ctx.strokeStyle = key;
		values.forEach(d => {
			ctx.beginPath();
			ctx.moveTo(d.x, d.y1);
			ctx.lineTo(d.x, d.y2);

			ctx.moveTo(d.openX1, d.openY);
			ctx.lineTo(d.openX2, d.openY);

			ctx.moveTo(d.closeX1, d.closeY);
			ctx.lineTo(d.closeX2, d.closeY);

			ctx.stroke();
		});
	});
}

function getOHLCBars(props, xAccessor, yAccessor, xScale, yScale, plotData) {
	var { classNames: classNamesProp, stroke: strokeProp } = props;

	var strokeFunc = functor(strokeProp);
	var classNameFunc = functor(classNamesProp);

	var width = xScale(xAccessor(plotData[plotData.length - 1]))
		- xScale(xAccessor(plotData[0]));

	var barWidth = Math.max(1, Math.round(width / (plotData.length - 1) / 2) - 1.5);
	var strokeWidth = Math.min(barWidth, 6);

	var bars = plotData
			.filter(d => isDefined(yAccessor(d).close))
			.map(d => {
				var ohlc = yAccessor(d),
					x = Math.round(xScale(xAccessor(d))),
					y1 = yScale(ohlc.high),
					y2 = yScale(ohlc.low),
					openX1 = x - barWidth,
					openX2 = x + strokeWidth / 2,
					openY = yScale(ohlc.open),
					closeX1 = x - strokeWidth / 2,
					closeX2 = x + barWidth,
					closeY = yScale(ohlc.close),
					className = classNameFunc(d),
					stroke = strokeFunc(d);
				// console.log(d);
				return { x, y1, y2, openX1, openX2, openY, closeX1, closeX2, closeY, stroke, className };
			});
	return { barWidth, strokeWidth, bars };
}

export default OHLCSeries;
