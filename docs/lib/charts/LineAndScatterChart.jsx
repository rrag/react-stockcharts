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

class LineAndScatterChart extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;
		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
					margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
					type={type}
					pointsPerPxThreshold={1}
					seriesName="MSFT"
					data={data}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 2, 2)]}>
				<Chart id={1}
						yExtents={d => [d.high, d.low, d.AAPLClose, d.GEClose]}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis
						axisAt="right"
						orient="right"
						// tickInterval={5}
						// tickValues={[40, 60]}
						ticks={5}
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
						yAccessor={d => d.AAPLClose}
						stroke="#ff7f0e"
						strokeDasharray="Dot" />
					<ScatterSeries
						yAccessor={d => d.AAPLClose}
						marker={SquareMarker}
						markerProps={{ width: 6, stroke: "#ff7f0e", fill: "#ff7f0e" }} />
					<LineSeries
						yAccessor={d => d.GEClose}
						stroke="#2ca02c" />
					<ScatterSeries
						yAccessor={d => d.GEClose}
						marker={TriangleMarker}
						markerProps={{ width: 8, stroke: "#2ca02c", fill: "#2ca02c" }} />
					<LineSeries
						yAccessor={d => d.close}
						strokeDasharray="LongDash" />
					<ScatterSeries
						yAccessor={d => d.close}
						marker={CircleMarker}
						markerProps={{ r: 3 }} />
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
				</Chart>

				<CrossHairCursor />
			</ChartCanvas>

		);
	}
}

LineAndScatterChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

LineAndScatterChart.defaultProps = {
	type: "svg",
};
LineAndScatterChart = fitWidth(LineAndScatterChart);

export default LineAndScatterChart;
