"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { StackedBarSeries  } = ReStock.series;

var { XAxis, YAxis } = ReStock.axes;
var { fitWidth } = ReStock.helper;

class HorizontalStackedBarChart extends React.Component {
	render() {
		var { data, type, width } = this.props;

		var f = d3.scale.category10()
			.domain(d3.set(data.map(d => d.region)));

		var fill = (d, i) => f(i);
		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 90, right: 10, top:20, bottom: 30}} type={type}
					seriesName="Fruits"
					xExtents={data => [0, d3.max(data, d => d.x1 + d.x2 + d.x3 + d.x4)]}
					data={data}
					xScale={d3.scale.linear()} flipXScale={false}>
				<Chart id={1}
						yExtents={data.map(d => d.y)}
						yScale={d3.scale.ordinal()}
						padding={1}>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="left" orient="left" />
					<StackedBarSeries
						yAccessor={d => d.y}
						xAccessor={[d => d.x1, d => d.x2, d => d.x3, d => d.x4]}
						fill={fill}
						swapScales />
				</Chart>
			</ChartCanvas>
		);
	}
}

HorizontalStackedBarChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

HorizontalStackedBarChart.defaultProps = {
	type: "svg",
};
HorizontalStackedBarChart = fitWidth(HorizontalStackedBarChart);

export default HorizontalStackedBarChart;
