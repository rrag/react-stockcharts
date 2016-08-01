"use strict";

import React, { PropTypes, Component } from "react";

import { drawOnCanvas, renderSVG } from "./EdgeCoordinateV2";
import GenericChartComponent from "../GenericChartComponent";

import { isNotDefined } from "../utils";

class MouseCoordinateY extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var props = helper(this.props, this.context, moreProps);
		if (isNotDefined(props)) return null;

		drawOnCanvas(ctx, props);
	}
	renderSVG(moreProps) {
		var props = helper(this.props, this.context, moreProps);
		if (isNotDefined(props)) return null;

		return renderSVG(props);
	}
	render() {
		return <GenericChartComponent
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			clip={false}
			drawOnMouseMove
			drawOnPan
			drawOnMouseExitOfCanvas
			/>;
	}
}

MouseCoordinateY.propTypes = {
	displayFormat: PropTypes.func.isRequired,
};

MouseCoordinateY.contextTypes = {
	width: PropTypes.number.isRequired,
	// height: PropTypes.number.isRequired,
	// margin: PropTypes.object.isRequired,
	chartId: PropTypes.number.isRequired,
};

MouseCoordinateY.defaultProps = {
	yAxisPad: 0,
	rectWidth: 50,
	rectHeight: 20,
	orient: "left",
	at: "left",
	arrowWidth: 10,
	fill: "#525252",
	opacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",
};

function helper(props, context, moreProps) {
	var { chartId, width } = context;
	var { show, currentCharts, chartConfig: { yScale, origin }, mouseXY } = moreProps;

	if (isNotDefined(mouseXY)) return null;

	if (currentCharts.indexOf(chartId) < 0) return null;

	var { orient, at, rectWidth, rectHeight, displayFormat } = props;
	var { fill, opacity, fontFamily, fontSize, textFill, arrowWidth } = props;

	var x1 = 0, x2 = width;
	var edgeAt = (at === "right")
		? width
		: 0;

	var type = "horizontal";
	var y = mouseXY[1] - origin[1];
	var coordinate = displayFormat(yScale.invert(y));
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
		arrowWidth,
		x1,
		x2,
		y1: y,
		y2: y,
	};
	return coordinateProps;
}

/* function drawOnCanvas(canvasContext, props) {
	var { chartConfig, currentItem, xScale, mouseXY, show, currentCharts } = props;

	drawOnCanvasStatic(props, canvasContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem);
}

// mouseContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem
function drawOnCanvasStatic(props, ctx, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) {
	var { canvasOriginX, canvasOriginY } = props;

	var edgeProps = helper(props, xScale, chartConfig, mouseXY, currentCharts, currentItem);

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOriginX, canvasOriginY);

	EdgeCoordinate.drawOnCanvasStatic(ctx, edgeProps);

	ctx.restore();
}
*/
export default MouseCoordinateY;
