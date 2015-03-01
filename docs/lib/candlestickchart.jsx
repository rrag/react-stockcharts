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

var CandleStickChart = React.createClass({
	getInitialState() {
		return {};
	},
	componentWillMount() {
		var parseDate = d3.time.format("%Y-%m-%d").parse
		d3.tsv("data/data.tsv", function(err, data) {
			data.forEach((d, i) => {
				d.date = new Date(parseDate(d.date).getTime());
				d.open = +d.open;
				d.high = +d.high;
				d.low = +d.low;
				d.close = +d.close;
				d.volume = +d.volume;
				// console.log(d);
			});
			this.setState({ data : data });
		}.bind(this));
	},
	//mixins: [ReStock.ChartScalesMixin],
	render() {
		if (this.state.data === undefined) return null;
		var parseDate = d3.time.format("%Y-%m-%d").parse
		var dateRange = { from: parseDate("2012-12-01"), to: parseDate("2012-12-31")}

		return (
<ChartCanvas  width={500} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}}>
	<DataTransform data={this.state.data} polyLinear={true}
		viewRange={dateRange}>
		<Chart data={this.state.data}>
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

module.exports = CandleStickChart
