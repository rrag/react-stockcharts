"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";

import { drawOnCanvas, renderSVG } from "./EdgeCoordinateV3";
import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { first, last, isDefined, functor, noop, strokeDashTypes } from "../utils";

class EdgeIndicator extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const edge = helper(this.props, moreProps);
		const props = {
			...this.props,
			...edge,
		};
		drawOnCanvas(ctx, props);
	}
	renderSVG(moreProps) {
		const edge = helper(this.props, moreProps);
		const props = {
			...this.props,
			...edge,
		};
		return renderSVG(props);
	}
	render() {
		return <GenericChartComponent
			edgeClip
			clip={false}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getAxisCanvas}
			drawOn={["pan"]}
		/>;
	}
}

EdgeIndicator.propTypes = {
	yAccessor: PropTypes.func,

	type: PropTypes.oneOf(["horizontal"]),
	className: PropTypes.string,
	fill: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	textFill: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	itemType: PropTypes.oneOf(["first", "last"]).isRequired,
	orient: PropTypes.oneOf(["left", "right"]),
	edgeAt: PropTypes.oneOf(["left", "right"]),
	displayFormat: PropTypes.func,
	rectHeight: PropTypes.number,
	rectWidth: PropTypes.number,
	arrowWidth: PropTypes.number,
	lineStrokeDasharray: PropTypes.oneOf(strokeDashTypes),
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

	stroke: noop,
	strokeOpacity: 1,
	strokeWidth: 3,
	lineStroke: "#000000",
	lineOpacity: 0.3,
	lineStrokeDasharray: "ShortDash",
};

function helper(props, moreProps) {
	const { itemType, yAccessor } = props;
	const { plotData } = moreProps;

	const item = itemType === "first"
		? first(plotData, yAccessor)
		: last(plotData, yAccessor);

	// var currentItem = ChartDataUtil.getCurrentItemForChartNew(currentItems, forChart);
	const edge = isDefined(item)
		? getEdge(props, moreProps, item)
		: null;

	return edge;
}

function getEdge(props, moreProps, item) {
	const { type: edgeType, displayFormat, edgeAt, yAxisPad, orient } = props;

	const { yAccessor, fill, textFill, rectHeight, rectWidth, arrowWidth } = props;
	const { fontFamily, fontSize } = props;
	const { stroke } = props;

	const { xScale, chartConfig: { yScale }, xAccessor, width } = moreProps;

	const yValue = yAccessor(item),
		xValue = xAccessor(item);

	const x1 = Math.round(xScale(xValue)),
		y1 = Math.round(yScale(yValue));

	const [left, right] = [0, width];
	const edgeX = edgeAt === "left"
		? left - yAxisPad
		: right + yAxisPad;

	return {
		// ...props,
		coordinate: displayFormat(yValue),
		show: true,
		type: edgeType,
		orient,
		edgeAt: edgeX,
		fill: functor(fill)(item),
		stroke: functor(stroke)(item),
		fontFamily, fontSize,
		textFill: functor(textFill)(item),
		rectHeight, rectWidth, arrowWidth,
		x1,
		y1,
		x2: right,
		y2: y1,
	};
}

export default EdgeIndicator;
