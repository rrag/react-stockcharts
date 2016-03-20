"use strict";

import React, { PropTypes } from "react";
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
				range={[0, this.context.width]}
				transform={[0, axisLocation]}
				showTicks={showTicks} tickFormat={tickFormat} ticks={ticks}
				scale={this.context.xScale} />
		);
	}
}

XAxis.propTypes = {
	axisAt: PropTypes.oneOfType([
		PropTypes.oneOf(["top", "bottom", "middle"]),
		PropTypes.number
	]).isRequired,
	orient: PropTypes.oneOf(["top", "bottom"]).isRequired,
	innerTickSize: PropTypes.number,
	outerTickSize: PropTypes.number,
	tickFormat: PropTypes.func,
	tickPadding: PropTypes.number,
	tickSize: PropTypes.number,
	ticks: PropTypes.number,
	tickValues: PropTypes.array,
	showTicks: PropTypes.bool,
	className: PropTypes.string,
};
XAxis.defaultProps = {
	showGrid: false,
	showTicks: true,
	className: "react-stockcharts-x-axis",
	ticks: 10,
};

XAxis.contextTypes = {
	xScale: PropTypes.func.isRequired,
	chartConfig: PropTypes.object.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default XAxis;
