"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart } = ReStock;
var { CandlestickSeries, BarSeries } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { XAxis, YAxis } = ReStock.axes;

var { fitWidth } = ReStock.helper;

class CandleStickStockScaleChartWithVolumeBarV1 extends React.Component {
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
				<Chart id={2} yExtents={d => d.volume}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<BarSeries yAccessor={d => d.volume} />
				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickStockScaleChartWithVolumeBarV1.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickStockScaleChartWithVolumeBarV1.defaultProps = {
	type: "svg",
};
CandleStickStockScaleChartWithVolumeBarV1 = fitWidth(CandleStickStockScaleChartWithVolumeBarV1);

export default CandleStickStockScaleChartWithVolumeBarV1;
