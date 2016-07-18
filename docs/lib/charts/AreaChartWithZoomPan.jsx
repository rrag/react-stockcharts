"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { AreaSeries, BarSeries, LineSeries, AreaSeries } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { EdgeIndicator } = ReStock.coordinates;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = ReStock.coordinates;

var { TooltipContainer, SingleValueTooltip, MovingAverageTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { fitWidth } = ReStock.helper;

class AreaChartWithEdge extends React.Component {
	render() {
		var { data, type, width } = this.props;

		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1}
						yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />

					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<AreaSeries yAccessor={d => d.close}/>
				</Chart>
				<Chart id={2}
						yExtents={d => d.volume}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

					<MouseCoordinateY id={0}
						at="left"
						orient="left"
						displayFormat={d3.format(".4s")} />

					<BarSeries yAccessor={d => d.volume}
						stroke fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"}
						opacity={0.4}
						widthRatio={1} />
				</Chart>
				<CrossHairCursor />

				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<SingleValueTooltip forChart={1}
						xLabel="Date" /* xLabel is optional, absense will not show the x value */ yLabel="C"
						yAccessor={d => d.close}
						xDisplayFormat={d3.time.format("%Y-%m-%d")} yDisplayFormat={d3.format(".2f")}
						/* valueStroke="green" - optional prop */
						/* labelStroke="#4682B4" - optional prop */
						origin={[-40, 0]}/>
					<SingleValueTooltip forChart={1}
						yLabel="Volume" yAccessor={(d) => d.volume}
						origin={[-40, 20]}/>
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
