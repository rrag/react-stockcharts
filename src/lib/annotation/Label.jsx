"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericComponent from "../GenericComponent";

import { isDefined, hexToRGBA, functor } from "../utils";
import LabelAnnotation, { defaultProps, helper } from "./LabelAnnotation";

class Label extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		drawOnCanvas2(ctx, this.props, this.context, moreProps);
	}
	render() {
		return <GenericComponent
			canvasToDraw={this.props.selectCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			/>;
	}
	renderSVG(moreProps) {
		var { chartConfig } = moreProps;

		return <LabelAnnotation yScale={getYScale(chartConfig)} {...this.props} text={getText(this.props)}/>;
	}
}

function getText(props) {
	return functor(props.text)(props);
}

function getYScale(chartConfig) {
	return Array.isArray(chartConfig) ? undefined : chartConfig.yScale;
}

Label.propTypes = {
	className: PropTypes.string,
	selectCanvas: PropTypes.func.isRequired,
	text: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func
	]).isRequired,
};

Label.contextTypes = {
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,

	margin: PropTypes.object.isRequired,
	ratio: PropTypes.number.isRequired,
};

Label.defaultProps = {
	...defaultProps,
	selectCanvas: canvases => canvases.bg,
};

function drawOnCanvas2(ctx, props, context, moreProps) {
	ctx.save();

	var { canvasOriginX, canvasOriginY, margin, ratio } = context;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.scale(ratio, ratio);


	if (isDefined(canvasOriginX))
		ctx.translate(canvasOriginX, canvasOriginY);
	else
		ctx.translate(margin.left + (0.5 * ratio), margin.top + (0.5 * ratio));

	drawOnCanvas(ctx, props, moreProps);

	ctx.restore();

}

function drawOnCanvas(ctx, props, moreProps) {
	var { textAnchor, fontFamily, fontSize, opacity, rotate } = props;
	var { xScale, chartConfig, xAccessor } = moreProps;

	var { xPos, yPos, fill, text } = helper(props, xAccessor, xScale, getYScale(chartConfig));

	var radians = (rotate / 180) * Math.PI;
	ctx.save();
	ctx.translate(xPos, yPos);
	ctx.rotate(radians);

	ctx.font = `${ fontSize }px ${ fontFamily }`;
	ctx.fillStyle = hexToRGBA(fill, opacity);
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	ctx.beginPath();
	ctx.fillText(text, 0, 0);
	ctx.restore();
}


export default Label;