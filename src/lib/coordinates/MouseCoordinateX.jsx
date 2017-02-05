"use strict";

import React, { PropTypes, Component } from "react";

import { drawOnCanvas, renderSVG } from "./EdgeCoordinateV2";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

import { isNotDefined } from "../utils";

class MouseCoordinateX extends Component {
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
			svgDraw={this.renderSVG}
			clip={false}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getMouseCanvas}
			drawOn={["mousemove", "pan"/*  , "mouseleave"*/]}
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
	const { xAccessor, displayXAccessor } = moreProps;
	const { show, currentItem, xScale, mouseXY } = moreProps;
	const { chartConfig: { height } } = moreProps;

	if (isNotDefined(currentItem)) return null;

	const { snapX } = props;

	const { orient, at, rectWidth, rectHeight, displayFormat } = props;
	const { fill, opacity, fontFamily, fontSize, textFill } = props;

	const x = snapX ? xScale(xAccessor(currentItem)) : mouseXY[0];
	const edgeAt = (at === "bottom")
		? height
		: 0;

	const coordinate = snapX ? displayFormat(displayXAccessor(currentItem)) : displayFormat(xScale.invert(x));
	const type = "vertical";
	const y1 = 0, y2 = height;
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
		arrowWidth: 0,
		x1: x,
		x2: x,
		y1,
		y2
	};
	return coordinateProps;
}

export default MouseCoordinateX;
