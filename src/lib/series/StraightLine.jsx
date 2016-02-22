"use strict";

import React, { PropTypes, Component } from "react";

import wrap from "./wrap";
import { hexToRGBA } from "../utils";

class StraightLine extends Component {
	render() {
		var { props } = this;
		var { stroke, className, opacity } = props;
		var { xScale, yScale, xAccessor, plotData, yValue } = props;

		var first = xAccessor(plotData[0]);
		var last = xAccessor(plotData[plotData.length - 1]);

		return (
			<line className={className}
				stroke={stroke} opacity={opacity}
				x1={xScale(first)} y1={yScale(yValue)}
				x2={xScale(last)} y2={yScale(yValue)} />
		);
	}
}

StraightLine.propTypes = {
	className: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	yScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.string,
	opacity: PropTypes.number.isRequired,
	yValue: PropTypes.number.isRequired,
};

StraightLine.defaultProps = {
	className: "line ",
	stroke: "#000000",
	opacity: 0.5,
};

StraightLine.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {

	var { stroke, opacity } = props;
	var { xAccessor, yValue } = props;

	var first = xAccessor(plotData[0]);
	var last = xAccessor(plotData[plotData.length - 1]);

	ctx.beginPath();

	ctx.strokeStyle = hexToRGBA(stroke, opacity);

	ctx.moveTo(xScale(first), yScale(yValue));
	ctx.lineTo(xScale(last), yScale(yValue));
	ctx.stroke();
};

export default wrap(StraightLine);
