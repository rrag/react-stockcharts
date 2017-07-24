"use strict";
import React from "react";
import PropTypes from "prop-types";

import LineSeries from "./LineSeries";
import AreaOnlySeries from "./AreaOnlySeries";

function AreaSeries(props) {
	const { yAccessor, baseAt } = props;
	const { className, opacity, stroke, strokeWidth, fill } = props;

	return (
		<g className={className}>
			<LineSeries
				yAccessor={yAccessor}
				stroke={stroke} fill="none"
				strokeWidth={strokeWidth}
				hoverHighlight={false} />
			<AreaOnlySeries
				yAccessor={yAccessor}
				base={baseAt}
				stroke="none" fill={fill}
				opacity={opacity} />
		</g>
	);
}

AreaSeries.propTypes = {
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number,
	fill: PropTypes.string.isRequired,
	opacity: PropTypes.number.isRequired,
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	baseAt: PropTypes.func,
};

AreaSeries.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-area"
};

export default AreaSeries;
