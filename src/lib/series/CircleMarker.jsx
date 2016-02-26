"use strict";

import d3 from "d3";
import React, { PropTypes } from "react";

import { hexToRGBA } from "../utils";

function Circle(props) {
	var { className, stroke, opacity, fill, point, r } = props;
	var radius = d3.functor(r)(point.datum);
	return (
		<circle className={className} cx={point.x} cy={point.y} stroke={stroke} fillOpacity={opacity} fill={fill} r={radius} />
	);
}

Circle.propTypes = {
	stroke: PropTypes.string,
	fill: PropTypes.string.isRequired,
	opacity: PropTypes.number.isRequired,
	point: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
		datum: PropTypes.object.isRequired,
	}).isRequired,
	className: PropTypes.string,
	r: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func
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

	Circle.drawOnCanvasWithNoStateChange(props, point, ctx);
};


Circle.drawOnCanvasWithNoStateChange = (props, point, ctx) => {

	var { r } = props;
	var radius = d3.functor(r)(point.datum);

	ctx.moveTo(point.x, point.y);
	ctx.beginPath();
	ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.fill();
};

export default Circle;
