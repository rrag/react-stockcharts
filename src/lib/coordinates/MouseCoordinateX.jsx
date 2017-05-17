"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { drawOnCanvas, renderSVG } from "./EdgeCoordinateV2";
import GenericChartComponent from "../GenericChartComponent";

import { isNotDefined } from "../utils";

class MouseCoordinateX extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var props = helper(this.props, moreProps);
		if (isNotDefined(props)) return null;

		drawOnCanvas(ctx, props);
	}
	renderSVG(moreProps) {
		var props = helper(this.props, moreProps);
		if (isNotDefined(props)) return null;

		return renderSVG(props);
	}
	render() {
		return <GenericChartComponent
			svgDraw={this.renderSVG}
			clip={false}
			canvasDraw={this.drawOnCanvas}
			drawOnMouseMove
			drawOnPan
			drawOnMouseExitOfCanvas
			/>;
	}
}

MouseCoordinateX.propTypes = {
	displayFormat: PropTypes.func.isRequired,
};


MouseCoordinateX.defaultProps = {
	yAxisPad: 0,
	rectWidth: 80,
	rectHeight: 20,
	orient: "bottom",
	at: "bottom",

	fill: "#525252",
	opacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",
	snapX: true,
};

function helper(props, moreProps) {
	var { xAccessor, displayXAccessor } = moreProps;
	var { show, currentItem, xScale, mouseXY } = moreProps;
	var { chartConfig: { height } } = moreProps;

	if (isNotDefined(currentItem)) return null;

	var { snapX } = props;

	var { orient, at, rectWidth, rectHeight, displayFormat } = props;
	var { fill, opacity, fontFamily, fontSize, textFill } = props;

	var x = snapX ? xScale(xAccessor(currentItem)) : mouseXY[0];
	var edgeAt = (at === "bottom")
		? height
		: 0;

	var coordinate = snapX ? displayFormat(displayXAccessor(currentItem)) : displayFormat(xScale.invert(x));
	var type = "vertical";
	var y1 = 0, y2 = height;
	var hideLine = true;

	var coordinateProps = {
		coordinate,
		show,
		type,
		orient,
		edgeAt,
		hideLine,
		fill, opacity, fontFamily, fontSize, textFill,
		rectWidth,
		rectHeight,
		arrowWidth: 0,
		x1: x,
		x2: x,
		y1,
		y2
	};
	return coordinateProps;
}

export default MouseCoordinateX;
