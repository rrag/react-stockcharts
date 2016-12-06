"use strict";

import React from "react";
import { scaleTime } from "d3-scale";

import { ChartCanvas, Chart, series, axes, helper } from "react-stockcharts";

var { AreaSeries } = series;
var { XAxis, YAxis } = axes;
var { fitWidth } = helper;

class AreaChart extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;
		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
					margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
					seriesName="MSFT"
					data={data} type={type}
					xAccessor={d => d.date} xScale={scaleTime()}
					xExtents={[new Date(2011, 0, 1), new Date(2013, 0, 2)]}>
				<Chart id={0} yExtents={d => d.close}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" />
					<AreaSeries yAccessor={(d) => d.close}/>
				</Chart>
			</ChartCanvas>
		);
	}
}

/*

*/

AreaChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChart.defaultProps = {
	type: "svg",
};
AreaChart = fitWidth(AreaChart);

export default AreaChart;