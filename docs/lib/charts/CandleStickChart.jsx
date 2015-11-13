"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries } = ReStock;

var { CandlestickSeries } = ReStock.series;
var { XAxis, YAxis } = ReStock.axes;
var { fitWidth } = ReStock.helper;

class CandleStickChart extends React.Component {
	render() {
		var { type, width, data } = this.props;
		return (
			<ChartCanvas width={width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}}
				data={data.slice(0, 150)} type={type} >
				<Chart id={1} xAccessor={(d) => d.date}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" ticks={5} />
					<DataSeries id={0} yAccessor={CandlestickSeries.yAccessor} >
						<CandlestickSeries />
					</DataSeries>
				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChart.defaultProps = {
	type: "svg",
};
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
