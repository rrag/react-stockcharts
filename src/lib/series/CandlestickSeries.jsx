"use strict";

import React from "react";
import last from "lodash.last";
import first from "lodash.first";

import wrap from "./wrap";
import { hexToRGBA } from "../utils/utils";

class CandlestickSeries extends React.Component {
	render() {
		var { className, wickClassName, candleClassName } = this.props;
		return <g className={className}>
			<g className={wickClassName} key="wicks">
				{CandlestickSeries.getWicksSVG(this.props)}
			</g>
			<g className={candleClassName} key="candles">
				{CandlestickSeries.getCandlesSVG(this.props)}
			</g>
		</g>;
	}
}

CandlestickSeries.propTypes = {
	className: React.PropTypes.string,
	wickClassName: React.PropTypes.string,
	candleClassName: React.PropTypes.string,
	classNames: React.PropTypes.shape({
		up: React.PropTypes.string,
		down: React.PropTypes.string
	}),
	widthRatio: React.PropTypes.number.isRequired,
	stroke: React.PropTypes.shape({
		up: React.PropTypes.string,
		down: React.PropTypes.string
	}),
	fill: React.PropTypes.shape({
		up: React.PropTypes.string,
		down: React.PropTypes.string
	}),
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func.isRequired,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	compareSeries: React.PropTypes.array,
	plotData: React.PropTypes.array,
};

CandlestickSeries.defaultProps = {
	className: "react-stockcharts-candlestick",
	wickClassName: "react-stockcharts-candlestick-wick",
	candleClassName: "react-stockcharts-candlestick-candle",
	yAccessor: d => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
	classNames: {
		up: "up",
		down: "down"
	},
	widthRatio: 0.5,
	stroke: {
		up: "none",
		down: "none"
	},
	wickStroke: {
		up: "#000000", // "#6BA583"
		down: "#000000" // "red"
	},
	fill: {
		up: "#6BA583",
		down: "#FF0000"
	},
	opacity: 1,
};

CandlestickSeries.getWicksSVG = (props) => {

	/* eslint-disable react/prop-types */
	var { xAccessor, yAccessor, xScale, yScale, compareSeries, plotData } = props;
	/* eslint-disable react/prop-types */


	var wickData = CandlestickSeries.getWickData(props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData);
	var wicks = wickData
		.map((d, idx) => <line key={idx}
			className={d.className} stroke={d.stroke} style={{ shapeRendering: "crispEdges" }}
			x1={d.x1} y1={d.y1}
			x2={d.x2} y2={d.y2} />
		);
	return wicks;
};
CandlestickSeries.getCandlesSVG = (props) => {

	var { xAccessor, yAccessor, xScale, yScale, compareSeries, plotData } = props;

	var candleData = CandlestickSeries.getCandleData(props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData);
	var candles = candleData.map((d, idx) => {
		if (d.width < 0) return <line className={d.className} key={idx} x1={d.x} y1={d.y} x2={d.x} y2={d.y + d.height} stroke={d.fill} />;
		else if (d.height === 0) return <line key={idx} x1={d.x} y1={d.y} x2={d.x + d.width} y2={d.y + d.height} stroke={d.fill} />;
		return <rect  className={d.className} key={idx} x={d.x} y={d.y} width={d.width} height={d.height} fill={d.fill} stroke={d.stroke} />;
	});
	return candles;
};

CandlestickSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { compareSeries, xAccessor, yAccessor } = props;
	var { wickStroke, fill, opacity } = props;
	var wickData = CandlestickSeries.getWickData(props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData);

	var wickNest = d3.nest()
		.key(d => d.stroke)
		.entries(wickData);

	wickNest.forEach(outer => {
		var { key, values } = outer;
		ctx.strokeStyle = key;
		values.forEach(d => {
			ctx.beginPath();
			ctx.moveTo(d.x1, d.y1);
			ctx.lineTo(d.x2, d.y2);
			ctx.stroke();
		})
	});

	var candleData = CandlestickSeries.getCandleData(props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData);

	var candleNest = d3.nest()
		.key(d => d.fill)
		.entries(candleData);

	candleNest.forEach(outer => {
		var { key, values } = outer;
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
			}
		})
	});
};

CandlestickSeries.getWickData = (props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData) => {
	// var isCompareSeries = false; // compareSeries.length > 0;

	var { classNames, wickStroke } = props;
	var wickData = plotData
			.filter((d) => d.close !== undefined)
			.map((d) => {
				// console.log(yAccessor);
				var ohlc = yAccessor(d);

				var x1 = Math.round(xScale(xAccessor(d))),
					y1 = yScale(ohlc.high),
					x2 = x1,
					y2 = yScale(ohlc.low),
					className = (ohlc.open <= ohlc.close) ? classNames.up : classNames.down;

				return {
					x1: x1,
					y1: y1,
					x2: x2,
					y2: y2,
					className: className,
					direction: (ohlc.close - ohlc.open),
					stroke: (ohlc.open <= ohlc.close) ? wickStroke.up : wickStroke.down,
				};
			});
	return wickData;
};

CandlestickSeries.getCandleData = (props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData) => {
	// var isCompareSeries = false; // compareSeries.length > 0;

	var { classNames, fill, stroke, widthRatio } = props;

	// console.log(plotData);
	var width = xScale(xAccessor(last(plotData)))
		- xScale(xAccessor(first(plotData)));
	var cw = (width / (plotData.length - 1)) * widthRatio;
	var candleWidth = Math.round(cw); // Math.floor(cw) % 2 === 0 ? Math.floor(cw) : Math.round(cw);
	var candles = plotData
			.filter((d) => d.close !== undefined)
			.map((d) => {
				var ohlc = yAccessor(d);
				var x = Math.round(xScale(xAccessor(d)))
						- (candleWidth === 1 ? 0 : 0.5 * candleWidth),
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
					fill: (ohlc.open <= ohlc.close) ? fill.up : fill.down,
					stroke: (ohlc.open <= ohlc.close) ? stroke.up : stroke.down,
					direction: (ohlc.close - ohlc.open),
				};
			});
	return candles;
};

export default wrap(CandlestickSeries);
