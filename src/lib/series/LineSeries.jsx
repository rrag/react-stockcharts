"use strict";

import React from "react";
import Line from "./Line";

import wrap from "./wrap";

const LineSeries = (props) => {
	let { className, xScale, yScale, xAccessor, yAccessor, plotData, stroke, type } = props;
	return (
		<Line
			className={className}
			xScale={xScale} yScale={yScale}
			xAccessor={xAccessor} yAccessor={yAccessor}
			plotData={plotData}
			stroke={stroke} fill="none"
			type={type} />
	);
};

LineSeries.propTypes = {
	className: React.PropTypes.string,
};

LineSeries.defaultProps = {
	className: "line "
};

export default wrap(LineSeries);
