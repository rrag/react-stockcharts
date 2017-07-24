
import { set } from "d3-collection";
import { scaleOrdinal, schemeCategory10, scaleLinear, scaleLog } from  "d3-scale";
import { format } from "d3-format";
import { extent } from "d3-array";

import React from "react";
import PropTypes from "prop-types";

import { ChartCanvas, Chart } from "react-stockcharts";
import { ScatterSeries, CircleMarker } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { fitWidth } from "react-stockcharts/lib/helper";

class BubbleChart extends React.Component {
	render() {
		const { data: unsortedData, type, width, ratio } = this.props;

		const data = unsortedData.slice().sort((a, b) => a.income - b.income);
		const r = scaleLinear()
			.range([2, 20])
			.domain(extent(data, d => d.population));

		const f = scaleOrdinal(schemeCategory10)
			.domain(set(data.map(d => d.region)));

		const fill = d => f(d.region);
		const radius = d => r(d.population);
		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
					margin={{ left: 70, right: 70, top: 20, bottom: 30 }} type={type}
					seriesName="Wealth & Health of Nations"
					data={data}
					xAccessor={d => d.income}
					xScale={scaleLog()}
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
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

BubbleChart.defaultProps = {
	type: "svg",
};
BubbleChart = fitWidth(BubbleChart);

export default BubbleChart;
