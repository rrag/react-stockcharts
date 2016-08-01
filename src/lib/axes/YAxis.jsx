"use strict";

import React, { PropTypes } from "react";
import Axis from "./Axis";

function YAxis(props, context) {
	var moreProps = helper(props, context);
	return <Axis {...props} {...moreProps} />;
}

YAxis.propTypes = {
	axisAt: PropTypes.oneOfType([
		PropTypes.oneOf(["left", "right", "middle"]),
		PropTypes.number
	]).isRequired,
	orient: PropTypes.oneOf(["left", "right"]).isRequired,
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

YAxis.defaultProps = {
	showGrid: false,
	showTicks: true,
	showDomain: false,
	className: "react-stockcharts-y-axis",
	ticks: 10,
	outerTickSize: 0,
	domain: {
		className: "react-stockcharts-axis-domain",
		shapeRendering: "crispEdges",
		fill: "none",
		stroke: "#000000",
		strokeWidth: 1,
		opacity: 1,
	},
	innerTickSize: 5,
	tickPadding: 6,
	tickStroke: "#000000",
	tickStrokeOpacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
};

YAxis.contextTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

function helper(props, context) {
	var { axisAt } = props;
	var { width, height } = context;

	var axisLocation;
	if (axisAt === "left") axisLocation = 0;
	else if (axisAt === "right") axisLocation = width;
	else if (axisAt === "middle") axisLocation = (width) / 2;
	else axisLocation = axisAt;

	return {
		transform: [axisLocation, 0],
		range: [0, height],
		getScale: moreProps => moreProps.chartConfig.yScale,
	};
}
export default YAxis;