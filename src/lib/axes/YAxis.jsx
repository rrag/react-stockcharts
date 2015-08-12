"use strict";

import React from "react";
import Axis from "./Axis";

class YAxis extends React.Component {
	render() {
		var { axisAt, tickFormat, ticks } = this.props;

		var range = this.context.yScale.range(), axisLocation;

		if (axisAt === "left") axisLocation = 0;
		else if (axisAt === "right") axisLocation = this.context.width;
		else if (axisAt === "middle") axisLocation = (this.context.width) / 2;
		else axisLocation = axisAt;

		if (this.context.isCompareSeries) {
			tickFormat = d3.format(".0%");
		}

		return (
			<Axis {...this.props}
				transform={`translate(${ axisLocation }, 0)`}
				tickFormat={tickFormat} ticks={[ticks]}
				scale={this.context.yScale} />
		);
	}
}

YAxis.propTypes = {
	axisAt: React.PropTypes.oneOfType([
				React.PropTypes.oneOf(["left", "right", "middle"])
				, React.PropTypes.number
			]).isRequired,
	orient: React.PropTypes.oneOf(["left", "right"]).isRequired,
	innerTickSize: React.PropTypes.number,
	outerTickSize: React.PropTypes.number,
	tickFormat: React.PropTypes.func,
	tickPadding: React.PropTypes.number,
	tickSize: React.PropTypes.number,
	ticks: React.PropTypes.number,
	tickValues: React.PropTypes.array,
	percentScale: React.PropTypes.bool,
	showTicks: React.PropTypes.bool,
	showDomain: React.PropTypes.bool,
	className: React.PropTypes.string,
};
YAxis.defaultProps = {
	namespace: "ReStock.YAxis",
	showGrid: false,
	showDomain: false,
	className: "react-stockcharts-y-axis",
};
YAxis.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	width: React.PropTypes.number.isRequired,
	isCompareSeries: React.PropTypes.bool.isRequired,
};

module.exports = YAxis;
