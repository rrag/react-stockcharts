"use strict";

import React from "react";
import Line from "./Line";

import wrap from "./wrap";

class LineSeries extends React.Component {
	render() {
		var { props } = this;
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
	}
}

LineSeries.propTypes = {
	className: React.PropTypes.string,
};

LineSeries.defaultProps = {
	stroke: "#4682B4",
	className: "line "
};

LineSeries.yAccessor = (d) => d.close;

export default wrap(LineSeries);
