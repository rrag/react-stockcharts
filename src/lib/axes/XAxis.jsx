"use strict";

import React, { Component, PropTypes } from "react";
import Axis from "./Axis";

class XAxis extends Component {
	constructor(props, context) {
		super(props, context);
		this.axisZoomCallback = this.axisZoomCallback.bind(this);
	}
	axisZoomCallback(newXDomain) {
		var { xAxisZoom } = this.context;
		xAxisZoom(newXDomain);
	}
	render() {
		var { showTicks } = this.props;
		var moreProps = helper(this.props, this.context);

		return <Axis {...this.props} {...moreProps} x
			zoomEnabled={this.props.zoomEnabled && showTicks}
			axisZoomCallback={this.axisZoomCallback}
			zoomCursorClassName="react-stockcharts-ew-resize-cursor" />;
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
	zoomEnabled: PropTypes.bool.isRequired,
	onContextMenu: PropTypes.func,
	onDoubleClick: PropTypes.func,
};

XAxis.defaultProps = {
	showGrid: false,
	showTicks: true,
	showDomain: true,
	className: "react-stockcharts-x-axis",
	ticks: 10,
	outerTickSize: 0,
	fill: "none",
	stroke: "#000000",
	strokeWidth: 1,
	opacity: 1,
	domainClassName: "react-stockcharts-axis-domain",
	innerTickSize: 5,
	tickPadding: 6,
	tickStroke: "#000000",
	tickStrokeOpacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	xZoomHeight: 25,
	zoomEnabled: true,
	getMouseDelta: (startXY, mouseXY) => startXY[0] - mouseXY[0],
};

XAxis.contextTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	xAxisZoom: PropTypes.func.isRequired,
};

function helper(props, context) {
	var { axisAt, xZoomHeight, orient } = props;
	var { width, height } = context;

	var axisLocation, x = 0, w = width, h = xZoomHeight;

	if (axisAt === "top") axisLocation = 0;
	else if (axisAt === "bottom") axisLocation = height;
	else if (axisAt === "middle") axisLocation = (height) / 2;
	else axisLocation = axisAt;

	var y = (orient === "top") ? -xZoomHeight : 0;

	return {
		transform: [0, axisLocation],
		range: [0, width],
		getScale: moreProps => moreProps.xScale,
		bg: { x, y, h, w },
	};
}
export default XAxis;
