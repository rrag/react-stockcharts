'use strict';

import React from "react";
import d3 from "d3";
import objectAssign from "object-assign";
import Utils from "../utils/utils";

function d3_scaleExtent(domain) {
	var start = domain[0], stop = domain[domain.length - 1];
	return start < stop ? [start, stop] : [stop, start];
}

function d3_scaleRange(scale) {
	return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
}

class AxisLine extends React.Component {
	render() {
		var { orient, scale, outerTickSize, fill, stroke, strokeWidth, className, shapeRendering, opacity } = this.props;
		var sign = orient === "top" || orient === "left" ? -1 : 1;

		var range = d3_scaleRange(scale);

		var d;

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
	className: React.PropTypes.string,
	shapeRendering: React.PropTypes.string,
	orient: React.PropTypes.string.isRequired,
	scale: React.PropTypes.func.isRequired,
	outerTickSize: React.PropTypes.number,
	fill: React.PropTypes.string,
	stroke: React.PropTypes.string,
	strokeWidth: React.PropTypes.number,
	opacity: React.PropTypes.number,
};

AxisLine.defaultProps = {
	className: "react-stockcharts-axis-line",
	shapeRendering: "crispEdges",
	outerTickSize: 6,
	fill: "none",
	stroke: "#000000",
	strokeWidth: 1,
	opacity: 1,
};

AxisLine.drawOnCanvasStatic = (props, ctx, chartData, xScale, yScale) => {
	props = objectAssign({}, AxisLine.defaultProps, props);

	var { orient, outerTickSize, fill, stroke, strokeWidth, className, shapeRendering, opacity } = props;

	var sign = orient === "top" || orient === "left" ? -1 : 1;
	var xAxis = (orient === "bottom" || orient === "top");

	var range = d3_scaleRange(xAxis ? xScale : yScale);

	ctx.strokeStyle = Utils.hexToRGBA(stroke, opacity);;

	ctx.beginPath();

	if (xAxis) {
		ctx.moveTo(range[0], sign * outerTickSize);
		ctx.lineTo(range[0], 0);
		ctx.lineTo(range[1], 0);
		ctx.lineTo(range[1], sign * outerTickSize);
	} else {
		ctx.moveTo(sign * outerTickSize, range[0]);
		ctx.lineTo(0, range[0]);
		ctx.lineTo(0, range[1]);
		ctx.lineTo(sign * outerTickSize, range[1]);
	}
	ctx.stroke();

	// ctx.strokeStyle = strokeStyle;
};

module.exports = AxisLine;
