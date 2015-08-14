"use strict";

var React = require("react");

var ReStock = require("src/");

var { ChartCanvas, AreaSeries, Chart, DataSeries } = ReStock;

var { XAxis, YAxis } = ReStock.axes;
var { ChartWidthMixin } = ReStock.helper;

var AreaChartWithYPercent = React.createClass({
	mixins: [ChartWidthMixin],
	propTypes: {
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	},
	render() {
		if (this.state === null || !this.state.width) return <div />;
		var { data, type } = this.props;
		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}}
				data={data} type={type}>
				<Chart id={0} >
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" />
					<YAxis axisAt="right" orient="right" percentScale={true} tickFormat={d3.format(".0%")}/>
					<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
						<AreaSeries />
					</DataSeries>
				</Chart>
			</ChartCanvas>
		);
	}
});


module.exports = AreaChartWithYPercent;
