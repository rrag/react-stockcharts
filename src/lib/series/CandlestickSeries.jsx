"use strict";

import { nest } from "d3-collection";

import React, { PropTypes, Component } from "react";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { first, last, hexToRGBA, isDefined, functor } from "../utils";

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

		return <g className={className}>
			<g className={wickClassName} key="wicks">
				{getWicksSVG(this.props, moreProps)}
			</g>
			<g className={candleClassName} key="candles">
				{getCandlesSVG(this.props, moreProps)}
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
	widthRatio: PropTypes.number.isRequired,
	classNames: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string
	]).isRequired,
	fill: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string
	]).isRequired,
	stroke: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string
	]).isRequired,
	wickStroke: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string
	]).isRequired,
	yAccessor: PropTypes.func.isRequired,
	clip: PropTypes.bool.isRequired,
};

CandlestickSeries.defaultProps = {
	className: "react-stockcharts-candlestick",
	wickClassName: "react-stockcharts-candlestick-wick",
	candleClassName: "react-stockcharts-candlestick-candle",
	yAccessor: d => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
	classNames: d => d.close > d.open ? "up" : "down",
	widthRatio: 0.8,
	wickStroke: "#000000",
	// wickStroke: d => d.close > d.open ? "#6BA583" : "#FF0000",
	fill: d => d.close > d.open ? "#6BA583" : "#FF0000",
	// stroke: d => d.close > d.open ? "#6BA583" : "#FF0000",
	stroke: "#000000",
	candleStrokeWidth: 0.5,
	// stroke: "none",
	opacity: 0.5,
	clip: true,
};

function getWicksSVG(props, moreProps) {

	/* eslint-disable react/prop-types */
	const { xScale, chartConfig: { yScale }, plotData, xAccessor } = moreProps;
	/* eslint-enable react/prop-types */

	const wickData = getWickData(props, xAccessor, xScale, yScale, plotData);
	const wicks = wickData
		.map((d, idx) => <path key={idx}
			className={d.className} stroke={d.stroke} style={{ shapeRendering: "crispEdges" }}
			d={`M${d.x},${d.y1} L${d.x},${d.y2} M${d.x},${d.y3} L${d.x},${d.y4}`} />
		);
	return wicks;
}

function getCandlesSVG(props, moreProps) {

	/* eslint-disable react/prop-types */
	const { opacity, candleStrokeWidth } = props;
	const { xScale, chartConfig: { yScale }, plotData, xAccessor } = moreProps;
	/* eslint-enable react/prop-types */

	const candleData = getCandleData(props, xAccessor, xScale, yScale, plotData);
	const candles = candleData.map((d, idx) => {
		if (d.width < 0)
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

	const wickData = getWickData(props, xAccessor, xScale, yScale, plotData);

	const wickNest = nest()
		.key(d => d.stroke)
		.entries(wickData);

	wickNest.forEach(outer => {
		const { key, values } = outer;
		ctx.strokeStyle = key;
		values.forEach(d => {
			ctx.beginPath();
			ctx.moveTo(d.x, d.y1);
			ctx.lineTo(d.x, d.y2);

			ctx.moveTo(d.x, d.y3);
			ctx.lineTo(d.x, d.y4);
			ctx.stroke();
		});
	});

	const candleData = getCandleData(props, xAccessor, xScale, yScale, plotData);

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
			ctx.fillStyle = hexToRGBA(key, opacity);

			values.forEach(d => {
				if (d.width < 0) {
					// <line className={d.className} key={idx} x1={d.x} y1={d.y} x2={d.x} y2={d.y + d.height}/>
					ctx.beginPath();
					ctx.moveTo(d.x, d.y);
					ctx.lineTo(d.x, d.y + d.height);
					ctx.stroke();
				} else if (d.height === 0) {
					// <line key={idx} x1={d.x} y1={d.y} x2={d.x + d.width} y2={d.y + d.height} />
					ctx.beginPath();
					ctx.moveTo(d.x, d.y);
					ctx.lineTo(d.x + d.width, d.y + d.height);
					ctx.stroke();
				} else {
					ctx.beginPath();
					ctx.rect(d.x, d.y, d.width, d.height);
					ctx.closePath();
					ctx.fill();
					if (strokeKey !== "none") ctx.stroke();
				}
			});
		});
	});
}

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

function getCandleData(props, xAccessor, xScale, yScale, plotData) {
	const { classNames, fill: fillProp, stroke: strokeProp, widthRatio, yAccessor } = props;
	const fill = functor(fillProp);
	const stroke = functor(strokeProp);
	// console.log(plotData);
	const width = xScale(xAccessor(last(plotData)))
		- xScale(xAccessor(first(plotData)));
	const cw = (width / (plotData.length - 1) * widthRatio);
	const candleWidth = Math.round(cw); // Math.floor(cw) % 2 === 0 ? Math.floor(cw) : Math.round(cw);

	const offset = (candleWidth === 1 ? 0 : 0.5 * cw);
	const candles = plotData
			.filter(d => isDefined(yAccessor(d).close))
			.map(d => {
				const ohlc = yAccessor(d);
				const x = Math.round(xScale(xAccessor(d)) - offset),
					y = yScale(Math.max(ohlc.open, ohlc.close)),
					height = Math.abs(yScale(ohlc.open) - yScale(ohlc.close)),
					className = (ohlc.open <= ohlc.close) ? classNames.up : classNames.down;
				return {
					// type: "line"
					x: x,
					y: y,
					height: height,
					width: candleWidth,
					className: className,
					fill: fill(ohlc),
					stroke: stroke(ohlc),
					direction: (ohlc.close - ohlc.open),
				};
			});
	return candles;
}

export default CandlestickSeries;
