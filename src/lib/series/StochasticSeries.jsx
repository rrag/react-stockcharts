"use strict";

import React from "react";

import wrap from "./wrap";

import Line from "./Line";
import StraightLine from "./StraightLine";

const StochasticSeries = (props) => {
	var { className, indicator, xScale, yScale, xAccessor, yAccessor, plotData, stroke, type } = props;
	var options = indicator.options();

	return (
		<g className={className}>
			<Line
				xScale={xScale} yScale={yScale}
				xAccessor={xAccessor} yAccessor={(d) => yAccessor(d) && yAccessor(d).D}
				plotData={plotData}
				stroke={options.stroke.D} fill="none" 
				type={type} />
			<Line
				xScale={xScale} yScale={yScale}
				xAccessor={xAccessor} yAccessor={(d) => yAccessor(d) && yAccessor(d).K}
				plotData={plotData}
				stroke={options.stroke.K} fill="none"
				type={type} />
			{StochasticSeries.getHorizontalLine(props, options.overSold, "brown")}
			{StochasticSeries.getHorizontalLine(props, 50, "black")}
			{StochasticSeries.getHorizontalLine(props, options.overBought, "brown")}
		</g>
	);
};

StochasticSeries.getHorizontalLine = (props, yValue, stroke) => {

	let { xScale, yScale, xAccessor, yAccessor, plotData, type } = props;

	return <StraightLine
		stroke={stroke} opacity={0.3} type={type}
		xScale={xScale} yScale={yScale}
		xAccessor={xAccessor} yAccessor={yAccessor}
		plotData={plotData}
		yValue={yValue} />;
};

StochasticSeries.propTypes = {
	className: React.PropTypes.string,
};

StochasticSeries.defaultProps = {
	className: "react-stockcharts-rsi-series"
};

export default wrap(StochasticSeries);
