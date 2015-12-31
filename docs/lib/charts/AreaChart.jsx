"use strict";

import React from "react";
import * as ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries } = ReStock;

var { AreaSeries } = ReStock.series;
var { XAxis, YAxis } = ReStock.axes;
var { fitWidth } = ReStock.helper;

class AreaChart extends React.Component {
	render() {
		var { data, type, width } = this.props;
		return (
			<ChartCanvas width={width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}}
				data={data} type={type}>
				<Chart id={0} xAccessor={(d) => d.date}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" />
					<DataSeries id={0} yAccessor={(d) => d.close} >
						<AreaSeries />
					</DataSeries>
				</Chart>
			</ChartCanvas>
		);
	}
}

AreaChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChart.defaultProps = {
	type: "svg",
};
AreaChart = fitWidth(AreaChart);

export default AreaChart;