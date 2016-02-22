"use strict";

import React from "react";
import Axis from "./Axis";
import PureComponent from "../utils/PureComponent";

class XAxis extends PureComponent {
	render() {
		var { axisAt, showTicks, tickFormat, ticks } = this.props;

		var axisLocation;
		if (axisAt === "top") axisLocation = 0;
		else if (axisAt === "bottom") axisLocation = this.context.height;
		else if (axisAt === "middle") axisLocation = (this.context.height) / 2;
		else axisLocation = axisAt;

		if (tickFormat && this.context.xScale.isPolyLinear && this.context.xScale.isPolyLinear()) {
			console.warn("Cannot set tickFormat on a poly linear scale, ignoring tickFormat on XAxis");
			tickFormat = undefined;
		}

		if (ticks) ticks = [ticks];
		return (
			<Axis {...this.props}
				transform={[0, axisLocation]}
				showTicks={showTicks} tickFormat={tickFormat} ticks={ticks}
				scale={this.context.xScale} />
		);
	}
}

XAxis.propTypes = {
	axisAt: React.PropTypes.oneOfType([
		React.PropTypes.oneOf(["top", "bottom", "middle"]),
		React.PropTypes.number
	]).isRequired,
	orient: React.PropTypes.oneOf(["top", "bottom"]).isRequired,
	innerTickSize: React.PropTypes.number,
	outerTickSize: React.PropTypes.number,
	tickFormat: React.PropTypes.func,
	tickPadding: React.PropTypes.number,
	tickSize: React.PropTypes.number,
	ticks: React.PropTypes.number,
	tickValues: React.PropTypes.array,
	showTicks: React.PropTypes.bool,
	className: React.PropTypes.string,
};
XAxis.defaultProps = {
	showGrid: false,
	showTicks: true,
	className: "react-stockcharts-x-axis",
	ticks: 10,
};

XAxis.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	chartConfig: React.PropTypes.object.isRequired,
	height: React.PropTypes.number.isRequired,
	width: React.PropTypes.number.isRequired,
};

export default XAxis;
