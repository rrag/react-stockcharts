"use strict";

import React from "react";
import d3 from "d3";

import * as ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries, OverlaySeries,EventCapture } = ReStock;

var { CandlestickSeries, HistogramSeries, LineSeries, AreaSeries, ScatterSeries, CircleMarker } = ReStock.series;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip } = ReStock.tooltip;
var { StockscaleTransformer } = ReStock.transforms;
var { XAxis, YAxis } = ReStock.axes;
var { EMA, SMA } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

class AreaChartWithPointsAndEdge extends React.Component {
	render() {
		var { data, type, width } = this.props;

		return (
			<ChartCanvas width={width} height={400}
				margin={{left: 90, right: 70, top:10, bottom: 30}} initialDisplay={100}
				dataTransform={[ { transform: StockscaleTransformer } ]}
				data={data} type={type}>
				<Chart id={1} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<DataSeries id={0} yAccessor={AreaSeries.yAccessor} >
						<AreaSeries />
						<ScatterSeries marker={CircleMarker} markerProps={{ r: 3 }} />
					</DataSeries>
					<DataSeries id={1} indicator={EMA} options={{ period: 20, source: "close" }}>
						<LineSeries/>
					</DataSeries>
					<DataSeries id={2} indicator={EMA} options={{ period: 30 }} >
						<LineSeries/>
					</DataSeries>
					<DataSeries id={3} indicator={SMA} options={{ period: 50 }} >
						<LineSeries/>
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={1} forDataSeries={1} />
				<CurrentCoordinate forChart={1} forDataSeries={2} />
				<CurrentCoordinate forChart={1} forDataSeries={3} />
				<Chart id={2} yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<DataSeries id={0} yAccessor={(d) => d.volume} >
						<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={2} forDataSeries={0} />
				<EdgeContainer>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right" forChart={1} forDataSeries={1} />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right" forChart={1} forDataSeries={2} />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right" forChart={1} forDataSeries={3} />
					<EdgeIndicator itemType="first" orient="left" edgeAt="left" forChart={1} forDataSeries={1} />
					<EdgeIndicator itemType="first" orient="left" edgeAt="left" forChart={1} forDataSeries={2} />
					<EdgeIndicator itemType="first" orient="left" edgeAt="left" forChart={1} forDataSeries={3} />
					<EdgeIndicator itemType="first" orient="left" edgeAt="left" forChart={2} forDataSeries={0} displayFormat={d3.format(".4s")} fill="#0F0F0F"/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right" forChart={2} forDataSeries={0} displayFormat={d3.format(".4s")} fill="#0F0F0F"/>
				</EdgeContainer>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-50, 0]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-48, 15]} />
				</TooltipContainer>
			</ChartCanvas>
		);
	}
}

AreaChartWithPointsAndEdge.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChartWithPointsAndEdge.defaultProps = {
	type: "svg",
};
AreaChartWithPointsAndEdge = fitWidth(AreaChartWithPointsAndEdge);

export default AreaChartWithPointsAndEdge;
