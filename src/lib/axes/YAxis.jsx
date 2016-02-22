"use strict";

import React from "react";
import d3 from "d3";

import Axis from "./Axis";
import PureComponent from "../utils/PureComponent";

class YAxis extends PureComponent {
	render() {
		var { axisAt, tickFormat, ticks, percentScale, tickValues } = this.props;
		var { chartConfig } = this.context;
		var yScale = (percentScale) ? chartConfig.yScale.copy().domain([0, 1]) : chartConfig.yScale;

		tickValues = tickValues || chartConfig.yTicks;

		var axisLocation;

		if (axisAt === "left") axisLocation = 0;
		else if (axisAt === "right") axisLocation = this.context.width;
		else if (axisAt === "middle") axisLocation = (this.context.width) / 2;
		else axisLocation = axisAt;

		/*if (this.context.compareSeries.length > 0) {
			tickFormat = d3.format(".0%");
		}*/

		return (
			<Axis {...this.props}
				transform={[axisLocation, 0]}
				tickFormat={tickFormat} ticks={[ticks]} tickValues={tickValues}
				scale={yScale} />
		);
	}
}

YAxis.propTypes = {
	axisAt: React.PropTypes.oneOfType([
		React.PropTypes.oneOf(["left", "right", "middle"]),
		React.PropTypes.number
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
	showGrid: false,
	showDomain: false,
	className: "react-stockcharts-y-axis",
	ticks: 10,
};
YAxis.contextTypes = {
	chartConfig: React.PropTypes.object.isRequired,
	xScale: React.PropTypes.func.isRequired,
	width: React.PropTypes.number.isRequired,
};

export default YAxis;
