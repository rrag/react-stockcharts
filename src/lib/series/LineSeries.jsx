"use strict";

import React from "react";
import d3 from "d3";
import Line from "./Line";

class LineSeries extends React.Component {
	render() {
		let { xScale, yScale, xAccessor, yAccessor, plotData, stroke, type } = this.context;

		return (
			<Line
				className={this.props.className}
				xScale={xScale} yScale={yScale}
				xAccessor={xAccessor} yAccessor={yAccessor}
				data={plotData}
				stroke={stroke} fill="none"
				type={type} />
		);
	}
}

LineSeries.propTypes = {
	className: React.PropTypes.string,
};

LineSeries.defaultProps = {
	namespace: "ReStock.LineSeries",
	className: "line "
};

LineSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	stroke: React.PropTypes.string,
	type: React.PropTypes.string,
};

module.exports = LineSeries;
