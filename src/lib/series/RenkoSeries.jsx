"use strict";

import React from "react";
import BaseCanvasSeries from "./BaseCanvasSeries";

class RenkoSeries extends BaseCanvasSeries {
	getCanvasDraw() {
		return RenkoSeries.drawOnCanvasStatic;
	}
	render() {
		if (this.context.type !== "svg") return null;

		var { plotData, xScale, xAccessor, yScale, yAccessor } = this.context;

		var candles = RenkoSeries.getRenko(this.props, plotData, xScale, xAccessor, yScale, yAccessor).map((each, idx) => (<rect key={idx} className={each.className}
								fill={each.fill}
								x={each.x}
								y={each.y}
								width={each.width}
								height={each.height} />));

		return (
			<g>
				<g className="candle">
					{candles}
				</g>
			</g>
		);
	}
}

RenkoSeries.propTypes = {
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

RenkoSeries.defaultProps = {
	namespace: "ReStock.RenkoSeries",
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

RenkoSeries.yAccessor = (d) => ({open: d.open, high: d.high, low: d.low, close: d.close});

RenkoSeries.drawOnCanvasStatic = (props, height, width, compareSeries, indicator, xAccessor, yAccessor, ctx, xScale, yScale, plotData) => {
	RenkoSeries.getRenko(props, plotData, xScale, xAccessor, yScale, yAccessor).forEach(d => {
		ctx.beginPath();
		ctx.fillStyle = d.fill;
		ctx.strokeStyle = d.stroke;
		ctx.rect(d.x, d.y, d.width, d.height);
		ctx.closePath();
		ctx.fill();
	});
};

RenkoSeries.getRenko = (props, plotData, xScale, xAccessor, yScale, yAccessor) => {
	var { classNames, fill } = props;
	var width = xScale(xAccessor(plotData[plotData.length - 1]))
		- xScale(xAccessor(plotData[0]));

	var candleWidth = (width / (plotData.length - 1));

	var candles = plotData
			.filter((d) => d.close !== undefined)
			.map((d, idx) => {
				var ohlc = yAccessor(d);
				var x = xScale(xAccessor(d)) - 0.5 * candleWidth,
					y = yScale(Math.max(ohlc.open, ohlc.close)),
					height = Math.abs(yScale(ohlc.open) - yScale(ohlc.close)),
					className = (ohlc.open <= ohlc.close) ? classNames.up : classNames.down,
					svgfill = (ohlc.open <= ohlc.close) ? fill.up : fill.down;

				return {
					className: className,
					fill: svgfill,
					x: x,
					y: y,
					height: height,
					width: candleWidth,
				};
			});
	return candles;
};

module.exports = RenkoSeries;
