'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('../../src/');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.XAxis
	, YAxis = ReStock.YAxis
	, LineSeries = ReStock.LineSeries
	, Translate = ReStock.Translate
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries;
;

module.exports = {
	init(data) {
		var LineChart = React.createClass({
			render() {
				return (
					<ChartCanvas  width={500} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}}>
						<Chart data={data}>
							<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
							<YAxis axisAt="right" orient="right" percentScale={true} tickFormat={d3.format(".0%")}/>
							<YAxis axisAt="left" orient="left" />
							<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
								<LineSeries />
							</DataSeries>
						</Chart>
					</ChartCanvas>
				);
			}
		});
		return LineChart
	}
}
