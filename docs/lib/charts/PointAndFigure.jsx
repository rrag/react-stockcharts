"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var pointAndFigureTransformOptions = { boxSize: 0.25 };

var { ChartCanvas, Chart, DataSeries, OverlaySeries, EventCapture } = ReStock;
var { HistogramSeries, LineSeries, AreaSeries, PointAndFigureSeries } = ReStock.series;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;

var { StockscaleTransformer, PointAndFigureTransformer } = ReStock.transforms;
var { TooltipContainer, OHLCTooltip, MACDTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { SMA } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

class PointAndFigure extends React.Component {
	getChartCanvas() {
		return this.refs.chartCanvas;
	}
	render() {
		var { data, type, width } = this.props;

		return (
			<ChartCanvas ref="chartCanvas" width={width} height={400}
				margin={{left: 90, right: 70, top:10, bottom: 30}} initialDisplay={30}
				dataTransform={[ { transform: StockscaleTransformer }, { transform: PointAndFigureTransformer, options: pointAndFigureTransformOptions } ]}
				data={data} type={type}>
				<Chart id={1} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={(y) => y.toFixed(2)}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<DataSeries id={0} yAccessor={PointAndFigureSeries.yAccessor} >
						<PointAndFigureSeries />
					</DataSeries>
				</Chart>
				<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<DataSeries id={0} yAccessor={(d) => d.volume} >
						<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
					</DataSeries>
					<DataSeries id={3} indicator={SMA} options={{ period: 10, pluck:"volume" }} >
						<AreaSeries/>
					</DataSeries>
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-50, 0]}/>
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
