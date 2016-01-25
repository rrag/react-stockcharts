"use strict";

import React from "react";
import d3 from "d3";

import * as ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries, OverlaySeries, EventCapture } = ReStock;

var { CandlestickSeries, HistogramSeries, LineSeries, AreaSeries, MACDSeries } = ReStock.series;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, MACDTooltip } = ReStock.tooltip;
var { StockscaleTransformer } = ReStock.transforms;

var { XAxis, YAxis } = ReStock.axes;
var { MACD, EMA, SMA } = ReStock.indicator;

var { fitWidth } = ReStock.helper;

class CandleStickChartWithMACDIndicator extends React.Component {
	getChartCanvas() {
		return this.refs.chartCanvas;
	}
	render() {
		var { data, type, width } = this.props;

		return (
			<ChartCanvas ref="chartCanvas" width={width} height={600}
				margin={{left: 70, right: 70, top:20, bottom: 30}} initialDisplay={200} 
				data={data} type={type}
				calculator={[DiscontiniousEOD, Interval, EMA26, EMA12, MACD, VolumeSMA10]}
				xAccessor={DiscontiniousEOD.xAccessor()} xExtents={[leftDate, rightDate]} xScale={stockscale} >
				<Chart id={1} yMousePointerDisplayLocation="right" height={400}
						yMousePointerDisplayFormat={d3.format(".2f")} padding={{ top: 10, right: 0, bottom: 20, left: 0 }}
						yExtents={[d => ([d.high, d.low]), EMA26.yAccessor(), EMA12.yAccessor() ]}
						yScale={d3.scale.linear()}>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<CandlestickSeries />
					<LineSeries yAccessor={EMA26.yAccessor()} stroke={EMA26.stroke()} />
					<LineSeries yAccessor={EMA12.yAccessor()} stroke={EMA12.stroke()} />
					<CurrentCoordinate yAccessor={EMA26.yAccessor()} stroke={EMA26.stroke()} />
					<CurrentCoordinate yAccessor={EMA12.yAccessor()} stroke={EMA12.stroke()} />
					<EdgeContainer>
						<EdgeIndicator itemType="last" orient="right"
							edgeAt="right" yAccessor={EMA26.yAccessor()} fill={EMA26.stroke()} />
						<EdgeIndicator itemType="last" orient="right"
							edgeAt="right" yAccessor={EMA12.yAccessor()} fill={EMA12.stroke()} />
						<EdgeIndicator itemType="first" orient="left"
							edgeAt="left" yAccessor={EMA26.yAccessor()} fill={EMA26.stroke()} />
						<EdgeIndicator itemType="first" orient="left"
							edgeAt="left" yAccessor={EMA12.yAccessor()} fill={EMA12.stroke()} />
					</EdgeContainer>
				</Chart>
				<Chart id={2} yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 300]}
						yExtents={[d => d.volume, VolumeSMA10.yAccessor()]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<HistogramSeries
						yAccessor={(d) => d.volume}
						fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"}
						opacity={0.5} />
					<AreaSeries opacity={0.5} yAccessor={VolumeSMA10.yAccessor()} stroke={VolumeSMA10.stroke()} fill={VolumeSMA10.stroke()}/>
					<CurrentCoordinate yAccessor={d => d.volume} stroke="#000000" />
					<CurrentCoordinate yAccessor={VolumeSMA10.yAccessor()} stroke={VolumeSMA10.stroke()} />
				</Chart>
				<Chart id={3} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}
						height={150} origin={(w, h) => [0, h - 150]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }}
						yExtents={[MACD.yAccessor()]}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={2}/>
					<MACDSeries />
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, -10]}/>
					<MovingAverageTooltip forChart={1} origin={[-38, 5]} calculator={[EMA12, EMA26}]} />
					<MACDTooltip forChart={3} origin={[-38, 15]} calculator={MACD}/>
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
