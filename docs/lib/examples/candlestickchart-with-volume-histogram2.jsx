'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('src/');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.XAxis
	, YAxis = ReStock.YAxis
	, CandlestickSeries = ReStock.CandlestickSeries
	, DataTransform = ReStock.DataTransform
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries
	, ChartWidthMixin = require('./mixin/chart-width-mixin')
	, InitialStateMixin = require('./mixin/initial-state-mixin')
	, HistogramSeries = ReStock.HistogramSeries
;

module.exports = {
	init(data) {
		var CandleStickChart = React.createClass({
			mixins: [InitialStateMixin, ChartWidthMixin],
			render() {
				if (!this.state.width) return <div />;

				var parseDate = d3.time.format("%Y-%m-%d").parse
				var dateRange = { from: parseDate("2012-12-01"), to: parseDate("2012-12-31")}

				return (
					<ChartCanvas width={this.state.width} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}} data={data}>
						<DataTransform transformType="stockscale">
							<Chart id={1} >
								<XAxis axisAt="bottom" orient="bottom"/>
								<YAxis axisAt="right" orient="right" ticks={5} />
								<DataSeries yAccessor={CandlestickSeries.yAccessor} >
									<CandlestickSeries />
								</DataSeries>
							</Chart>
							<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
								<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
								<DataSeries yAccessor={(d) => d.volume} >
									<HistogramSeries />
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


/*
 xScaleDependsOn={1}
							<Chart id={1} >
								<XAxis axisAt="bottom" orient="bottom" ticks={5}/>
								<YAxis axisAt="right" orient="right" ticks={5} />
								<DataSeries yAccessor={CandlestickSeries.yAccessor} >
									<CandlestickSeries />
								</DataSeries>
							</Chart>

*/