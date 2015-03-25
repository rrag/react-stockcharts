'use strict';
var React = require('react'),
	d3 = require('d3'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin');


var CandlestickSeries = React.createClass({
	mixins: [PureRenderMixin],
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired
	},
	statics: {
		yAccessor: (d) => ({open: d.open, high: d.high, low: d.low, close: d.close})
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.CandlestickSeries"
		}
	},
	getWicks() {
		var wicks = this.props.data
				.filter(function (d) { return d.close !== undefined; })
				.map(function(d, idx) {
					var ohlc = this.props._yAccessor(d);

					var x1 = this.props._xScale(this.props._xAccessor(d)),
						y1 = this.props._yScale(ohlc.high),
						x2 = x1,
						y2 = this.props._yScale(ohlc.low),
						className = (ohlc.open >= ohlc.close) ? 'up' : 'down';
					var path = 'M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2;
					//return <path key={idx} d={path} className={className} />
					/* */
					return <line key={idx}
									className={className}
									x1={x1}
									y1={y1}
									x2={x2}
									y2={y2} />
				}, this);
		return wicks;
	},
	getCandles() {
		var width = Math.abs(this.props._xScale.range()[0] - this.props._xScale.range()[1]);
		var candleWidth = (width / (this.props.data.length)) * 0.5;
		var candles = this.props.data
				.filter(function (d) { return d.close !== undefined; })
				.map(function(d, idx) {
					var ohlc = this.props._yAccessor(d);
					var x = this.props._xScale(this.props._xAccessor(d)) - 0.5 * candleWidth,
						y = this.props._yScale(Math.max(ohlc.open, ohlc.close)),
						height = Math.abs(this.props._yScale(ohlc.open) - this.props._yScale(ohlc.close)),
						className = (ohlc.open <= ohlc.close) ? 'up' : 'down';

					return <rect key={idx} className={className}
								x={x}
								y={y}
								width={candleWidth}
								height={height} />
				}, this);
		return candles;
	},
	render() {
		return (
			<g>
				<g className="wick" key="wicks">
					{this.getWicks()}
				</g>
				<g className="candle" key="candles">
					{this.getCandles()}
				</g>
			</g>
		);
	}
});

module.exports = CandlestickSeries;

/*				

*/