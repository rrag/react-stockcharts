"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "ReStock";

var { ChartCanvas, Chart, DataSeries, CandlestickSeries } = ReStock;

var { XAxis, YAxis } = ReStock.axes;
var { ChartWidthMixin } = ReStock.helper;

var CandleStickChart = React.createClass({
	mixins: [ChartWidthMixin],
	propTypes: {
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	},
	render() {
		if (this.state === null || !this.state.width) return <div />;
		var { type } = this.props;
		var data = this.props.data.slice(0, 150);
		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}}
				data={data} type={type} >
				<Chart id={1} >
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" ticks={5} />
					<DataSeries yAccessor={CandlestickSeries.yAccessor} xAccessor={(d) => d.date}>
						<CandlestickSeries />
					</DataSeries>
				</Chart>
			</ChartCanvas>
		);
	}
});

export default CandleStickChart;
