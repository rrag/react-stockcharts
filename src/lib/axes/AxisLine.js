"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { first, last, hexToRGBA } from "../utils";

/*
function d3_scaleExtent(domain) {
	var start = domain[0], stop = domain[domain.length - 1];
	return start < stop ? [start, stop] : [stop, start];
}

function d3_scaleRange(scale) {
	return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
}
*/
class AxisLine extends Component {
	render() {
		const { orient, outerTickSize, fill, stroke, strokeWidth, className, shapeRendering, opacity, range } = this.props;
		const sign = orient === "top" || orient === "left" ? -1 : 1;

		// var range = d3_scaleRange(scale);

		let d;

		if (orient === "bottom" || orient === "top") {
			d = "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize;
		} else {
			d = "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize;
		}

		return (
			<path
				className={className}
				shapeRendering={shapeRendering}
				d={d}
				fill={fill}
				opacity={opacity}
				stroke={stroke}
				strokeWidth={strokeWidth} >
			</path>
		);
	}
}

AxisLine.propTypes = {
	className: PropTypes.string,
	shapeRendering: PropTypes.string,
	orient: PropTypes.string.isRequired,
	scale: PropTypes.func.isRequired,
	outerTickSize: PropTypes.number,
	fill: PropTypes.string,
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number,
	opacity: PropTypes.number,
	range: PropTypes.array,
};

AxisLine.defaultProps = {
	className: "react-stockcharts-axis-line",
	shapeRendering: "crispEdges",
	outerTickSize: 0,
	fill: "none",
	stroke: "#000000",
	strokeWidth: 1,
	opacity: 1,
};

AxisLine.drawOnCanvasStatic = (props, ctx/* , xScale, yScale*/) => {
	props = { ...AxisLine.defaultProps, ...props };

	const { orient, outerTickSize, stroke, strokeWidth, opacity, range } = props;

	const sign = orient === "top" || orient === "left" ? -1 : 1;
	const xAxis = (orient === "bottom" || orient === "top");

	// var range = d3_scaleRange(xAxis ? xScale : yScale);

	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = hexToRGBA(stroke, opacity);

	ctx.beginPath();

	if (xAxis) {
		ctx.moveTo(first(range), sign * outerTickSize);
		ctx.lineTo(first(range), 0);
		ctx.lineTo(last(range), 0);
		ctx.lineTo(last(range), sign * outerTickSize);
	} else {
		ctx.moveTo(sign * outerTickSize, first(range));
		ctx.lineTo(0, first(range));
		ctx.lineTo(0, last(range));
		ctx.lineTo(sign * outerTickSize, last(range));
	}
	ctx.stroke();

	// ctx.strokeStyle = strokeStyle;
};

export default AxisLine;
