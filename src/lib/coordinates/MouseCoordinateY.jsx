"use strict";

import React, { PropTypes, Component } from "react";

import { drawOnCanvas, renderSVG } from "./EdgeCoordinateV2";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

import { isNotDefined } from "../utils";

class MouseCoordinateY extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const props = helper(this.props, moreProps);
		if (isNotDefined(props)) return null;

		drawOnCanvas(ctx, props);
	}
	renderSVG(moreProps) {
		const props = helper(this.props, moreProps);
		if (isNotDefined(props)) return null;

		return renderSVG(props);
	}
	render() {
		return <GenericChartComponent
			clip={false}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getMouseCanvas}
			drawOn={["mousemove", "pan"/*  , "mouseleave"*/]}
			/>;
	}
}

MouseCoordinateY.propTypes = {
	displayFormat: PropTypes.func.isRequired,
};

MouseCoordinateY.defaultProps = {
	yAxisPad: 0,
	rectWidth: 50,
	rectHeight: 20,
	orient: "left",
	at: "left",
	dx: 0,
	arrowWidth: 10,
	fill: "#525252",
	opacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",
};

function helper(props, moreProps) {
	const { chartId, width } = moreProps;
	const { show, currentCharts, chartConfig: { yScale, origin }, mouseXY } = moreProps;

	if (isNotDefined(mouseXY)) return null;

	if (currentCharts.indexOf(chartId) < 0) return null;

	const { orient, at, rectWidth, rectHeight, displayFormat, dx } = props;
	const { fill, opacity, fontFamily, fontSize, textFill, arrowWidth } = props;

	const x1 = 0, x2 = width;
	const edgeAt = (at === "right")
		? width
		: 0;

	const type = "horizontal";
	const y = mouseXY[1] - origin[1];
	const coordinate = displayFormat(yScale.invert(y));
	const hideLine = true;

	const coordinateProps = {
		coordinate,
		show,
		type,
		orient,
		edgeAt,
		hideLine,
		fill, opacity, fontFamily, fontSize, textFill,
		rectWidth,
		rectHeight,
		arrowWidth,
		dx,
		x1,
		x2,
		y1: y,
		y2: y,
	};
	return coordinateProps;
}

export default MouseCoordinateY;
