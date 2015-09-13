"use strict";

import React from "react";
import BaseSimpleCanvasSeries from "./BaseSimpleCanvasSeries";

class StraightLine extends BaseSimpleCanvasSeries {
	constructor(props) {
		super(props);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas() {
		var { canvasOrigin, canvasContext } = this.context;
		var { plotData, xScale, yScale } = this.props;

		this.drawOnCanvasStatic(this.props, canvasOrigin, canvasContext, xScale, yScale, plotData);
	}
	drawOnCanvasStatic(props, canvasOrigin, ctx, xScale, yScale, plotData) {

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(canvasOrigin[0], canvasOrigin[1]);

		var { type, stroke, fill, className, opacity } = props;
		var { xAccessor, yAccessor, yValue } = props;

		var first = xAccessor(plotData[0]);
		var last = xAccessor(plotData[plotData.length - 1]);

		ctx.beginPath();

		var { fillStyle, strokeStyle, globalAlpha } = ctx;

		ctx.strokeStyle = stroke;
		ctx.globalAlpha = opacity;

		ctx.moveTo(xScale(first), yScale(yValue));
		ctx.lineTo(xScale(last), yScale(yValue));
		ctx.stroke();

		ctx.fillStyle = fillStyle;
		ctx.strokeStyle = strokeStyle;
		ctx.globalAlpha = globalAlpha;
	}
	render() {
		var { type, stroke, fill, className, opacity } = this.props;
		var { xScale, yScale, xAccessor, yAccessor, plotData, yValue } = this.props;

		var first = xAccessor(plotData[0]);
		var last = xAccessor(plotData[plotData.length - 1]);

		if (type !== "svg") return null;

		return (
			<line className={className}
				stroke={stroke} opacity={opacity}
				x1={xScale(first)} y1={yScale(yValue)}
				x2={xScale(last)} y2={yScale(yValue)} />
		);
	}
}

StraightLine.propTypes = {
	className: React.PropTypes.string,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string,
	type: React.PropTypes.string.isRequired,
	opacity: React.PropTypes.number.isRequired,
	yValue: React.PropTypes.number.isRequired,
};
StraightLine.defaultProps = {
	className: "line ",
	fill: "none",
	stroke: "black",
	opacity: 0.5,
};

module.exports = StraightLine;
