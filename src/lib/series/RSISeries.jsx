"use strict";

import React from "react";
import Line from "./Line";
import StraightLine from "./StraightLine";
import wrap from "./wrap";

const RSISeries = (props) => {
	let { className, indicator, xScale, yScale, xAccessor, yAccessor, plotData, stroke, type } = props;
	var options = indicator.options();
	return (
		<g className={className}>
			<Line
				className={className}
				xScale={xScale} yScale={yScale}
				xAccessor={xAccessor} yAccessor={yAccessor}
				plotData={plotData}
				stroke={stroke} fill="none"
				type={type} />
			{RSISeries.getHorizontalLine(props, options.overSold, "brown")}
			{RSISeries.getHorizontalLine(props, 50, "black")}
			{RSISeries.getHorizontalLine(props, options.overBought, "brown")}
		</g>
	);
};

RSISeries.getHorizontalLine = (props, yValue, stroke) => {
	let { xScale, yScale, xAccessor, yAccessor, plotData, type } = props;

	return <StraightLine
		stroke={stroke} opacity={0.3} type={type}
		xScale={xScale} yScale={yScale}
		xAccessor={xAccessor} yAccessor={yAccessor}
		plotData={plotData}
		yValue={yValue} />;
};

RSISeries.propTypes = {
	className: React.PropTypes.string,
};

RSISeries.defaultProps = {
	className: "react-stockcharts-rsi-series"
};

export default wrap(RSISeries);
