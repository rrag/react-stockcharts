'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('src/');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.axes.XAxis
	, YAxis = ReStock.axes.YAxis
	, CandlestickSeries = ReStock.CandlestickSeries
	, DataTransform = ReStock.DataTransform
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries
	, ChartWidthMixin = ReStock.helper.ChartWidthMixin;

var CandleStickStockScaleChart = React.createClass({
	mixins: [ChartWidthMixin],
	render() {
		if (this.state === null || !this.state.width) return <div />;
		var data = this.props.data.slice(0, 150);
		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}} data={data}>
				<DataTransform transformType="stockscale">
					<Chart id={1} >
						<XAxis axisAt="bottom" orient="bottom" />
						<YAxis axisAt="right" orient="right" ticks={5} />
						<DataSeries yAccessor={CandlestickSeries.yAccessor} >
							<CandlestickSeries />
						</DataSeries>
					</Chart>
				</DataTransform>
			</ChartCanvas>
		);
	}
});

module.exports = CandleStickStockScaleChart;

