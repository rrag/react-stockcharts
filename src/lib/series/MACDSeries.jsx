"use strict";

import React from "react";

import HistogramSeries from "./HistogramSeries";
import Line from "./Line";
import StraightLine from "./StraightLine";

import wrap from "./wrap";

class MACDSeries extends React.Component {
	render() {
		var { props } = this;
		let { indicator, xScale, yScale, xAccessor, yAccessor, plotData, type, opacity, histogramStroke } = props;
		var options = indicator.options();

		return (
			<g className="macd-series">
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={(d) => yAccessor(d) && yAccessor(d).MACDLine}
					plotData={plotData}
					stroke={options.stroke.MACDLine} fill="none" 
					type={type} />
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={(d) => yAccessor(d) && yAccessor(d).signalLine}
					plotData={plotData}
					stroke={options.stroke.signalLine} fill="none"
					type={type} />
				<HistogramSeries
					baseAt={(xScale, yScale, d) => yScale(0)}
					className="macd-histogram"
					stroke={histogramStroke} fill={options.fill.histogram} opacity={opacity}
					yAccessor={(d) => yAccessor(d) && yAccessor(d).histogram} />
				{MACDSeries.getHorizontalLine(props)}
			</g>
		);
	}
}

MACDSeries.getHorizontalLine = (props) => {
	let { xScale, yScale, xAccessor, yAccessor, plotData, type, zeroLineStroke, zeroLineOpacity } = props;

	var first = xAccessor(plotData[0]);
	var last = xAccessor(plotData[plotData.length - 1]);

	return <StraightLine
		stroke={zeroLineStroke} opacity={zeroLineOpacity} type={type}
		xScale={xScale} yScale={yScale}
		xAccessor={xAccessor} yAccessor={yAccessor}
		plotData={plotData}
		yValue={0} />;
};

MACDSeries.childContextTypes = {
	yAccessor: React.PropTypes.func.isRequired,
};

MACDSeries.defaultProps = {
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 0.6,
	histogramStroke: false,
};

export default wrap(MACDSeries);
