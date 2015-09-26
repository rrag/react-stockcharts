"use strict";

import React from "react";

import wrap from "./wrap";

const CandlestickSeries = (props) => 
	<g className="react-stockcharts-candlestick">
		<g className="react-stockcharts-candlestick-wick" key="wicks">
			{CandlestickSeries.getWicksSVG(props)}
		</g>
		<g className="react-stockcharts-candlestick-candle" key="candles">
			{CandlestickSeries.getCandlesSVG(props)}
		</g>
	</g>;

CandlestickSeries.propTypes = {
	classNames: React.PropTypes.shape({
		up: React.PropTypes.string,
		down: React.PropTypes.string
	}),
	stroke: React.PropTypes.shape({
		up: React.PropTypes.string,
		down: React.PropTypes.string
	}),
	fill: React.PropTypes.shape({
		up: React.PropTypes.string,
		down: React.PropTypes.string
	}),
};

CandlestickSeries.defaultProps = {
	classNames: {
		up: "up",
		down: "down"
	},
	stroke: {
		up: "none",
		down: "none"
	},
	fill: {
		up: "#6BA583",
		down: "red"
	},
};

CandlestickSeries.getWicksSVG = (props) => {
	var { xAccessor, yAccessor, xScale, yScale, compareSeries, plotData } = props;

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

CandlestickSeries.yAccessor = (d) => ({open: d.open, high: d.high, low: d.low, close: d.close});

CandlestickSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { compareSeries, xAccessor, yAccessor } = props;
	var { stroke, fill } = props;
	var wickData = CandlestickSeries.getWickData(props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData);
	wickData.forEach(d => {
		ctx.beginPath();
		ctx.moveTo(d.x1, d.y1);
		ctx.lineTo(d.x2, d.y2);
		ctx.stroke();
	});
	var candleData = CandlestickSeries.getCandleData(props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData);

	var each, group = { up: [], down: [] };
	for (var i = 0; i < candleData.length; i++) {
		each = candleData[i];
		if (each.direction >= 0) {
			group.up.push(each);
		} else {
			group.down.push(each);
		}
	};

	ctx.fillStyle = fill.up;
	group.up.forEach(d => {
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
	});

	ctx.fillStyle = fill.down;
	group.down.forEach(d => {
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
	});
	// ctx.fillStyle = fillStyle;
};

CandlestickSeries.getWickData = (props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData) => {
	var isCompareSeries = compareSeries.length > 0;

	var { classNames } = props;
	var wickData = plotData
			.filter((d) => d.close !== undefined)
			.map((d, idx) => {
				// console.log(yAccessor);
				var ohlc = isCompareSeries ? yAccessor(d.compare) : yAccessor(d);

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
					stroke: "black",
				};
			});
	return wickData;
};

CandlestickSeries.getCandleData = (props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData) => {
	var isCompareSeries = compareSeries.length > 0;

	var { classNames, fill, stroke } = props;

	var width = xScale(xAccessor(plotData[plotData.length - 1]))
		- xScale(xAccessor(plotData[0]));
	var cw = (width / (plotData.length)) * 0.5;
	var candleWidth = Math.round(cw); // Math.floor(cw) % 2 === 0 ? Math.floor(cw) : Math.round(cw);
	var candles = plotData
			.filter((d) => d.close !== undefined)
			.map((d, idx) => {
				var ohlc = isCompareSeries ? yAccessor(d.compare) : yAccessor(d);
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
