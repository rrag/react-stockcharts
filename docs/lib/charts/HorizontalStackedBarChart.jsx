
import { scaleOrdinal, schemeCategory10, scaleLinear, scalePoint } from  "d3-scale";
import { set } from "d3-collection";
import { max } from "d3-array";

import React from "react";
import PropTypes from "prop-types";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	StackedBarSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";

class HorizontalStackedBarChart extends React.Component {
	render() {
		const { data, type, width, ratio } = this.props;

		const f = scaleOrdinal(schemeCategory10)
			.domain(set(data.map(d => d.region)));

		const fill = (d, i) => f(i);
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
						padding={.5}>
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
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

HorizontalStackedBarChart.defaultProps = {
	type: "svg",
};
HorizontalStackedBarChart = fitWidth(HorizontalStackedBarChart);

export default HorizontalStackedBarChart;
