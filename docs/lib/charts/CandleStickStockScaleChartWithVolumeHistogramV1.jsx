"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "ReStock";

var { ChartCanvas, Chart, DataSeries } = ReStock;
var { CandlestickSeries, HistogramSeries } = ReStock;

var { StockscaleTransformer } = ReStock.transforms;
var { XAxis, YAxis } = ReStock.axes;
var { ChartWidthMixin } = ReStock.helper;

var CandleStickStockScaleChartWithVolumeHistogramV1 = React.createClass({
	mixins: [ChartWidthMixin],
	propTypes: {
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	},
	render() {
		if (this.state === null || !this.state.width) return <div />;
		var { data, type } = this.props;

		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}} initialDisplay={100}
				dataTransform={[ { transform: StockscaleTransformer } ]}
				data={data} type={type}>
				<Chart id={1} >
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<DataSeries yAccessor={CandlestickSeries.yAccessor} >
						<CandlestickSeries />
					</DataSeries>
				</Chart>
				<Chart id={2}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<DataSeries yAccessor={(d) => d.volume} >
						<HistogramSeries />
					</DataSeries>
				</Chart>
			</ChartCanvas>
		);
	}
});
export default CandleStickStockScaleChartWithVolumeHistogramV1;
