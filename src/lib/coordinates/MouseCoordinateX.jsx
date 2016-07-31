"use strict";

import React, { PropTypes, Component } from "react";

import { drawOnCanvas, renderSVG } from "./EdgeCoordinateV2";
import GenericComponent from "../GenericComponent";

import { isDefined, isNotDefined, shallowEqual } from "../utils";

class MouseCoordinateX extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var props = helper(this.props, this.context, moreProps);
		if (isNotDefined(props)) return null;

		drawOnCanvas(ctx, props)
	}
	renderSVG(moreProps) {
		var props = helper(this.props, this.context, moreProps);
		if (isNotDefined(props)) return null;

		return renderSVG(props)
	}
	render() {
		return <GenericComponent
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnMouseMove
			drawOnPan
			drawOnMouseExitOfCanvas
			/>
	}
}

MouseCoordinateX.propTypes = {
	displayFormat: PropTypes.func.isRequired,
};

MouseCoordinateX.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
	height: PropTypes.number.isRequired,
}

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

function helper(props, context, moreProps) {
	var { height, xAccessor, displayXAccessor } = context;
	var { show, currentCharts, currentItem, xScale, mouseXY } = moreProps;
	// var { chartConfig: { yScale, origin } } = moreProps;

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

/* function drawOnCanvas(canvasContext, props) {
	var { chartConfig, currentItem, xScale, mouseXY, currentCharts, show } = props;

	drawOnCanvasStatic(props, canvasContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem);
}

// mouseContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem
function drawOnCanvasStatic(props, ctx, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) {
	var { canvasOriginX, canvasOriginY } = props;

	var edgeProps = helper(props, xScale, chartConfig, mouseXY, currentItem);

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOriginX, canvasOriginY);

	EdgeCoordinate.drawOnCanvasStatic(ctx, edgeProps);

	ctx.restore();
} */

export default MouseCoordinateX;
