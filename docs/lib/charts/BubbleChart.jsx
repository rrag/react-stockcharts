"use strict";

import React from "react";
import d3 from "d3";

import { ChartCanvas, Chart, series, coordinates, axes, helper } from "react-stockcharts";

var { ScatterSeries, CircleMarker } = series;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = coordinates;

var { XAxis, YAxis } = axes;
var { fitWidth } = helper;

class BubbleChart extends React.Component {
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
			<ChartCanvas width={width} height={400}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName="Wealth & Health of Nations"
					data={data}
					xAccessor={d => d.income} xScale={d3.scale.log()}
					padding={{ left: 20, right: 20 }}
					>
				<Chart id={1}
						yExtents={d => d.lifeExpectancy}
						yMousePointerRectWidth={45}
						padding={{ top: 20, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom" ticks={2} tickFormat={d3.format(",d")}/>
					<YAxis axisAt="left" orient="left" />
					<ScatterSeries yAccessor={d => d.lifeExpectancy} marker={CircleMarker}
						fill={fill}
						markerProps={{ r: radius, fill: fill }} />

					<MouseCoordinateX snapX={false}
						at="bottom"
						orient="bottom"
						rectWidth={50}
						displayFormat={d3.format(".0f")} />
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={d3.format(".2f")} />
				</Chart>
				<CrossHairCursor snapX={false} />
			</ChartCanvas>

		);
	}
}

BubbleChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

BubbleChart.defaultProps = {
	type: "svg",
};
BubbleChart = fitWidth(BubbleChart);

export default BubbleChart;
