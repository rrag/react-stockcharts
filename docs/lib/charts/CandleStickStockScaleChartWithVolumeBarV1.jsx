"use strict";

import React from "react";
import PropTypes from 'prop-types';
import { format } from "d3-format";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from "react-stockcharts";


var { CandlestickSeries, BarSeries } = series;
var { discontinuousTimeScaleProvider } = scale;

var { XAxis, YAxis } = axes;

var { fitWidth } = helper;

class CandleStickStockScaleChartWithVolumeBarV1 extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;

		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
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
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")}/>
					<BarSeries yAccessor={d => d.volume} />
				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickStockScaleChartWithVolumeBarV1.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickStockScaleChartWithVolumeBarV1.defaultProps = {
	type: "svg",
};
CandleStickStockScaleChartWithVolumeBarV1 = fitWidth(CandleStickStockScaleChartWithVolumeBarV1);

export default CandleStickStockScaleChartWithVolumeBarV1;
