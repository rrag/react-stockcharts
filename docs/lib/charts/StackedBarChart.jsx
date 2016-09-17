"use strict";

import React from "react";

import { set } from "d3-collection";
import { scaleOrdinal, schemeCategory10, scalePoint } from  "d3-scale";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from "react-stockcharts";

var { StackedBarSeries  } = series;

var { XAxis, YAxis } = axes;
var { fitWidth } = helper;

class StackedBarChart extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;

		var f = scaleOrdinal(schemeCategory10)
			.domain(set(data.map(d => d.region)));

		var fill = (d, i) => f(i);
		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
					margin={{ left: 40, right: 10, top: 20, bottom: 30 }} type={type}
					seriesName="Fruits"
					xExtents={list => list.map(d => d.x)}
					data={data}
					xAccessor={d => d.x} xScale={scalePoint()}
					padding={1}>
				<Chart id={1}
						yExtents={[0, d => d.y1 + d.y2 + d.y3 + d.y4]}>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="left" orient="left" />
					<StackedBarSeries yAccessor={[d => d.y1, d => d.y2, d => d.y3, d => d.y4]}
							fill={fill} />
				</Chart>
			</ChartCanvas>
		);
	}
}

StackedBarChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

StackedBarChart.defaultProps = {
	type: "svg",
};
StackedBarChart = fitWidth(StackedBarChart);

export default StackedBarChart;
