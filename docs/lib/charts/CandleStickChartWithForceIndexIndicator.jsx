"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries, RSISeries, StraightLine } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = ReStock.coordinates;
var { EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, SingleValueTooltip, RSITooltip } = ReStock.tooltip;

var { XAxis, YAxis } = ReStock.axes;
//console.log(ReStock.indicator);
var { forceIndex, ema } = ReStock.indicator;

var { fitWidth } = ReStock.helper;

class CandleStickChartWithForceIndexIndicator extends React.Component {
	render() {
		var { data, type, width } = this.props;

		var fi = forceIndex()
			.merge((d, c) => {d.fi = c})
			.accessor(d => d.fi);

		var fiEMA13 = ema()
			.id(1)
			.windowSize(13)
			.source(d => d.fi)
			.merge((d, c) => {d.fiEMA13 = c})
			.accessor(d => d.fiEMA13);

		return (
			<ChartCanvas width={width} height={550}
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
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<CandlestickSeries />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

				</Chart>
				<Chart id={2} height={150} 
						yExtents={d => d.volume}
						origin={(w, h) => [0, h - 350]} >
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<MouseCoordinateY id={0}
						at="left"
						orient="left"
						displayFormat={d3.format(".4s")} />

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
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={d3.format("s")}/>
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".4s")} />

					<AreaSeries baseAt={scale => scale(0)} yAccessor={fi.accessor()} />
					<StraightLine yValue={0} />
				</Chart>
				<Chart id={4} height={100}
						yExtents={fiEMA13.accessor()}
						origin={(w, h) => [0, h - 100]}
						padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={d3.format("s")}/>

					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".4s")} />

					<AreaSeries baseAt={scale => scale(0)} yAccessor={fiEMA13.accessor()} />
					<StraightLine yValue={0} />
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, -10]}/>
					<SingleValueTooltip forChart={3}
						yAccessor={fi.accessor()}
						yLabel="ForceIndex (1)"
						yDisplayFormat={d3.format(".4s")}
						origin={[-40, 15]}/>
					<SingleValueTooltip forChart={4}
						yAccessor={fiEMA13.accessor()}
						yLabel={`ForceIndex (${fiEMA13.windowSize()})`}
						yDisplayFormat={d3.format(".4s")}
						origin={[-40, 15]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
};

CandleStickChartWithForceIndexIndicator.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithForceIndexIndicator.defaultProps = {
	type: "svg",
};
CandleStickChartWithForceIndexIndicator = fitWidth(CandleStickChartWithForceIndexIndicator);

export default CandleStickChartWithForceIndexIndicator;
