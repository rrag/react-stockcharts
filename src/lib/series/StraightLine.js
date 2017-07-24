"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { hexToRGBA, isDefined, isNotDefined, strokeDashTypes, getStrokeDasharray } from "../utils";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

class StraightLine extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const { type, stroke, strokeWidth, opacity, strokeDasharray } = this.props;
		const { yValue, xValue } = this.props;
		const { xScale } = moreProps;
		const { chartConfig: { yScale, width, height } } = moreProps;

		ctx.beginPath();

		ctx.strokeStyle = hexToRGBA(stroke, opacity);
		ctx.lineWidth = strokeWidth;

		const { x1, y1, x2, y2 } = getLineCoordinates(type, xScale, yScale, xValue, yValue, width, height);

		ctx.setLineDash(getStrokeDasharray(strokeDasharray).split(","));
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	render() {
		return <GenericChartComponent
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getAxisCanvas}
			drawOn={["pan"]}
		/>;
	}
	renderSVG(moreProps) {
		const { width, height } = moreProps;
		const { xScale, chartConfig: { yScale } } = moreProps;

		const { className } = this.props;
		const { type, stroke, strokeWidth, opacity, strokeDasharray } = this.props;
		const { yValue, xValue } = this.props;

		const lineCoordinates = getLineCoordinates(type, xScale, yScale, xValue, yValue, width, height);

		/*
		type === "horizontal"
			? { x1: xScale(first), y1: yScale(yValue), x2: xScale(last), y2: yScale(yValue) }
			: { x1: xScale(xValue), y1: yScale(0), x2: xScale(xValue), y2: yScale(height) };*/

		return (
			<line
				className={className}
				strokeDasharray={getStrokeDasharray(strokeDasharray)}
				stroke={stroke}
				strokeWidth={strokeWidth}
				opacity={opacity}
				{...lineCoordinates}
			/>
		);
	}
}

function getLineCoordinates(type, xScale, yScale, xValue, yValue, width, height) {
	return type === "horizontal"
		? { x1: 0, y1: yScale(yValue), x2: width, y2: yScale(yValue) }
		: { x1: xScale(xValue), y1: 0, x2: xScale(xValue), y2: height };
}

StraightLine.propTypes = {
	className: PropTypes.string,
	type: PropTypes.oneOf(["vertical", "horizontal"]),
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
	opacity: PropTypes.number.isRequired,
	yValue: function(props, propName/* , componentName */) {
		if (props.type === "vertical" && isDefined(props[propName])) return new Error("Do not define `yValue` when type is `vertical`, define the `xValue` prop");
		if (props.type === "horizontal" && isNotDefined(props[propName])) return new Error("when type = `horizontal` `yValue` is required");
		// if (isDefined(props[propName]) && typeof props[propName] !== "number") return new Error("prop `yValue` accepts a number");
	},
	xValue: function(props, propName/* , componentName */) {
		if (props.type === "horizontal" && isDefined(props[propName])) return new Error("Do not define `xValue` when type is `horizontal`, define the `yValue` prop");
		if (props.type === "vertical" && isNotDefined(props[propName])) return new Error("when type = `vertical` `xValue` is required");
		// if (isDefined(props[propName]) && typeof props[propName] !== "number") return new Error("prop `xValue` accepts a number");
	},
};

StraightLine.defaultProps = {
	className: "line ",
	type: "horizontal",
	stroke: "#000000",
	opacity: 0.5,
	strokeWidth: 1,
	strokeDasharray: "Solid",
};

export default StraightLine;
