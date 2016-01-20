"use strict";

import React from "react";
import d3 from "d3";

import { hexToRGBA } from "../utils/utils";

function Circle(props) {
	var { className, stroke, opacity, fill, point, r } = props;
	var radius = d3.functor(r)(point.datum);
	return (
		<circle className={className} cx={point.x} cy={point.y} stroke={stroke} fillOpacity={opacity} fill={fill} r={radius} />
	);
}

Circle.propTypes = {
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string.isRequired,
	opacity: React.PropTypes.number.isRequired,
	className: React.PropTypes.string,
	r: React.PropTypes.oneOfType([
		React.PropTypes.number,
		React.PropTypes.func
	]).isRequired
};

Circle.defaultProps = {
	stroke: "#4682B4",
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-marker-circle",
};

Circle.drawOnCanvas = (props, point, ctx) => {

	var { stroke, fill, opacity } = props;

	ctx.strokeStyle = stroke;

	if (fill !== "none") { 
		ctx.fillStyle = hexToRGBA(fill, opacity);
	}

	Circle.drawOnCanvasWithNoStateChange(props, point, ctx)
}


Circle.drawOnCanvasWithNoStateChange = (props, point, ctx) => {

	var { r } = props;
	var radius = d3.functor(r)(point.datum);

	ctx.beginPath();
	ctx.moveTo(point.x, point.y);
	ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.fill();
}

export default Circle;
