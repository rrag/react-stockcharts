'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('../../../src/styles/main.scss');
var ReStock = require('../../../src/scripts');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.XAxis
	, YAxis = ReStock.YAxis
	, CandlestickSeries = ReStock.CandlestickSeries
	, Translate = ReStock.Translate
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries;
;

var LineChart = React.createClass({
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
		var dateRange = { from: parseDate("2012-06-01"), to: parseDate("2012-12-31")}

		return (
<ChartCanvas  width={500} height={400} margin={{left: 50, right: 50, top:10, bottom: 30}}>
	<Chart data={this.state.data}>
		<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
		<YAxis axisAt="right" orient="right" percentScale={true} tickFormat={d3.format(".0%")}/>
		<YAxis axisAt="left" orient="left" />
		<DataSeries yAccessor={CandlestickSeries.yAccessor} xAccessor={(d) => d.date}>
			<CandlestickSeries />
		</DataSeries>
	</Chart>
</ChartCanvas>
		);
	}
});

module.exports = LineChart
