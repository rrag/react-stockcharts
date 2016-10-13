"use strict";

import { scaleOrdinal, schemeCategory10, scaleLinear, scalePoint } from  "d3-scale";
import { set } from "d3-collection";
import { max } from "d3-array";

import React from "react";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from "react-stockcharts";

var { StackedBarSeries  } = series;

var { XAxis, YAxis } = axes;
var { fitWidth } = helper;

class HorizontalStackedBarChart extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;

		var f = scaleOrdinal(schemeCategory10)
			.domain(set(data.map(d => d.region)));

		var fill = (d, i) => f(i);
		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
					margin={{ left: 90, right: 10, top: 20, bottom: 30 }} type={type}
					seriesName="Fruits"
					xExtents={data => [0, max(data, d => d.x1 + d.x2 + d.x3 + d.x4)]}
					data={data}
					xScale={scaleLinear()} flipXScale={false}>
				<Chart id={1}
						yExtents={data.map(d => d.y)}
						yScale={scalePoint()}
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
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

HorizontalStackedBarChart.defaultProps = {
	type: "svg",
};
HorizontalStackedBarChart = fitWidth(HorizontalStackedBarChart);

export default HorizontalStackedBarChart;
