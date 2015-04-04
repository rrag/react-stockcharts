'use strict';
var React = require('react'),
	d3 = require('d3'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin');


var CandlestickSeries = React.createClass({displayName: "CandlestickSeries",
	mixins: [PureRenderMixin],
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired
	},
	statics: {
		yAccessor: function(d)  {return {open: d.open, high: d.high, low: d.low, close: d.close};}
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.CandlestickSeries"
		}
	},
	getWicks:function() {
		var wicks = this.props.data
				.filter(function (d) { return d.close !== undefined; })
				.map(function(d, idx) {
					var ohlc = this.props._yAccessor(d);

					var x1 = Math.round(this.props._xScale(this.props._xAccessor(d))),
						y1 = this.props._yScale(ohlc.high),
						x2 = x1,
						y2 = this.props._yScale(ohlc.low),
						className = (ohlc.open >= ohlc.close) ? 'up' : 'down';
					var path = 'M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2;
					//return <path key={idx} d={path} className={className} />
					/* */
					return React.createElement("line", {key: idx, 
									className: className, 
									x1: x1, 
									y1: y1, 
									x2: x2, 
									y2: y2})
				}, this);
		return wicks;
	},
	getCandles:function() {
		var width = this.props._xScale(this.props._xAccessor(this.props.data[this.props.data.length - 1]))
			- this.props._xScale(this.props._xAccessor(this.props.data[0]));
		var cw = (width / (this.props.data.length)) * 0.5;
		var candleWidth = Math.floor(cw) % 2 === 0 ? Math.floor(cw) : Math.round(cw); // 
		var candles = this.props.data
				.filter(function (d) { return d.close !== undefined; })
				.map(function(d, idx) {
					var ohlc = this.props._yAccessor(d);
					var x = Math.round(this.props._xScale(this.props._xAccessor(d)))
							- (candleWidth === 1 ? 0 : 0.5 * candleWidth),
						y = this.props._yScale(Math.max(ohlc.open, ohlc.close)),
						height = Math.abs(this.props._yScale(ohlc.open) - this.props._yScale(ohlc.close)),
						className = (ohlc.open <= ohlc.close) ? 'up' : 'down';
					if (ohlc.open === ohlc.close) {
						return React.createElement("line", {key: idx, x1: x, y1: y, x2: x + candleWidth, y2: y})
					}
					if (candleWidth <= 1) {
						return React.createElement("line", {className: className, key: idx, x1: x, y1: y, x2: x, y2: y + height})
					}
					return React.createElement("rect", {key: idx, className: className, 
								x: x, 
								y: y, 
								width: candleWidth, 
								height: height})
				}, this);
		return candles;
	},
	render:function() {
		return (
			React.createElement("g", null, 
				React.createElement("g", {className: "wick", key: "wicks"}, 
					this.getWicks()
				), 
				React.createElement("g", {className: "candle", key: "candles"}, 
					this.getCandles()
				)
			)
		);
	}
});

module.exports = CandlestickSeries;

/*				

*/