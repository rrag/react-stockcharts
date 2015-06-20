'use strict';
var React = require('react'),
	d3 = require('d3');

class CandlestickSeries extends React.Component {
	constructor(props) {
		super(props);
		this.getWicks = this.getWicks.bind(this);
		this.getCandles = this.getCandles.bind(this);
	}
	getWicks() {
		var wicks = this.context.plotData
				.filter((d) => d.close !== undefined)
				.map((d, idx) => {
					var ohlc = this.context.isCompareSeries ? this.context.yAccessor(d.compare) : this.context.yAccessor(d);

					var x1 = Math.round(this.context.xScale(this.context.xAccessor(d))),
						y1 = this.context.yScale(ohlc.high),
						x2 = x1,
						y2 = this.context.yScale(ohlc.low),
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
	}
	getCandles() {
		var width = this.context.xScale(this.context.xAccessor(this.context.plotData[this.context.plotData.length - 1]))
			- this.context.xScale(this.context.xAccessor(this.context.plotData[0]));
		var cw = (width / (this.context.plotData.length)) * 0.5;
		var candleWidth = Math.floor(cw) % 2 === 0 ? Math.floor(cw) : Math.round(cw); // 
		var candles = this.context.plotData
				.filter((d) => d.close !== undefined)
				.map((d, idx) => {
					var ohlc = this.context.isCompareSeries ? this.context.yAccessor(d.compare) : this.context.yAccessor(d);
					var x = Math.round(this.context.xScale(this.context.xAccessor(d)))
							- (candleWidth === 1 ? 0 : 0.5 * candleWidth),
						y = this.context.yScale(Math.max(ohlc.open, ohlc.close)),
						height = Math.abs(this.context.yScale(ohlc.open) - this.context.yScale(ohlc.close)),
						className = (ohlc.open <= ohlc.close) ? 'up' : 'down';
					if (ohlc.open === ohlc.close) {
						return <line key={idx} x1={x} y1={y} x2={x + candleWidth} y2={y} />
					}
					if (candleWidth <= 1) {
						return <line  className={className} key={idx} x1={x} y1={y} x2={x} y2={y + height} />
					}
					return <rect key={idx} className={className}
								x={x}
								y={y}
								width={candleWidth}
								height={height} />
				});
		return candles;
	}
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
};

CandlestickSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	isCompareSeries: React.PropTypes.bool.isRequired,
}

CandlestickSeries.defaultProps = { namespace: "ReStock.CandlestickSeries" };

CandlestickSeries.yAccessor = (d) => ({open: d.open, high: d.high, low: d.low, close: d.close});

module.exports = CandlestickSeries;
