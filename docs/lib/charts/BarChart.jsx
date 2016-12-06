"use strict";

import { scalePoint } from  "d3-scale";
import React from "react";

import { ChartCanvas, Chart, series, axes, helper } from "react-stockcharts";

var { BarSeries  } = series;

var { XAxis, YAxis } = axes;
var { fitWidth } = helper;

class BarChart extends React.Component {
	render() {
		var { data: unsortedData, type, width, ratio } = this.props;

		var data = unsortedData.slice().sort((a, b) => a.income - b.income);

		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
					margin={{ left: 80, right: 10, top: 20, bottom: 30 }} type={type}
					seriesName="Fruits"
					xExtents={list => list.map(d => d.x)}
					data={data}
					xAccessor={d => d.x} xScale={scalePoint()}
					padding={1}>
				<Chart id={1}
						yExtents={d => [0, d.y]}>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="left" orient="left" />
					<BarSeries yAccessor={d => d.y} />
				</Chart>
			</ChartCanvas>

		);
	}
}

BarChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

BarChart.defaultProps = {
	type: "svg",
};

BarChart = fitWidth(BarChart);

export default BarChart;
