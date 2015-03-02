'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('../../src/');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.XAxis
	, YAxis = ReStock.YAxis
	, CandlestickSeries = ReStock.CandlestickSeries
	, DataTransform = ReStock.DataTransform
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries;
;

module.exports = {
	init(data) {
		var CandleStickChart = React.createClass({
			render() {
				var parseDate = d3.time.format("%Y-%m-%d").parse
				var dateRange = { from: parseDate("2012-12-01"), to: parseDate("2012-12-31")}

				return (
					<ChartCanvas  width={500} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}}>
						<DataTransform data={data} polyLinear={true}
							viewRange={dateRange}>
							<Chart data={data}>
								<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
								<YAxis axisAt="right" axisPadding={10} orient="right" percentScale={true} tickFormat={d3.format(".0%")} ticks={3}/>
								<YAxis axisAt="left" orient="left" />
								<DataSeries yAccessor={CandlestickSeries.yAccessor}>
									<CandlestickSeries />
								</DataSeries>
							</Chart>
						</DataTransform>
					</ChartCanvas>
				);
			}
		});
		return CandleStickChart
	}
}
