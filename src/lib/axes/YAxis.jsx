"use strict";

import React, { Component, PropTypes } from "react";
import Axis from "./Axis";

class YAxis extends Component {
	constructor(props, context) {
		super(props, context);
		this.axisZoomCallback = this.axisZoomCallback.bind(this);
	}
	axisZoomCallback(newXDomain, newYDomain) {
		var { chartId, yAxisZoom } = this.context;
		yAxisZoom(chartId, newYDomain);
	}
	render() {
		var moreProps = helper(this.props, this.context);
		return <Axis {...this.props} {...moreProps}
			axisZoomCallback={this.axisZoomCallback}
			zoomCursorClassName="react-stockcharts-ns-resize-cursor" />;
	}
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
	yZoomWidth: PropTypes.number,
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
	yZoomWidth: 40,
	zoomEnabled: true,
};

YAxis.contextTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	margin: PropTypes.object.isRequired,

	yAxisZoom: PropTypes.func.isRequired,
	chartId: PropTypes.number.isRequired,
};

function helper(props, context) {
	var { axisAt, yZoomWidth, orient } = props;
	var { width, height, margin } = context;

	var axisLocation, y = 0, w = yZoomWidth, h = height;

	if (axisAt === "left") {
		axisLocation = 0;
	} else if (axisAt === "right") {
		axisLocation = width;
	} else if (axisAt === "middle") {
		axisLocation = (width) / 2;
	} else {
		axisLocation = axisAt;
	}

	var x = (orient === "left") ? -yZoomWidth : 0;

	return {
		transform: [axisLocation, 0],
		range: [0, height],
		getScale: moreProps => moreProps.chartConfig.yScale,
		bg: { x, y, h, w },
	};
}
export default YAxis;