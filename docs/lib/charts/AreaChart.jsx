"use strict";

import React from "react";
import ReStock from "ReStock";

var { ChartCanvas, Chart, DataSeries } = ReStock;

var { AreaSeries } = ReStock.series;
var { XAxis, YAxis } = ReStock.axes;
var { ChartWidthMixin } = ReStock.helper;

var AreaChart = React.createClass({
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
				margin={{left: 50, right: 50, top:10, bottom: 30}}
				data={data} type={type}>
				<Chart id={0} xAccessor={(d) => d.date}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" />
					<DataSeries id={0} yAccessor={(d) => d.close} >
						<AreaSeries />
					</DataSeries>
				</Chart>
			</ChartCanvas>
		);
	}
});

export default AreaChart;