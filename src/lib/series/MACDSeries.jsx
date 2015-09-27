"use strict";

import React from "react";

import HistogramSeries from "./HistogramSeries";
import Line from "./Line";
import StraightLine from "./StraightLine";

import wrap from "./wrap";

const MACDSeries = (props) => {
	let { indicator, xScale, yScale, xAccessor, yAccessor, plotData, type } = props;
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
				stroke={options.stroke.histogram} fill={options.fill.histogram}
				yAccessor={(d) => yAccessor(d) && yAccessor(d).histogram} />
			{MACDSeries.getHorizontalLine(props)}
		</g>
	);
};

MACDSeries.getHorizontalLine = (props) => {
	let { xScale, yScale, xAccessor, yAccessor, plotData, type } = props;

	var first = xAccessor(plotData[0]);
	var last = xAccessor(plotData[plotData.length - 1]);

	return <StraightLine
		stroke="black" opacity={0.3} type={type}
		xScale={xScale} yScale={yScale}
		xAccessor={xAccessor} yAccessor={yAccessor}
		plotData={plotData}
		yValue={0} />;
};

MACDSeries.childContextTypes = {
	yAccessor: React.PropTypes.func.isRequired,
};

export default wrap(MACDSeries);
