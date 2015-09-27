"use strict";

import React from "react";
import Line from "./Line";

import wrap from "./wrap";

const CompareSeries = (props) => {

	let { className, compareSeries, xScale, yScale, xAccessor, plotData, type, id } = props;

	var thisSeries = compareSeries.filter(each => each.id === id)[0];
	return (
		<Line
			className={className}
			xScale={xScale} yScale={yScale}
			xAccessor={xAccessor} yAccessor={thisSeries.percentYAccessor}
			plotData={plotData}
			stroke={thisSeries.stroke} fill="none"
			type={type} />
	);
};

CompareSeries.propTypes = {
	className: React.PropTypes.string,
	stroke: React.PropTypes.string,
	displayLabel: React.PropTypes.string.isRequired,
	id: React.PropTypes.number.isRequired,
};

CompareSeries.defaultProps = {
	className: "line "
};

export default wrap(CompareSeries);
