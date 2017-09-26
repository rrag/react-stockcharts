"use strict";

import { nest } from "d3-collection";

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import {
	hexToRGBA, isDefined, functor, plotDataLengthBarWidth, head
} from "../utils";

class CandlestickSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		drawOnCanvas(ctx, this.props, moreProps);
	}
	renderSVG(moreProps) {
		const { className, wickClassName, candleClassName } = this.props;
		const { xScale, chartConfig: { yScale }, plotData, xAccessor } = moreProps;

		const candleData = getCandleData(this.props, xAccessor, xScale, yScale, plotData);

		return <g className={className}>
			<g className={wickClassName} key="wicks">
				{getWicksSVG(candleData)}
			</g>
			<g className={candleClassName} key="candles">
				{getCandlesSVG(this.props, candleData)}
			</g>
		</g>;
	}

	render() {
		const { clip } = this.props;
		return <GenericChartComponent
			clip={clip}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getAxisCanvas}
			drawOn={["pan"]}
		/>;
	}
}

CandlestickSeries.propTypes = {
	className: PropTypes.string,
	wickClassName: PropTypes.string,
	candleClassName: PropTypes.string,
	widthRatio: PropTypes.number,
	width: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func
	]),
	classNames: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string
	]),
	fill: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string
	]),
	stroke: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string
	]),
	wickStroke: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string
	]),
	yAccessor: PropTypes.func,
	clip: PropTypes.bool,
};

CandlestickSeries.defaultProps = {
	className: "react-stockcharts-candlestick",
	wickClassName: "react-stockcharts-candlestick-wick",
	candleClassName: "react-stockcharts-candlestick-candle",
	yAccessor: d => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
	classNames: d => d.close > d.open ? "up" : "down",
	width: plotDataLengthBarWidth,
	wickStroke: "#000000",
	// wickStroke: d => d.close > d.open ? "#6BA583" : "#FF0000",
	fill: d => d.close > d.open ? "#6BA583" : "#FF0000",
	// stroke: d => d.close > d.open ? "#6BA583" : "#FF0000",
	stroke: "#000000",
	candleStrokeWidth: 0.5,
	// stroke: "none",
	widthRatio: 0.8,
	opacity: 0.5,
	clip: true,
};

function getWicksSVG(candleData) {

	const wicks = candleData
		.map((each, idx) => {
			const d = each.wick;
			return <path key={idx}
				className={each.className}
				stroke={d.stroke}
				d={`M${d.x},${d.y1} L${d.x},${d.y2} M${d.x},${d.y3} L${d.x},${d.y4}`} />;
		});

	return wicks;
}

function getCandlesSVG(props, candleData) {

	/* eslint-disable react/prop-types */
	const { opacity, candleStrokeWidth } = props;
	/* eslint-enable react/prop-types */

	const candles = candleData.map((d, idx) => {
		if (d.width <= 1)
			return (
				<line className={d.className} key={idx}
					x1={d.x} y1={d.y} x2={d.x} y2={d.y + d.height}
					stroke={d.fill} />
			);
		else if (d.height === 0)
			return (
				<line key={idx}
					x1={d.x} y1={d.y} x2={d.x + d.width} y2={d.y + d.height}
					stroke={d.fill} />
			);
		return (
			<rect key={idx} className={d.className}
				fillOpacity={opacity}
				x={d.x} y={d.y} width={d.width} height={d.height}
				fill={d.fill} stroke={d.stroke} strokeWidth={candleStrokeWidth} />
		);
	});
	return candles;
}

function drawOnCanvas(ctx, props, moreProps) {
	const { opacity, candleStrokeWidth } = props;
	const { xScale, chartConfig: { yScale }, plotData, xAccessor } = moreProps;

	// const wickData = getWickData(props, xAccessor, xScale, yScale, plotData);
	const candleData = getCandleData(props, xAccessor, xScale, yScale, plotData);

	const wickNest = nest()
		.key(d => d.wick.stroke)
		.entries(candleData);

	wickNest.forEach(outer => {
		const { key, values } = outer;
		ctx.strokeStyle = key;
		ctx.fillStyle = key;
		values.forEach(each => {
			/*
			ctx.moveTo(d.x, d.y1);
			ctx.lineTo(d.x, d.y2);

			ctx.beginPath();
			ctx.moveTo(d.x, d.y3);
			ctx.lineTo(d.x, d.y4);
			ctx.stroke(); */
			const d = each.wick;

			ctx.fillRect(d.x - 0.5, d.y1, 1, d.y2 - d.y1);
			ctx.fillRect(d.x - 0.5, d.y3, 1, d.y4 - d.y3);
		});
	});

	// const candleData = getCandleData(props, xAccessor, xScale, yScale, plotData);

	const candleNest = nest()
		.key(d => d.stroke)
		.key(d => d.fill)
		.entries(candleData);


	candleNest.forEach(outer => {
		const { key: strokeKey, values: strokeValues } = outer;
		if (strokeKey !== "none") {
			ctx.strokeStyle = strokeKey;
			ctx.lineWidth = candleStrokeWidth;
		}
		strokeValues.forEach(inner => {
			const { key, values } = inner;
			const fillStyle = head(values).width <= 1
				? key
				: hexToRGBA(key, opacity);
			ctx.fillStyle = fillStyle;

			values.forEach(d => {
				if (d.width <= 1) {
					// <line className={d.className} key={idx} x1={d.x} y1={d.y} x2={d.x} y2={d.y + d.height}/>
					/*
					ctx.beginPath();
					ctx.moveTo(d.x, d.y);
					ctx.lineTo(d.x, d.y + d.height);
					ctx.stroke();
					*/
					ctx.fillRect(d.x - 0.5, d.y, 1, d.height);
				} else if (d.height === 0) {
					// <line key={idx} x1={d.x} y1={d.y} x2={d.x + d.width} y2={d.y + d.height} />
					/*
					ctx.beginPath();
					ctx.moveTo(d.x, d.y);
					ctx.lineTo(d.x + d.width, d.y + d.height);
					ctx.stroke();
					*/
					ctx.fillRect(d.x, d.y - 0.5, d.width, 1);
				} else {
					/*
					ctx.beginPath();
					ctx.rect(d.x, d.y, d.width, d.height);
					ctx.closePath();
					ctx.fill();
					if (strokeKey !== "none") ctx.stroke();
					*/
					ctx.fillRect(d.x, d.y, d.width, d.height);
					if (strokeKey !== "none") ctx.strokeRect(d.x, d.y, d.width, d.height);
				}
			});
		});
	});
}
/*
function getWickData(props, xAccessor, xScale, yScale, plotData) {

	const { classNames: classNameProp, wickStroke: wickStrokeProp, yAccessor } = props;
	const wickStroke = functor(wickStrokeProp);
	const className = functor(classNameProp);
	const wickData = plotData
			.filter(d => isDefined(yAccessor(d).close))
			.map(d => {
				// console.log(yAccessor);
				const ohlc = yAccessor(d);

				const x = Math.round(xScale(xAccessor(d))),
					y1 = yScale(ohlc.high),
					y2 = yScale(Math.max(ohlc.open, ohlc.close)),
					y3 = yScale(Math.min(ohlc.open, ohlc.close)),
					y4 = yScale(ohlc.low);

				return {
					x,
					y1,
					y2,
					y3,
					y4,
					className: className(ohlc),
					direction: (ohlc.close - ohlc.open),
					stroke: wickStroke(ohlc),
				};
			});
	return wickData;
}
*/

function getCandleData(props, xAccessor, xScale, yScale, plotData) {

	const { wickStroke: wickStrokeProp } = props;
	const wickStroke = functor(wickStrokeProp);

	const { classNames, fill: fillProp, stroke: strokeProp, yAccessor } = props;
	const className = functor(classNames);

	const fill = functor(fillProp);
	const stroke = functor(strokeProp);

	const widthFunctor = functor(props.width);
	const width = widthFunctor(props, {
		xScale,
		xAccessor,
		plotData
	});

	/*
	const candleWidth = Math.round(width);
	const offset = Math.round(candleWidth === 1 ? 0 : 0.5 * width);
	*/
	const trueOffset = 0.5 * width;
	const offset = trueOffset > 0.7
		? Math.round(trueOffset)
		: Math.floor(trueOffset);

	// eslint-disable-next-line prefer-const
	let candles = [];

	for (let i = 0; i < plotData.length; i++) {
		const d = plotData[i];
		if (isDefined(yAccessor(d).close)) {
			const x = Math.round(xScale(xAccessor(d)));
			// const x = Math.round(xScale(xAccessor(d)) - offset);

			const ohlc = yAccessor(d);
			const y = Math.round(yScale(Math.max(ohlc.open, ohlc.close)));
			const height = Math.round(Math.abs(yScale(ohlc.open) - yScale(ohlc.close)));

			candles.push({
				// type: "line"
				x: x - offset,
				y: y,
				wick: {
					stroke: wickStroke(ohlc),
					x: x,
					y1: Math.round(yScale(ohlc.high)),
					y2: y,
					y3: y + height, // Math.round(yScale(Math.min(ohlc.open, ohlc.close))),
					y4: Math.round(yScale(ohlc.low)),
				},
				height: height,
				width: offset * 2,
				className: className(ohlc),
				fill: fill(ohlc),
				stroke: stroke(ohlc),
				direction: (ohlc.close - ohlc.open),
			});
		}
	}

	return candles;
}

export default CandlestickSeries;
