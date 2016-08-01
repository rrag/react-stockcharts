"use strict";

import React, { PropTypes } from "react";
import Axis from "./Axis";

function XAxis(props, context) {
	var moreProps = helper(props, context);
	return <Axis {...props} {...moreProps} />;
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
	showDomain: true,
	className: "react-stockcharts-x-axis",
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

XAxis.contextTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

function helper(props, context) {
	var { axisAt } = props;
	var { width } = context;

	var axisLocation;
	if (axisAt === "top") axisLocation = 0;
	else if (axisAt === "bottom") axisLocation = context.height;
	else if (axisAt === "middle") axisLocation = (context.height) / 2;
	else axisLocation = axisAt;

	return {
		transform: [0, axisLocation],
		range: [0, width],
		getScale: moreProps => moreProps.xScale,
	};
}
export default XAxis;
