"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries, BollingerSeries } = ReStock.series;
var { financeEODDiscontiniousScale } = ReStock.scale;
var { EdgeIndicator } = ReStock.coordinates;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, BollingerBandTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { ema, sma, bollingerBand } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

var xScale = financeEODDiscontiniousScale();

class CandleStickChartWithBollingerBandOverlay extends React.Component {
	render() {
		var { data, type, width } = this.props;

		var ema20 = ema()
			.windowSize(20) // optional will default to 10
			.source(d => d.close) // optional will default to close as the source
			.skipUndefined(true) // defaults to true
			.merge((d, c) => {d.ema20 = c}) // Required, if not provided, log a error
			.accessor(d => d.ema20) // Required, if not provided, log an error during calculation
			.stroke("blue") // Optional

		var sma20 = sma()
			.windowSize(20)
			.source(d => d.close)
			.merge((d, c) => {d.sma20 = c})
			.accessor(d => d.sma20)

		var ema50 = ema()
			.windowSize(50)
			.source(d => d.close)
			.merge((d, c) => {d.ema50 = c})
			.accessor(d => d.ema50)

		var smaVolume50 = sma()
			.windowSize(50)
			.source(d => d.volume)
			.merge((d, c) => {d.smaVolume50 = c})
			.accessor(d => d.smaVolume50)
			.stroke("#4682B4")
			.fill("#4682B4");

		var bb = bollingerBand()
			.merge((d, c) => {d.bb = c})
			.accessor(d => d.bb);
		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 70, right: 70, top:10, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data} calculator={[sma20, ema20, ema50, smaVolume50, bb]}
					xAccessor={d => d.date} discontinous xScale={xScale}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1}
						yExtents={[d => [d.high, d.low], sma20.accessor(), ema20.accessor(), ema50.accessor(), bb.accessor()]}
						yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")} 
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<CandlestickSeries />
					<LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()}/>
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>
					<BollingerSeries calculator={bb} />
					<CurrentCoordinate id={0} yAccessor={sma20.accessor()} fill={sma20.stroke()} />
					<CurrentCoordinate id={1} yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate id={2} yAccessor={ema50.accessor()} fill={ema50.stroke()} />
				</Chart>
				<Chart id={2}
						yExtents={[d => d.volume, smaVolume50.accessor()]}
						yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "red"} />
					<AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>
					<CurrentCoordinate id={0} yAccessor={smaVolume50.accessor()} fill={smaVolume50.stroke()} />
					<CurrentCoordinate id={1} yAccessor={d => d.volume} fill="#9B0A47" />
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]} 
						calculators={[sma20, ema20, ema50]}/>
					<BollingerBandTooltip forChart={1} origin={[-38, 60]} calculator={bb} />
				</TooltipContainer>
			</ChartCanvas>
		);
	}
};

/*
*/

CandleStickChartWithBollingerBandOverlay.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithBollingerBandOverlay.defaultProps = {
	type: "svg",
};
CandleStickChartWithBollingerBandOverlay = fitWidth(CandleStickChartWithBollingerBandOverlay);

export default CandleStickChartWithBollingerBandOverlay;
