"use strict";

import React from "react";
import d3 from "d3";

import * as ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries, OverlaySeries, EventCapture } = ReStock;

var { CandlestickSeries, HistogramSeries, LineSeries, AreaSeries, MACDSeries } = ReStock.series;
var { financeEODDiscontiniousScale } = ReStock.scale;

var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, MACDTooltip } = ReStock.tooltip;

var { XAxis, YAxis } = ReStock.axes;
var { macd, ema } = ReStock.indicator;

var { fitWidth } = ReStock.helper;

var xScale = financeEODDiscontiniousScale();

class CandleStickChartWithMACDIndicator extends React.Component {
	getChartCanvas() {
		return this.refs.chartCanvas;
	}
	render() {
		var { data, type, width } = this.props;

		var ema26 = ema()
			.id(0)
			.windowSize(26)
			.merge((d, c) => {d.ema26 = c})
			.accessor(d => d.ema26);

		var ema12 = ema()
			.id(2)
			.windowSize(12)
			.merge((d, c) => {d.ema12 = c})
			.accessor(d => d.ema12);

		var macdCalculator = macd()
			.windowSize(12)
			.merge((d, c) => {d.macd = c})
			.accessor(d => d.macd);

		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 80, right: 80, top:10, bottom: 30}} type={type}
					data={data} calculator={[ema26, ema12, macdCalculator]}
					xAccessor={d => d.date} discontinous xScale={xScale}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1}
						yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
						yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")} 
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<CurrentCoordinate id={1} yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate id={2} yAccessor={ema50.accessor()} fill={ema50.stroke()} />

					<EdgeIndicator id={2} itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#00FF00" : "#FF0000"}/>
				</Chart>
				<Chart id={2}
						yExtents={[d => d.volume, smaVolume50.accessor()]}
						yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<HistogramSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
					<AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>
				</Chart>
				<Chart id={3} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}
						height={150} origin={(w, h) => [0, h - 150]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={2} />
					<MACDSeries />
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]} 
						calculators={[ema20, ema50]}/>
					<MACDTooltip forChart={3} origin={[-38, 15]}/>
				</TooltipContainer>
			</ChartCanvas>


		);
	}
};
CandleStickChartWithMACDIndicator.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithMACDIndicator.defaultProps = {
	type: "svg",
};
CandleStickChartWithMACDIndicator = fitWidth(CandleStickChartWithMACDIndicator);

export default CandleStickChartWithMACDIndicator;
