"use strict";

import { set } from "d3-collection";
import { scaleOrdinal, schemeCategory10, scaleLinear, scaleLog } from  "d3-scale";
import { format } from "d3-format";
import { extent } from "d3-array";

import React from "react";

import { ChartCanvas, Chart, series, coordinates, axes, helper } from "react-stockcharts";

var { ScatterSeries, CircleMarker } = series;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = coordinates;

var { XAxis, YAxis } = axes;
var { fitWidth } = helper;

class BubbleChart extends React.Component {
	render() {
		var { data: unsortedData, type, width, ratio } = this.props;

		var data = unsortedData.slice().sort((a, b) => a.income - b.income);
		var r = scaleLinear()
			.range([2, 20])
			.domain(extent(data, d => d.population));

		var f = scaleOrdinal(schemeCategory10)
			.domain(set(data.map(d => d.region)));

		var fill = d => f(d.region);
		var radius = d => r(d.population);
		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
					margin={{ left: 70, right: 70, top: 20, bottom: 30 }} type={type}
					seriesName="Wealth & Health of Nations"
					data={data}
					xAccessor={d => d.income} xScale={scaleLog()}
					padding={{ left: 20, right: 20 }}
					>
				<Chart id={1}
						yExtents={d => d.lifeExpectancy}
						yMousePointerRectWidth={45}
						padding={{ top: 20, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom" ticks={2} tickFormat={format(",d")}/>
					<YAxis axisAt="left" orient="left" />
					<ScatterSeries yAccessor={d => d.lifeExpectancy} marker={CircleMarker}
						fill={fill}
						markerProps={{ r: radius, fill: fill }} />

					<MouseCoordinateX snapX={false}
						at="bottom"
						orient="bottom"
						rectWidth={50}
						displayFormat={format(".0f")} />
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".2f")} />
				</Chart>
				<CrossHairCursor snapX={false} />
			</ChartCanvas>

		);
	}
}

BubbleChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

BubbleChart.defaultProps = {
	type: "svg",
};
BubbleChart = fitWidth(BubbleChart);

export default BubbleChart;
