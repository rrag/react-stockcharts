"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { EdgeIndicator } = ReStock.coordinates;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { ema, sma } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

class CandleStickChartWithEdge extends React.Component {
	render() {
		var { data, type, width } = this.props;

		var ema20 = ema()
			.id(0)
			.windowSize(20)
			.merge((d, c) => {d.ema20 = c})
			.accessor(d => d.ema20);

		var ema50 = ema()
			.id(2)
			.windowSize(50)
			.merge((d, c) => {d.ema50 = c})
			.accessor(d => d.ema50);

		var smaVolume70 = sma()
			.id(3)
			.windowSize(70)
			.source(d => d.volume)
			.merge((d, c) => {d.smaVolume70 = c})
			.accessor(d => d.smaVolume70);

		return (
			<ChartCanvas width={width} height={450}
					margin={{left: 90, right: 90, top:70, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data} calculator={[ema20, ema50, smaVolume70]}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2015, 0, 1), new Date(2015, 2, 1)]}>
				<Chart id={2}
						yExtents={[d => d.volume, smaVolume70.accessor()]}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
					<AreaSeries yAccessor={smaVolume70.accessor()} stroke={smaVolume70.stroke()} fill={smaVolume70.fill()}/>

					<CurrentCoordinate id={0} yAccessor={smaVolume70.accessor()} fill={smaVolume70.stroke()} />
					<CurrentCoordinate id={1} yAccessor={d => d.volume} fill="#9B0A47" />

					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={d => d.volume} displayFormat={d3.format(".4s")} fill="#0F0F0F"/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.volume} displayFormat={d3.format(".4s")} fill="#0F0F0F"/>
					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={smaVolume70.accessor()} displayFormat={d3.format(".4s")} fill={smaVolume70.fill()}/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={smaVolume70.accessor()} displayFormat={d3.format(".4s")} fill={smaVolume70.fill()}/>
				</Chart>
				<Chart id={1}
						yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<XAxis axisAt="top" orient="top"/>
					<YAxis axisAt="right" orient="right" ticks={5} />

					<MouseCoordinateX id={0}
						at="top"
						orient="top"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateX id={1}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />
					<MouseCoordinateY id={1}
						at="left"
						orient="left"
						displayFormat={d3.format(".2f")} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<CurrentCoordinate id={1} yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate id={2} yAccessor={ema50.accessor()} fill={ema50.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={ema20.accessor()} fill={ema20.fill()}/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={ema50.accessor()} fill={ema50.fill()}/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={ema20.accessor()} fill={ema20.fill()}/>
					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={ema50.accessor()} fill={ema50.fill()}/>
					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, -65]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, -55]} 
						calculators={[ema20, ema50]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
}

/*
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

*/

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
