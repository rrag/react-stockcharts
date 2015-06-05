'use strict';
var React = require('react'),
	d3 = require('d3');

class RenkoSeries extends React.Component {
	render() {
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
						className = (ohlc.open <= ohlc.close) ? 'up' : 'down';

					return <rect key={idx} className={className}
								x={x}
								y={y}
								width={candleWidth}
								height={height} />
				});
		var wicks = this.context.plotData
				.filter((d) => d.close !== undefined)
				.map((d, idx) => {
					var ohlc = this.context.yAccessor(d);

					var x1 = this.context.xScale(this.context.xAccessor(d)),
						y1 = this.context.yScale(ohlc.high),
						x2 = x1,
						y2 = this.context.yScale(ohlc.low),
						className = (ohlc.open >= ohlc.close) ? 'up' : 'down';

					return <line key={idx}
									className={className}
									x1={x1}
									y1={y1}
									x2={x2}
									y2={y2} />
				});
		return (
			<g>
				<g className="candle">
					{candles}
				</g>

			</g>
		);
	}
};

RenkoSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
}

RenkoSeries.defaultProps = { namespace: "ReStock.RenkoSeries" };

RenkoSeries.yAccessor = (d) => ({open: d.open, high: d.high, low: d.low, close: d.close});

module.exports = RenkoSeries;
