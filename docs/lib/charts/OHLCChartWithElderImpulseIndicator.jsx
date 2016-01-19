"use strict";

import React from "react";
import d3 from "d3";

import * as ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries, OverlaySeries, EventCapture } = ReStock;

var { OHLCSeries, HistogramSeries, LineSeries, AreaSeries, MACDSeries, ElderImpulseBackground } = ReStock.series;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, MACDTooltip } = ReStock.tooltip;
var { StockscaleTransformer } = ReStock.transforms;

var { XAxis, YAxis } = ReStock.axes;
var { MACD, EMA, ElderImpulse, Copy } = ReStock.indicator;

var { fitWidth } = ReStock.helper;

class OHLCChartWithElderImpulseIndicator extends React.Component {
	getChartCanvas() {
		return this.refs.chartCanvas;
	}
	render() {
		var { data, type, width } = this.props;

		return (
			<ChartCanvas ref="chartCanvas" width={width} height={600}
				margin={{left: 70, right: 70, top:20, bottom: 30}} initialDisplay={200} 
				dataTransform={[ { transform: StockscaleTransformer } ]}
				data={data} type={type}>
				<Chart id={1} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}
						height={150} origin={(w, h) => [0, h - 150]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={2}/>
					<DataSeries id={0} indicator={MACD} options={{ fast: 12, slow: 26, signal: 9 }} >
						<MACDSeries />
					</DataSeries>
				</Chart>
				<Chart id={2} yMousePointerDisplayLocation="right" height={400}
						yMousePointerDisplayFormat={d3.format(".2f")} padding={{ top: 10, right: 0, bottom: 20, left: 0 }}>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<DataSeries id={0} indicator={EMA} options={{ period: 12 }}>
						<LineSeries/>
					</DataSeries>
					<DataSeries id={1} indicator={ElderImpulse} options={{ source: [["chart_2", "overlay_0"], ["chart_1", "overlay_0", "histogram"]] }} >
						<OHLCSeries />
					</DataSeries>
				</Chart>
				<Chart id={3} yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 300]} >
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<DataSeries id={0} yAccessor={(d) => d.volume} >
						<HistogramSeries
							fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"}
							opacity={0.5} />
					</DataSeries>
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={2} origin={[-40, -10]}/>
					<MovingAverageTooltip forChart={2} onClick={(e) => console.log(e)} origin={[-38, 5]} />
					<MACDTooltip forChart={1} origin={[-38, 15]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
};
OHLCChartWithElderImpulseIndicator.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

OHLCChartWithElderImpulseIndicator.defaultProps = {
	type: "svg",
};
OHLCChartWithElderImpulseIndicator = fitWidth(OHLCChartWithElderImpulseIndicator);

export default OHLCChartWithElderImpulseIndicator;
