'use strict';

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";


var { ChartCanvas, Chart, DataSeries } = ReStock;

var { CandlestickSeries } = ReStock.series;
var { XAxis, YAxis } = ReStock.axes;
var { StockscaleTransformer } = ReStock.transforms;

var { fitWidth } = ReStock.helper;

class CandleStickStockScaleChart extends React.Component {
	render() {
		var { type, data, width } = this.props;

		return (
			<ChartCanvas width={width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}}
				dataTransform={[ { transform: StockscaleTransformer } ]}
				data={data.slice(0, 150)} type={type}>
				<Chart id={1} >
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={5} />
					<DataSeries id={0} yAccessor={CandlestickSeries.yAccessor} >
						<CandlestickSeries />
					</DataSeries>
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

