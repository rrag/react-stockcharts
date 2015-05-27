'use strict';
var React = require('react'),
	d3 = require('d3');

var RenkoSeries = React.createClass({
	contextTypes: {
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		xAccessor: React.PropTypes.func.isRequired,
		yAccessor: React.PropTypes.func.isRequired,
		_data: React.PropTypes.array.isRequired,
	},
	statics: {
		yAccessor: (d) => ({open: d.open, high: d.high, low: d.low, close: d.close})
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.RenkoSeries"
		}
	},
	handleClick(idx) {
		console.log(this.context._data[idx]);
	},
	render() {
		var width = this.context.xScale(this.context.xAccessor(this.context._data[this.context._data.length - 1]))
			- this.context.xScale(this.context.xAccessor(this.context._data[0]));

		var candleWidth = (width / (this.context._data.length - 1));

		var candles = this.context._data
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
		var wicks = this.context._data
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
});

module.exports = RenkoSeries;
/*
				<g className="wick">
					{wicks}
				</g>
*/