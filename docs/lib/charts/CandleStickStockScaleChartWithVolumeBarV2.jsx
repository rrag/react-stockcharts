"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart } = ReStock;
var { CandlestickSeries, BarSeries } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { XAxis, YAxis } = ReStock.axes;

var { fitWidth } = ReStock.helper;

class CandleStickStockScaleChartWithVolumeBarV2 extends React.Component {
	render() {
		var { data, type, width } = this.props;
		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 50, right: 50, top:10, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1} yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<CandlestickSeries />
				</Chart>
				<Chart id={2} origin={(w, h) => [0, h - 150]} height={150} yExtents={d => d.volume}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickStockScaleChartWithVolumeBarV2.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickStockScaleChartWithVolumeBarV2.defaultProps = {
	type: "svg",
};
CandleStickStockScaleChartWithVolumeBarV2 = fitWidth(CandleStickStockScaleChartWithVolumeBarV2);

export default CandleStickStockScaleChartWithVolumeBarV2;
