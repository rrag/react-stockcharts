"use strict";

import React from "react";

import wrap from "./wrap";

const StraightLine = (props) => {
	var { stroke, fill, className, opacity } = props;
	var { xScale, yScale, xAccessor, yAccessor, plotData, yValue } = props;

	var first = xAccessor(plotData[0]);
	var last = xAccessor(plotData[plotData.length - 1]);

	return (
		<line className={className}
			stroke={stroke} opacity={opacity}
			x1={xScale(first)} y1={yScale(yValue)}
			x2={xScale(last)} y2={yScale(yValue)} />
	);
};

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

StraightLine.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {

	var { type, stroke, fill, className, opacity } = props;
	var { xAccessor, yAccessor, yValue } = props;

	var first = xAccessor(plotData[0]);
	var last = xAccessor(plotData[plotData.length - 1]);

	ctx.beginPath();

	ctx.strokeStyle = stroke;
	ctx.globalAlpha = opacity;

	ctx.moveTo(xScale(first), yScale(yValue));
	ctx.lineTo(xScale(last), yScale(yValue));
	ctx.stroke();
};

export default wrap(StraightLine);
