'use strict';
var React = require('react'),
	d3 = require('d3'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin');


var RenkoSeries = React.createClass({
	mixins: [PureRenderMixin],
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired,
		data: React.PropTypes.array.isRequired
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
		console.log(this.props.data[idx]);
	},
	render() {
		var width = this.props._xScale(this.props._xAccessor(this.props.data[this.props.data.length - 1]))
			- this.props._xScale(this.props._xAccessor(this.props.data[0]));

		var candleWidth = (width / (this.props.data.length - 1));

		var candles = this.props.data
				.filter(function (d) { return d.close !== undefined; })
				.map((d, idx) => {
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
				});
		var wicks = this.props.data
				.filter(function (d) { return d.close !== undefined; })
				.map((d, idx) => {
					var ohlc = this.props._yAccessor(d);

					var x1 = this.props._xScale(this.props._xAccessor(d)),
						y1 = this.props._yScale(ohlc.high),
						x2 = x1,
						y2 = this.props._yScale(ohlc.low),
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