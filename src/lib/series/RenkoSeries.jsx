"use strict";

import React, { PropTypes, Component } from "react";
import wrap from "./wrap";

import { isDefined } from "../utils";

class RenkoSeries extends Component {
	render() {
		var { props } = this;
		var { plotData, xScale, xAccessor, yScale, yAccessor } = props;

		var candles = RenkoSeries.getRenko(props, plotData, xScale, xAccessor, yScale, yAccessor)
			.map((each, idx) => (<rect key={idx} className={each.className}
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
	classNames: PropTypes.shape({
		up: PropTypes.string,
		down: PropTypes.string
	}),
	stroke: PropTypes.shape({
		up: PropTypes.string,
		down: PropTypes.string
	}),
	fill: PropTypes.shape({
		up: PropTypes.string,
		down: PropTypes.string
	}),
};

RenkoSeries.defaultProps = {
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
		down: "#E60000",
		partial: "#4682B4",
	},
	yAccessor: d => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
};

RenkoSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor } = props;

	var renko = RenkoSeries.getRenko(props, plotData, xScale, xAccessor, yScale, yAccessor);
	renko.forEach(d => {
		ctx.beginPath();

		ctx.strokeStyle = d.stroke;
		ctx.fillStyle = d.fill;

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
			.filter(d => isDefined(d.close))
			.map(d => {
				var ohlc = yAccessor(d);
				var x = xScale(xAccessor(d)) - 0.5 * candleWidth,
					y = yScale(Math.max(ohlc.open, ohlc.close)),
					height = Math.abs(yScale(ohlc.open) - yScale(ohlc.close)),
					className = (ohlc.open <= ohlc.close) ? classNames.up : classNames.down,
					svgfill = (ohlc.open <= ohlc.close) ? fill.up : fill.down;

				if (!d.fullyFormed) {
					svgfill = fill.partial;
				}
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

export default wrap(RenkoSeries);
