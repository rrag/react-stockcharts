"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, helper } from "react-stockcharts";

var { BarSeries, LineSeries, AreaSeries, ScatterSeries, CircleMarker, SquareMarker, TriangleMarker } = series;
var { discontinuousTimeScaleProvider } = scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = coordinates;

var { OHLCTooltip } = tooltip;
var { XAxis, YAxis } = axes;
var { fitWidth } = helper;

class LineAndScatterChartGrid extends React.Component {
	render() {
		var { data, type, width, ratio, gridProps } = this.props;
		var margin = { left: 70, right: 70, top: 20, bottom: 30 };

		const height = 400;
		var gridHeight = height - margin.top - margin.bottom;
		var gridWidth = width - margin.left - margin.right;

		var showGrid = true;
		var yGrid = showGrid ? { innerTickSize: -1 * gridWidth } : {};
		var xGrid = showGrid ? { innerTickSize: -1 * gridHeight } : {};

		return (
			<ChartCanvas ratio={ratio} width={width} height={height}
					margin={margin} type={type}
					seriesName="MSFT"
					data={data}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 2, 2)]}>
				<Chart id={1}
						yExtents={d => [d.high, d.low]}>
					<XAxis
						axisAt="bottom"
						orient="bottom"
						{...gridProps}
						{...xGrid}
					/>
					<YAxis
						axisAt="right"
						orient="right"
						ticks={5}
						{...gridProps}
						{...yGrid}
					/>
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<LineSeries
						yAccessor={d => d.close}
						stroke="#ff7f0e"
					/>
					<ScatterSeries
						yAccessor={d => d.close}
						marker={SquareMarker}
						markerProps={{ width: 6, stroke: "#ff7f0e", fill: "#ff7f0e" }} />
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
				</Chart>

				<CrossHairCursor />
			</ChartCanvas>

		);
	}
}

LineAndScatterChartGrid.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

LineAndScatterChartGrid.defaultProps = {
	type: "svg",
};
LineAndScatterChartGrid = fitWidth(LineAndScatterChartGrid);

export default LineAndScatterChartGrid;
