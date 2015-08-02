"use strict";

import React from "react";
import Axis from "./Axis";

class XAxis extends React.Component {
	render() {
		var { axisAt, showTicks, tickFormat, ticks } = this.props;

		var range = this.context.yScale.range(), axisLocation;
		if (axisAt === "top") axisLocation = 0;
		else if (axisAt === "bottom") axisLocation = this.context.height;
		else if (axisAt === "middle") axisLocation = (this.context.height) / 2;
		else axisLocation = axisAt;

		if (tickFormat && this.context.xScale.isPolyLinear && this.context.xScale.isPolyLinear()) {
			console.warn("Cannot set tickFormat on a poly linear scale, ignoring tickFormat on XAxis");
			tickFormat = undefined;
		}

		if (ticks) ticks = [ticks];
		// console.log(axisAt, axisLocation);
		return (
			<g className="x axis" transform={`translate(0, ${ axisLocation })`}>
				<Axis {...this.props} showTicks={showTicks} tickFormat={tickFormat} ticks={ticks} scale={this.context.xScale} />
			</g>
		);
	}
}

XAxis.propTypes = {
	axisAt: React.PropTypes.oneOfType([
				React.PropTypes.oneOf(["top", "bottom", "middle"])
				, React.PropTypes.number
			]).isRequired,
	orient: React.PropTypes.oneOf(["top", "bottom"]).isRequired,
	innerTickSize: React.PropTypes.number,
	outerTickSize: React.PropTypes.number,
	tickFormat: React.PropTypes.func,
	tickPadding: React.PropTypes.number,
	tickSize: React.PropTypes.number,
	ticks: React.PropTypes.number,
	tickValues: React.PropTypes.array,
	showTicks: React.PropTypes.bool
};
XAxis.defaultProps = {
	namespace: "ReStock.XAxis",
	showGrid: false,
	showTicks: true,
};
XAxis.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	height: React.PropTypes.number.isRequired,
	width: React.PropTypes.number.isRequired,
};


module.exports = XAxis;
