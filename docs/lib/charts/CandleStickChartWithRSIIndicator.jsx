"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries, RSISeries } = ReStock.series;
var { financeEODDiscontiniousScale } = ReStock.scale;

var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, SingleValueTooltip, RSITooltip } = ReStock.tooltip;

var { XAxis, YAxis } = ReStock.axes;
var { rsi, atr, ema, sma } = ReStock.indicator;

var { fitWidth } = ReStock.helper;

var xScale = financeEODDiscontiniousScale();

class CandleStickChartWithRSIIndicator extends React.Component {
	render() {
		var { data, type, width } = this.props;
		var ema26 = ema()
			.id(0)
			.windowSize(26)
			.merge((d, c) => {d.ema26 = c})
			.accessor(d => d.ema26);

		var ema12 = ema()
			.id(1)
			.windowSize(12)
			.merge((d, c) => {d.ema12 = c})
			.accessor(d => d.ema12);

		var smaVolume50 = sma()
			.id(3)
			.windowSize(10)
			.source(d => d.volume)
			.merge((d, c) => {d.smaVolume50 = c})
			.accessor(d => d.smaVolume50);

		var rsiCalculator = rsi()
			.windowSize(14)
			.merge((d, c) => {d.rsi = c})
			.accessor(d => d.rsi);

		var atr14 = atr()
			.windowSize(14)
			.merge((d, c) => {d.atr14 = c})
			.accessor(d => d.atr14);

		return (
			<ChartCanvas width={width} height={600}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data} calculator={[ema26, ema12, smaVolume50, rsiCalculator, atr14]}
					xAccessor={d => d.date} discontinous xScale={xScale}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1} height={300}
						yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
						yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")} 
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={5} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()}/>
					<LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()}/>

					<CurrentCoordinate id={1} yAccessor={ema26.accessor()} fill={ema26.stroke()} />
					<CurrentCoordinate id={2} yAccessor={ema12.accessor()} fill={ema12.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
				</Chart>
				<Chart id={2} height={150} 
						yExtents={[d => d.volume, smaVolume50.accessor()]}
						yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						origin={(w, h) => [0, h - 400]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
					<AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>
				</Chart>
				<Chart id={3} 
						yExtents={rsiCalculator.domain()}
						yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}
						height={125} origin={(w, h) => [0, h - 250]} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={2} tickValues={rsiCalculator.tickValues()}/>
					<RSISeries calculator={rsiCalculator} />
				</Chart>
				<Chart id={8}
						yExtents={atr14.accessor()}
						yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}
						height={125} origin={(w, h) => [0, h - 125]} padding={{ top: 10, bottom: 10 }} >
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={2}/>
					<LineSeries yAccessor={atr14.accessor()} stroke={atr14.stroke()}/>
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]}
						calculators={[ema26, ema12]}/>
					<RSITooltip forChart={3} origin={[-38, 15]} calculator={rsiCalculator}/>
					<SingleValueTooltip forChart={8}
						yAccessor={atr14.accessor()}
						yLabel={`ATR (${atr14.windowSize()})`}
						yDisplayFormat={d3.format(".2f")}
						/* valueStroke={atr14.stroke()} - optional prop */
						/* labelStroke="#4682B4" - optional prop */
						origin={[-40, 15]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
};


CandleStickChartWithRSIIndicator.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithRSIIndicator.defaultProps = {
	type: "svg",
};
CandleStickChartWithRSIIndicator = fitWidth(CandleStickChartWithRSIIndicator);

export default CandleStickChartWithRSIIndicator;
