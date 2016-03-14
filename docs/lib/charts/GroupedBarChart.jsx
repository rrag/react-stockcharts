"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { GroupedBarSeries  } = ReStock.series;

var { XAxis, YAxis } = ReStock.axes;
var { fitWidth } = ReStock.helper;

class GroupedBarChart extends React.Component {
	render() {
		var { data, type, width } = this.props;

		var f = d3.scale.category10()
			.domain(d3.set(data.map(d => d.region)));

		var fill = (d, i) => f(i);
		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 40, right: 10, top:20, bottom: 30}} type={type}
					seriesName="Fruits"
					xExtents={list => list.map(d => d.x)}
					data={data}
					xAccessor={d => d.x} xScale={d3.scale.ordinal()}
					padding={1}>
				<Chart id={1}
						yExtents={[0, d => [d.y1, d.y2, d.y3, d.y4]]}>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="left" orient="left" />
					<GroupedBarSeries yAccessor={[d => d.y1, d => d.y2, d => d.y3, d => d.y4]}
							fill={fill}
							spaceBetweenBar={3}/>
				</Chart>
			</ChartCanvas>
		);
	}
}

GroupedBarChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

GroupedBarChart.defaultProps = {
	type: "svg",
};
GroupedBarChart = fitWidth(GroupedBarChart);

export default GroupedBarChart;
