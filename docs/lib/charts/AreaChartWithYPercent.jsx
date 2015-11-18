"use strict";

import React from "react";
import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries } = ReStock;

var { AreaSeries } = ReStock.series;
var { XAxis, YAxis } = ReStock.axes;
var { fitWidth } = ReStock.helper;

class AreaChartWithYPercent extends React.Component {
	render() {
		var { data, type, width } = this.props;
		return (
			<ChartCanvas width={width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}}
				data={data} type={type}>
				<Chart id={0} xAccessor={(d) => d.date}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" />
					<YAxis axisAt="right" orient="right" percentScale={true} tickFormat={d3.format(".0%")}/>
					<DataSeries id={0} yAccessor={(d) => d.close} stroke="#4682B4" fill="#4682B4">
						<AreaSeries />
					</DataSeries>
				</Chart>
			</ChartCanvas>
		);
	}
};
AreaChartWithYPercent.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChartWithYPercent.defaultProps = {
	type: "svg",
};
AreaChartWithYPercent = fitWidth(AreaChartWithYPercent);


export default AreaChartWithYPercent;
