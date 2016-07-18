"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var pointAndFigureTransformOptions = { boxSize: 0.25 };

var { ChartCanvas, Chart, EventCapture } = ReStock;
var { BarSeries, LineSeries, AreaSeries, PointAndFigureSeries } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = ReStock.coordinates;
var { EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MACDTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { pointAndFigure } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

class PointAndFigure extends React.Component {
	getChartCanvas() {
		return this.refs.chartCanvas;
	}
	render() {
		var { data, type, width } = this.props;
		var pAndF = pointAndFigure();

		return (
			<ChartCanvas ref="chartCanvas" width={width} height={400}
					margin={{left: 80, right: 80, top:10, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data} calculator={[pAndF]}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}>
				<Chart id={1}
						yExtents={d => [d.high, d.low]}
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<MouseCoordinateY id={0}
						at="left"
						orient="left"
						displayFormat={d3.format(".4s")} />

					<PointAndFigureSeries />
				</Chart>
				<Chart id={2}
						yExtents={d => d.volume}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="left"
						orient="left"
						displayFormat={d3.format(".4s")} />

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
				</TooltipContainer>
			</ChartCanvas>

		);
	}
}
PointAndFigure.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

PointAndFigure.defaultProps = {
	type: "svg",
};
PointAndFigure = fitWidth(PointAndFigure);

export default PointAndFigure;
