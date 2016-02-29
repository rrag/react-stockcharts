"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { GroupedBarSeries  } = ReStock.series;
var { financeEODDiscontiniousScale } = ReStock.scale;

var { MouseCoordinates } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { fitWidth } = ReStock.helper;

var xScale = financeEODDiscontiniousScale();


class GroupedBarChart extends React.Component {
	render() {
		var { data: unsortedData, type, width } = this.props;

		var data = unsortedData.slice().sort((a, b) => a.income - b.income);
		var r = d3.scale.linear()
			.range([2, 20])
			.domain(d3.extent(data, d => d.population));

		var f = d3.scale.category10()
			.domain(d3.set(data.map(d => d.region)));

		var fill = d => f(d.region);
		var radius = d => r(d.population);
		return (
			<ChartCanvas width={width} height={400} useCrossHairStyle={false}
					margin={{left: 40, right: 10, top:20, bottom: 30}} type={type}
					seriesName="Fruits"
					xExtents={list => list.map(d => d.x)}
					data={data}
					xAccessor={d => d.x} xScale={d3.scale.ordinal()}
					padding={1}>
				<Chart id={1}
						yExtents={d => [0, d.y1, d.y2]}>
					<XAxis axisAt="bottom" orient="bottom" ticks={2} />
					<YAxis axisAt="left" orient="left" />
					<GroupedBarSeries yAccessor={[d => d.y1, d => d.y2]} />
				</Chart>
				<EventCapture mouseMove={true} defaultFocus={false} />
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
