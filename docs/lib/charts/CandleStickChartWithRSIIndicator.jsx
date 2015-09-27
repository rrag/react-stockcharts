"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "ReStock";

var { ChartCanvas, Chart, DataSeries, OverlaySeries, EventCapture } = ReStock;

var { CandlestickSeries, HistogramSeries, LineSeries, AreaSeries, MACDSeries, RSISeries } = ReStock.series;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, MACDTooltip, RSITooltip } = ReStock.tooltip;
var { StockscaleTransformer } = ReStock.transforms;

var { XAxis, YAxis } = ReStock.axes;
var { MACD, EMA, SMA, RSI } = ReStock.indicator;
var { ChartWidthMixin } = ReStock.helper;

var CandleStickChartWithRSIIndicator = React.createClass({
	mixins: [ChartWidthMixin],
	propTypes: {
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	},
	getDefaultProps() {
		return {
			type: "svg"
		}
	},
	render() {
		if (this.state === null || !this.state.width) return <div />;
		var { data, type } = this.props;
		var dateFormat = d3.time.format("%Y-%m-%d");

		return (
			<ChartCanvas width={this.state.width} height={600}
				margin={{left: 70, right: 70, top:20, bottom: 30}} initialDisplay={200} 
				dataTransform={[ { transform: StockscaleTransformer } ]}
				data={data} type={type}>
				<Chart id={1} yMousePointerDisplayLocation="right" height={300}
						yMousePointerDisplayFormat={(y) => y.toFixed(2)} padding={{ top: 10, right: 0, bottom: 20, left: 0 }}>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<DataSeries id={0} yAccessor={CandlestickSeries.yAccessor} >
						<CandlestickSeries />
					</DataSeries>
					<DataSeries id={1} indicator={EMA} options={{ period: 26 }} >
						<LineSeries />
					</DataSeries>
					<DataSeries id={2} indicator={EMA} options={{ period: 12 }} >
						<LineSeries />
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={1} forDataSeries={1} />
				<CurrentCoordinate forChart={1} forDataSeries={2} />
				<Chart id={2} yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 400]} >
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<DataSeries id={0} yAccessor={(d) => d.volume} >
						<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
					</DataSeries>
					<DataSeries id={1} indicator={SMA} options={{ period: 10, pluck:"volume" }} stroke="steelblue" fill="steelblue" >
						<AreaSeries opacity={0.5} />
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={2} forDataSeries={0} />
				<CurrentCoordinate forChart={2} forDataSeries={1}/>
				<EdgeContainer>
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={1} forDataSeries={1} />
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={1} forDataSeries={2} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={1} forDataSeries={1} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={1} forDataSeries={2} />
				</EdgeContainer>
				<Chart id={3} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={(y) => y.toFixed(2)}
						height={125} origin={(w, h) => [0, h - 250]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={4} />
					<DataSeries id={0} indicator={RSI} options={{ period: 14 }} >
						<RSISeries />
					</DataSeries>
				</Chart>
				<Chart id={4} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={(y) => y.toFixed(2)}
						height={125} origin={(w, h) => [0, h - 125]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={2}/>
					<DataSeries id={0} indicator={MACD} options={{ fast: 12, slow: 26, signal: 9 }} >
						<MACDSeries />
					</DataSeries>
				</Chart>
				<MouseCoordinates xDisplayFormat={dateFormat} type="crosshair" />
				<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, -10]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 5]} />
					<MACDTooltip forChart={4} origin={[-38, 15]}/>
					<RSITooltip forChart={3} origin={[-38, 15]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
});

export default CandleStickChartWithRSIIndicator;
