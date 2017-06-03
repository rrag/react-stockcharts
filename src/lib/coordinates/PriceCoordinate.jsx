"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { drawOnCanvas, renderSVG } from "./EdgeCoordinateV2";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

import { isNotDefined } from "../utils";

class PriceCoordinate extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}

	componentDidMount() {
		// This is needed to trigger the render code before any mouse movements
		// to force the marker to show the instant the chart is loaded. Otherwise,
		// it will only appear when it detects mouse movement.
		this.refs.genericChartComponent.draw({trigger:"pan", force:true});
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
			ref="genericChartComponent"
			clip={false}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getMouseCanvas}
			drawOn={["mousemove","pan"/*  , "mouseleave"*/]}
			/>;
	}
}

PriceCoordinate.propTypes = {
	displayFormat: PropTypes.func.isRequired,
};

PriceCoordinate.defaultProps = {
	yAxisPad: 0,
	rectWidth: 50,
	rectHeight: 20,
	orient: "left",
	at: "left",
	price: 0,
	dx: 0,
	arrowWidth: 0,
	fill: "#BAB8b8",
	opacity: 1,
  lineOpacity: 0.2,
	lineStroke: "#000000",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",
};

function helper(props, moreProps) {
	const { chartId, width } = moreProps;
	var { show, chartConfig: { yScale, origin } } = moreProps;
	const lowerPrice = yScale.domain()[0];
	const upperPrice = yScale.domain()[1];
	const lowerYValue = yScale.range()[0]
	const upperYValue = yScale.range()[1];
	const rangeSlope = (lowerPrice - upperPrice) / (lowerYValue - upperYValue);

	const { orient, at, rectWidth, rectHeight, displayFormat, dx, price } = props;
	const { fill, opacity, fontFamily, fontSize, textFill, arrowWidth, lineOpacity, lineStroke} = props;

	const x1 = 0, x2 = width;
	const edgeAt = (at === "right")
		? width
		: 0;

	const type = "horizontal";
	const priceShowTolerance = 5;
	var y = 0

	if(price < (upperPrice + priceShowTolerance) || price > (lowerPrice - priceShowTolerance)){
		y = (price / rangeSlope) + (lowerYValue - (lowerPrice / rangeSlope));
		show = true;
	}
	else{
		show = false;
	}

	const coordinate = displayFormat(yScale.invert(y));
	const hideLine = false;

	const coordinateProps = {
		coordinate,
		show,
		type,
		orient,
		edgeAt,
		hideLine,
		lineOpacity,
		lineStroke,
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

export default PriceCoordinate;
