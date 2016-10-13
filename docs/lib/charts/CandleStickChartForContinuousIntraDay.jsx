"use strict";

import React from "react";

import { scaleTime } from "d3-scale";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";


import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from "react-stockcharts";

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries } = series;

var { EdgeIndicator } = coordinates;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = coordinates;

var { OHLCTooltip, MovingAverageTooltip } = tooltip;
var { XAxis, YAxis } = axes;
var { ema, sma } = indicator;
var { fitWidth } = helper;

class CandleStickChartForContinuousIntraDay extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;

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

		var smaVolume50 = sma()
			.id(3)
			.windowSize(50)
			.sourcePath("volume")
			.merge((d, c) => {d.smaVolume50 = c})
			.accessor(d => d.smaVolume50);

		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
					margin={{ left: 80, right: 80, top: 10, bottom: 30 }} type={type}
					seriesName="MSFT"
					data={data} calculator={[ema20, ema50, smaVolume50]}
					xAccessor={d => d.date} xScale={scaleTime()}>
				<Chart id={2}
						yExtents={[d => d.volume, smaVolume50.accessor()]}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")}/>

					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
					<AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>

					<CurrentCoordinate yAccessor={smaVolume50.accessor()} fill={smaVolume50.stroke()} />
					<CurrentCoordinate yAccessor={d => d.volume} fill="#9B0A47" />

					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={d => d.volume} displayFormat={format(".4s")} fill="#0F0F0F"/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.volume} displayFormat={format(".4s")} fill="#0F0F0F"/>
					<EdgeIndicator itemType="first" orient="left" edgeAt="left"
						yAccessor={smaVolume50.accessor()} displayFormat={format(".4s")} fill={smaVolume50.fill()}/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={smaVolume50.accessor()} displayFormat={format(".4s")} fill={smaVolume50.fill()}/>
				</Chart>
				<Chart id={1}
						yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
						padding={{ top: 40, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />

					<MouseCoordinateX
						rectWidth={60}
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%H:%M:%S")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />

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

					<OHLCTooltip origin={[-40, 0]} xDisplayFormat={timeFormat("%Y-%m-%d %H:%M:%S")}/>
					<MovingAverageTooltip onClick={(e) => console.log(e)} origin={[-38, 15]}
						calculators={[ema20, ema50]}/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CandleStickChartForContinuousIntraDay.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartForContinuousIntraDay.defaultProps = {
	type: "svg",
};
CandleStickChartForContinuousIntraDay = fitWidth(CandleStickChartForContinuousIntraDay);

export default CandleStickChartForContinuousIntraDay;