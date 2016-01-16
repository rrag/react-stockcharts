"use strict";

import React from "react";
import d3 from "d3";

import * as ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries, OverlaySeries,EventCapture } = ReStock;

var { AreaSeries, HistogramSeries, LineSeries, AreaSeries } = ReStock.series;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;

var { TooltipContainer, SingleValueTooltip, MovingAverageTooltip } = ReStock.tooltip;
var { StockscaleTransformer } = ReStock.transforms;
var { XAxis, YAxis } = ReStock.axes;
var { EMA, SMA } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

class AreaChartWithEdge extends React.Component {
	render() {
		var { data, type, width } = this.props;

		return (
			<ChartCanvas width={width} height={400}
				margin={{left: 90, right: 70, top:10, bottom: 30}} initialDisplay={300}
				dataTransform={[ { transform: StockscaleTransformer } ]}
				data={data} type={type}>
				<Chart id={1} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<DataSeries id={0} yAccessor={AreaSeries.yAccessor} stroke="#76C444" fill="#C7F3AB">
						<AreaSeries />
					</DataSeries>
				</Chart>
				<Chart id={2} yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<DataSeries id={0} yAccessor={(d) => d.volume} >
						<HistogramSeries
							stroke
							fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"}
							opacity={0.4}
							widthRatio={1} />
					</DataSeries>
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
				<TooltipContainer>
					<SingleValueTooltip forChart={1} forSeries={0}
						xLabel="Date" /* xLabel is optional, absense will not show the x value */ yLabel="C"
						xDisplayFormat={d3.time.format("%Y-%m-%d")} yDisplayFormat={d3.format(".2f")}
						/* valueStroke="green" - optional prop */
						/* labelStroke="#4682B4" - optional prop */
						origin={[-50, 0]}/>
					<SingleValueTooltip forChart={1} forSeries={0}
						yLabel="Volume" yAccessor={(d) => d.volume}
						origin={[-50, 20]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
}

AreaChartWithEdge.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChartWithEdge.defaultProps = {
	type: "svg",
};
AreaChartWithEdge = fitWidth(AreaChartWithEdge);

export default AreaChartWithEdge;
