"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import Axis from "./Axis";

class YAxis extends Component {
	constructor(props, context) {
		super(props, context);
		this.axisZoomCallback = this.axisZoomCallback.bind(this);
		this.axisResetZoom = this.axisResetZoom.bind(this);
	}
	axisZoomCallback(newYDomain) {
		const { chartId, yAxisZoom } = this.context;
		yAxisZoom(chartId, newYDomain);
	}
	axisResetZoom(chartCanvas, chartId){
		chartCanvas.resetYDomain(chartId);
	}
	render() {
		const { zoomEnabled, ...moreProps } = helper(this.props, this.context);
		return <Axis {...this.props} {...moreProps}
			zoomEnabled={this.props.zoomEnabled && zoomEnabled}
			edgeClip
			axisZoomCallback={this.axisZoomCallback}
			axisResetZoom={this.axisResetZoom}
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
	zoomEnabled: PropTypes.bool.isRequired,
	onContextMenu: PropTypes.func,
	onDoubleClick: PropTypes.func,
};

YAxis.defaultProps = {
	showGrid: false,
	showTicks: true,
	showDomain: true,
	className: "react-stockcharts-y-axis",
	ticks: 10,
	outerTickSize: 0,
	domainClassName: "react-stockcharts-axis-domain",
	fill: "none",
	stroke: "#FFFFFF",
	strokeWidth: 1,
	opacity: 1,
	innerTickSize: 5,
	tickPadding: 6,
	tickStroke: "#000000",
	tickStrokeOpacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	yZoomWidth: 40,
	zoomEnabled: true,
	getMouseDelta: (startXY, mouseXY) => startXY[1] - mouseXY[1],
};

YAxis.contextTypes = {
	yAxisZoom: PropTypes.func.isRequired,
	chartId: PropTypes.number.isRequired,
	chartConfig: PropTypes.object.isRequired,
};

function helper(props, context) {
	const { axisAt, yZoomWidth, orient } = props;
	const { chartConfig: { width, height } } = context;

	let axisLocation;
	const y = 0, w = yZoomWidth, h = height;

	if (axisAt === "left") {
		axisLocation = 0;
	} else if (axisAt === "right") {
		axisLocation = width;
	} else if (axisAt === "middle") {
		axisLocation = (width) / 2;
	} else {
		axisLocation = axisAt;
	}

	const x = (orient === "left") ? -yZoomWidth : 0;

	return {
		transform: [axisLocation, 0],
		range: [0, height],
		getScale: moreProps => moreProps.chartConfig.yScale,
		bg: { x, y, h, w },
		zoomEnabled: context.chartConfig.yPan,
	};
}
export default YAxis;
