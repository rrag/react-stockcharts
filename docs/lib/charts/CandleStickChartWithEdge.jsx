"use strict";

import React from "react";
import d3 from "d3";

import * as ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries, OverlaySeries,EventCapture } = ReStock;

var { CandlestickSeries, HistogramSeries, LineSeries, AreaSeries } = ReStock.series;
var { financeEODDiscontiniousScale } = ReStock.scale;

var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip } = ReStock.tooltip;
var { StockscaleTransformer } = ReStock.transforms;
var { XAxis, YAxis } = ReStock.axes;
var { ema, sma, bollingerBand } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

var ema20 = ema()
	.windowSize(20)
	.merge((d, c) => {d.ema20 = c})
	.accessor(d => d.ema20);

var sma20 = sma()
	.windowSize(20)
	.merge((d, c) => {d.sma20 = c})
	.accessor(d => d.sma20);

var ema50 = ema()
	.windowSize(50)
	.merge((d, c) => {d.ema50 = c})
	.accessor(d => d.ema50);

var smaVolume50 = sma()
	.windowSize(50)
	.source(d => d.volume)
	.merge((d, c) => {d.smaVolume50 = c})
	.accessor(d => d.smaVolume50);

var xScale = financeEODDiscontiniousScale();
class CandleStickChartWithEdge extends React.Component {
	render() {
		var { data, type, width } = this.props;

		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 80, right: 80, top:10, bottom: 30}} type={type}
					data={data} calculator={[sma20, ema20, ema50, smaVolume50]}
					xAccessor={d => d.date} discontinous xScale={xScale}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1}
						yExtents={[d => d.high, d => d.low, sma20.accessor(), ema20.accessor(), ema50.accessor()]}
						yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")} 
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<CurrentCoordinate id={1} yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate id={2} yAccessor={ema50.accessor()} fill={ema50.stroke()} />

					<EdgeIndicator id={0} itemType="last" orient="right" edgeAt="right"
						yAccessor={ema20.accessor()} fill={ema20.fill()}/>
					<EdgeIndicator id={1} itemType="last" orient="right" edgeAt="right"
						yAccessor={ema50.accessor()} fill={ema50.fill()}/>
					<EdgeIndicator id={2} itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#00FF00" : "#FF0000"}/>
					<EdgeIndicator id={3} itemType="first" orient="left" edgeAt="left"
						yAccessor={ema20.accessor()} fill={ema20.fill()}/>
					<EdgeIndicator id={4} itemType="first" orient="left" edgeAt="left"
						yAccessor={ema50.accessor()} fill={ema50.fill()}/>
					<EdgeIndicator id={5} itemType="first" orient="left" edgeAt="left"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#00FF00" : "#FF0000"}/>
				</Chart>
				<Chart id={2}
						yExtents={[d => d.volume, smaVolume50.accessor()]}
						yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

					<HistogramSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "red"} />
					<AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>

					<CurrentCoordinate id={0} yAccessor={smaVolume50.accessor()} fill={smaVolume50.stroke()} />
					<CurrentCoordinate id={1} yAccessor={d => d.volume} fill="#9B0A47" />

					<EdgeIndicator id={0} itemType="first" orient="left" edgeAt="left"
						yAccessor={d => d.volume} displayFormat={d3.format(".4s")} fill="#0F0F0F"/>
					<EdgeIndicator id={1} itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.volume} displayFormat={d3.format(".4s")} fill="#0F0F0F"/>
					<EdgeIndicator id={2} itemType="first" orient="left" edgeAt="left"
						yAccessor={smaVolume50.accessor()} displayFormat={d3.format(".4s")} fill={smaVolume50.fill()}/>
					<EdgeIndicator id={3} itemType="last" orient="right" edgeAt="right"
						yAccessor={smaVolume50.accessor()} displayFormat={d3.format(".4s")} fill={smaVolume50.fill()}/>
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]} 
						calculators={[sma20, ema20, ema50]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
}

CandleStickChartWithEdge.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithEdge.defaultProps = {
	type: "svg",
};
CandleStickChartWithEdge = fitWidth(CandleStickChartWithEdge);

export default CandleStickChartWithEdge;
