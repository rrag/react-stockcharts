"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import Axis from "./Axis";

class XAxis extends Component {
	constructor(props, context) {
		super(props, context);
		this.axisZoomCallback = this.axisZoomCallback.bind(this);
	}
	axisZoomCallback(newXDomain) {
		const { xAxisZoom } = this.context;
		xAxisZoom(newXDomain);
	}
	render() {
		const { showTicks } = this.props;
		const moreProps = helper(this.props, this.context);

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
	zoomEnabled: PropTypes.bool,
	onContextMenu: PropTypes.func,
	onDoubleClick: PropTypes.func,
};

XAxis.defaultProps = {
	showTicks: true,
	showTickLabel: true,
	showDomain: true,
	className: "react-stockcharts-x-axis",
	ticks: 10,
	outerTickSize: 0,
	fill: "none",
	stroke: "#000000", // x axis stroke coloe
	strokeWidth: 1,
	opacity: 1, // x axis opacity
	domainClassName: "react-stockcharts-axis-domain",
	innerTickSize: 5,
	tickPadding: 6,
	tickStroke: "#000000", // tick/grid stroke
	tickStrokeOpacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fontWeight: 400,
	xZoomHeight: 25,
	zoomEnabled: true,
	getMouseDelta: (startXY, mouseXY) => startXY[0] - mouseXY[0],
};

XAxis.contextTypes = {
	chartConfig: PropTypes.object.isRequired,
	xAxisZoom: PropTypes.func.isRequired,
};

function helper(props, context) {
	const { axisAt, xZoomHeight, orient } = props;
	const { chartConfig: { width, height } } = context;

	let axisLocation;
	const x = 0, w = width, h = xZoomHeight;

	if (axisAt === "top") axisLocation = 0;
	else if (axisAt === "bottom") axisLocation = height;
	else if (axisAt === "middle") axisLocation = (height) / 2;
	else axisLocation = axisAt;

	const y = (orient === "top") ? -xZoomHeight : 0;

	return {
		transform: [0, axisLocation],
		range: [0, width],
		getScale: getXScale,
		bg: { x, y, h, w },
	};
}

function getXScale(moreProps) {
	const { xScale: scale, width } = moreProps;

	if (scale.invert) {
		const trueRange = [0, width];
		const trueDomain = trueRange.map(scale.invert);
		return scale.copy()
			.domain(trueDomain)
			.range(trueRange);
	}

	return scale;
}


export default XAxis;
