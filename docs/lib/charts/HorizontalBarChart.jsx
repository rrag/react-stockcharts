"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { BarSeries } = ReStock.series;

var { XAxis, YAxis } = ReStock.axes;
var { fitWidth } = ReStock.helper;

class HorizontalBarChart extends React.Component {
	render() {
		var { data, type, width } = this.props;

		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 90, right: 10, top:20, bottom: 30}} type={type}
					seriesName="Fruits"
					xExtents={data => [0, d3.max(data, d => d.x)]}
					data={data}
					xScale={d3.scale.linear()} flipXScale={false}>
				<Chart id={1}
						yExtents={data.map(d => d.y)}
						yScale={d3.scale.ordinal()}
						padding={1}>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="left" orient="left" />
					<BarSeries yAccessor={d => d.y} xAccessor={d => d.x} swapScales />
				</Chart>
			</ChartCanvas>
		);
	}
}

HorizontalBarChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

HorizontalBarChart.defaultProps = {
	type: "svg",
};
HorizontalBarChart = fitWidth(HorizontalBarChart);

export default HorizontalBarChart;
