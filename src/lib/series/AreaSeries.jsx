"use strict";

import React from "react";

import Line from "./Line";
import Area from "./Area";

import wrap from "./wrap";

const AreaSeries = (props) => {
	let { className, xScale, yScale, xAccessor, yAccessor, plotData, type, stroke, fill, defaultStroke } = props;

	let { opacity } = props;

	return (
		<g>
			<Line
				className={className}
				xScale={xScale} yScale={yScale}
				xAccessor={xAccessor} yAccessor={yAccessor}
				plotData={plotData}
				stroke={stroke} fill="none"
				type={type} />
			<Area
				className={className}
				xScale={xScale} yScale={yScale}
				xAccessor={xAccessor} yAccessor={yAccessor}
				plotData={plotData}
				stroke="none" fill={fill} opacity={opacity}
				type={type} />
		</g>
	);
};

AreaSeries.propTypes = {
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string.isRequired,
	opacity: React.PropTypes.number.isRequired,
	className: React.PropTypes.string,
};

AreaSeries.defaultProps = {
	stroke: "steelblue",
	opacity: 0.5,
	fill: "steelblue",
};

export default wrap(AreaSeries);
