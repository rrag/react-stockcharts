"use strict";

import React from "react";
import d3 from "d3";
import Line from "./Line";

class CompareSeries extends React.Component {
	render() {
		var thisSeries = this.context.compareSeries.filter(each => each.id === this.props.id)[0];
		let { xScale, yScale, xAccessor, yAccessor, plotData, type } = this.context;
		return (
			<Line
				className={this.props.className}
				xScale={xScale} yScale={yScale}
				xAccessor={xAccessor} yAccessor={thisSeries.percentYAccessor}
				data={plotData}
				stroke={thisSeries.stroke} fill="none"
				type={type} />
		);
	}
}

CompareSeries.propTypes = {
	className: React.PropTypes.string,
	stroke: React.PropTypes.string,
	displayLabel: React.PropTypes.string.isRequired,
	id: React.PropTypes.number.isRequired,
};

CompareSeries.defaultProps = {
	namespace: "ReStock.CompareSeries",
	className: "line "
};

CompareSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	compareSeries: React.PropTypes.array.isRequired,
	type: React.PropTypes.string,
};

module.exports = CompareSeries;
