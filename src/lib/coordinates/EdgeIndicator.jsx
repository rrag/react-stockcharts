"use strict";

import React, { Component, PropTypes } from "react";
import { format } from "d3-format";

import { drawOnCanvas, renderSVG } from "./EdgeCoordinateV2";
import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { first, last, isDefined, functor } from "../utils";

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

	const { xScale, chartConfig: { yScale }, xAccessor } = moreProps;

	const yValue = yAccessor(item),
		xValue = xAccessor(item);

	const x1 = Math.round(xScale(xValue)),
		y1 = Math.round(yScale(yValue));

	const [left, right] = xScale.range();
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
		fontFamily, fontSize,
		textFill: functor(textFill)(item),
		rectHeight, rectWidth, arrowWidth,
		x1,
		y1,
		x2: edgeX,
		y2: y1,
	};
}

export default EdgeIndicator;
