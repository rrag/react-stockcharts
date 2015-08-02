'use strict';

var React = require('react');
var ReStock = require('src/');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.axes.XAxis
	, YAxis = ReStock.axes.YAxis
	, AreaSeries = ReStock.AreaSeries
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries
	, ChartWidthMixin = ReStock.helper.ChartWidthMixin;

var AreaChart = React.createClass({
	mixins: [ChartWidthMixin],
	render() {
		if (this.state === null || !this.state.width) return <div />;
		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}} data={this.props.data}>
				<Chart id={0} >
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" />
					<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
						<AreaSeries />
					</DataSeries>
				</Chart>
			</ChartCanvas>
		);
	}
});

module.exports = AreaChart;