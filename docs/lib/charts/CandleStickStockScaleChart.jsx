'use strict';

import React from "react";
import d3 from "d3";

import * as ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries } = ReStock;

var { CandlestickSeries } = ReStock.series;
var { financeEODCalculator, intervalDWMCalculator } = ReStock.scale;
var { XAxis, YAxis } = ReStock.axes;
var { StockscaleTransformer } = ReStock.transforms;

var { fitWidth } = ReStock.helper;

class CandleStickStockScaleChart extends React.Component {
	render() {
		var { type, data, width } = this.props;
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
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" ticks={5} />
					<CandlestickSeries />
				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickStockScaleChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickStockScaleChart.defaultProps = {
	type: "svg",
};
CandleStickStockScaleChart = fitWidth(CandleStickStockScaleChart);

export default CandleStickStockScaleChart;

