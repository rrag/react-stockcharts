"use strict";

import React from "react";

class RenkoSeries extends React.Component {
	render() {
		var { classNames, fill } = this.props;
		var width = this.context.xScale(this.context.xAccessor(this.context.plotData[this.context.plotData.length - 1]))
			- this.context.xScale(this.context.xAccessor(this.context.plotData[0]));

		var candleWidth = (width / (this.context.plotData.length - 1));

		var candles = this.context.plotData
				.filter((d) => d.close !== undefined)
				.map((d, idx) => {
					var ohlc = this.context.yAccessor(d);
					var x = this.context.xScale(this.context.xAccessor(d)) - 0.5 * candleWidth,
						y = this.context.yScale(Math.max(ohlc.open, ohlc.close)),
						height = Math.abs(this.context.yScale(ohlc.open) - this.context.yScale(ohlc.close)),
						className = (ohlc.open <= ohlc.close) ? classNames.up : classNames.down,
						svgfill = (ohlc.open <= ohlc.close) ? fill.up : fill.down;

					return <rect key={idx} className={className}
								fill={svgfill}
								x={x}
								y={y}
								width={candleWidth}
								height={height} />;
				});

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

RenkoSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
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

module.exports = RenkoSeries;
