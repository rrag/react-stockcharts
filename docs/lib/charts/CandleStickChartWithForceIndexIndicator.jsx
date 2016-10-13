"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from "react-stockcharts";

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries, RSISeries, StraightLine } = series;
var { discontinuousTimeScaleProvider } = scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = coordinates;
var { EdgeIndicator } = coordinates;

var { OHLCTooltip, MovingAverageTooltip, SingleValueTooltip, RSITooltip } = tooltip;

var { XAxis, YAxis } = axes;
//console.log(indicator);
var { forceIndex, ema } = indicator;

var { fitWidth } = helper;

class CandleStickChartWithForceIndexIndicator extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;

		var fi = forceIndex()
			.merge((d, c) => {d.fi = c})
			.accessor(d => d.fi);

		var fiEMA13 = ema()
			.id(1)
			.windowSize(13)
			.sourcePath("fi")
			.merge((d, c) => {d.fiEMA13 = c})
			.accessor(d => d.fiEMA13);

		return (
			<ChartCanvas ratio={ratio} width={width} height={550}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data} calculator={[fi, fiEMA13]}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1}  height={300}
						yExtents={d => [d.high, d.low]}
						padding={{ top: 10, right: 0, bottom: 20, left: 0 }}>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
					<OHLCTooltip origin={[-40, -10]}/>

				</Chart>
				<Chart id={2} height={150}
						yExtents={d => d.volume}
						origin={(w, h) => [0, h - 350]} >
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")}/>
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries
						yAccessor={d => d.volume}
						fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"}
						opacity={0.5} />
				</Chart>
				<Chart id={3} height={100}
						yExtents={fi.accessor()}
						origin={(w, h) => [0, h - 200]}
						padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={format(".0s")}/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".4s")} />

					<AreaSeries baseAt={scale => scale(0)} yAccessor={fi.accessor()} />
					<StraightLine yValue={0} />

					<SingleValueTooltip
						yAccessor={fi.accessor()}
						yLabel="ForceIndex (1)"
						yDisplayFormat={format(".4s")}
						origin={[-40, 15]}/>
				</Chart>
				<Chart id={4} height={100}
						yExtents={fiEMA13.accessor()}
						origin={(w, h) => [0, h - 100]}
						padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={format(".0s")}/>

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".4s")} />

					<AreaSeries baseAt={scale => scale(0)} yAccessor={fiEMA13.accessor()} />
					<StraightLine yValue={0} />

					<SingleValueTooltip
						yAccessor={fiEMA13.accessor()}
						yLabel={`ForceIndex (${fiEMA13.windowSize()})`}
						yDisplayFormat={format(".4s")}
						origin={[-40, 15]}/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
};

CandleStickChartWithForceIndexIndicator.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithForceIndexIndicator.defaultProps = {
	type: "svg",
};
CandleStickChartWithForceIndexIndicator = fitWidth(CandleStickChartWithForceIndexIndicator);

export default CandleStickChartWithForceIndexIndicator;
