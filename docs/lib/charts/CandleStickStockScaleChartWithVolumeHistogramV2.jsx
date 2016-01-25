"use strict";

import React from "react";
import d3 from "d3";

import * as ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries } = ReStock;
var { CandlestickSeries, HistogramSeries } = ReStock.series;
var { financeEODCalculator, intervalDWMCalculator } = ReStock.scale;

var { StockscaleTransformer } = ReStock.transforms;
var { XAxis, YAxis } = ReStock.axes;

var { fitWidth } = ReStock.helper;

class CandleStickStockScaleChartWithVolumeHistogramV2 extends React.Component {
	render() {
		var { data, type, width } = this.props;
		var eodDiscontiniousScaleHelper = financeEODCalculator()

		return (
			<ChartCanvas width={width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}}
				data={data} type={type}
				dataPreProcessor={eodDiscontiniousScaleHelper}
				calculator={[intervalDWMCalculator]}
				xAccessor={eodDiscontiniousScaleHelper.xAccessor()} xScale={eodDiscontiniousScaleHelper.scale()}
				xExtents={eodDiscontiniousScaleHelper.extents(new Date(2012, 0, 1), new Date(2012, 6, 2))}>
				<Chart id={1} yExtents={[d => d.high, d => d.low]}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<CandlestickSeries />
				</Chart>
				<Chart id={2} origin={(w, h) => [0, h - 150]} height={150} yExtents={d => d.volume}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<HistogramSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickStockScaleChartWithVolumeHistogramV2.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickStockScaleChartWithVolumeHistogramV2.defaultProps = {
	type: "svg",
};
CandleStickStockScaleChartWithVolumeHistogramV2 = fitWidth(CandleStickStockScaleChartWithVolumeHistogramV2);

export default CandleStickStockScaleChartWithVolumeHistogramV2;
