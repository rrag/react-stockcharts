"use strict";

import React, { Component, PropTypes } from "react";
import { format } from "d3-format";

import { drawOnCanvas, renderSVG } from "./EdgeCoordinateV2";
import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";

import { first, last, isDefined, functor } from "../utils";

class EdgeIndicator extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var edge = helper(this.props, this.context, moreProps);
		var props = {
			...this.props,
			...edge,
		};
		drawOnCanvas(ctx, props);
	}
	renderSVG(moreProps) {
		var edge = helper(this.props, this.context, moreProps);
		var props = {
			...this.props,
			...edge,
		};
		return renderSVG(props);
	}
	render() {
		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			edgeClip
			clip={false}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnPan
			/>;
	}
}

EdgeIndicator.propTypes = {
	yAccessor: PropTypes.func,

	type: PropTypes.oneOf(["horizontal"]).isRequired,
	className: PropTypes.string,
	fill: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]).isRequired,
	textFill: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]).isRequired,
	itemType: PropTypes.oneOf(["first", "last"]).isRequired,
	orient: PropTypes.oneOf(["left", "right"]),
	edgeAt: PropTypes.oneOf(["left", "right"]),
	displayFormat: PropTypes.func.isRequired,
	rectHeight: PropTypes.number.isRequired,
	rectWidth: PropTypes.number.isRequired,
	arrowWidth: PropTypes.number.isRequired,
};
EdgeIndicator.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
};

EdgeIndicator.defaultProps = {
	className: "react-stockcharts-edgeindicator",

	type: "horizontal",
	orient: "left",
	edgeAt: "left",
	textFill: "#FFFFFF",
	displayFormat: format(".2f"),
	yAxisPad: 0,
	rectHeight: 20,
	rectWidth: 50,
	arrowWidth: 10,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	dx: 0,
	hideLine: false,
	fill: "#8a8a8a",
	opacity: 1,
	lineStroke: "#000000",
	lineOpacity: 0.3,
};

function helper(props, context, moreProps) {
	var { type: edgeType, displayFormat, itemType, edgeAt, yAxisPad, orient } = props;
	var { yAccessor, fill, textFill, rectHeight, rectWidth, arrowWidth } = props;
	var { fontFamily, fontSize } = props;
	var { xAccessor } = context;

	var { xScale, chartConfig: { yScale }, plotData } = moreProps;

	// var currentItem = ChartDataUtil.getCurrentItemForChartNew(currentItems, forChart);
	var edge = null;
	// console.log(chartData.config.compareSeries.length);

	var item = (itemType === "first" ? first(plotData, yAccessor) : last(plotData, yAccessor));

	if (isDefined(item)) {
		var yValue = yAccessor(item),
			xValue = xAccessor(item);

		var x1 = Math.round(xScale(xValue)),
			y1 = Math.round(yScale(yValue));

		var [left, right] = xScale.range();
		var edgeX = edgeAt === "left"
				? left - yAxisPad
				: right + yAxisPad;

		edge = {
			// ...props,
			coordinate: displayFormat(yValue),
			show: true,
			type: edgeType,
			orient,
			edgeAt: edgeX,
			fill: functor(fill)(item),
			fontFamily, fontSize,
			textFill: functor(textFill)(item),
			rectHeight, rectWidth, arrowWidth,
			x1,
			y1,
			x2: edgeX,
			y2: y1,
		};
	}
	return edge;
}

export default EdgeIndicator;
