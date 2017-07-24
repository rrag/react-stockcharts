"use strict";
import React from "react";
import PropTypes from "prop-types";

import { hexToRGBA, functor } from "../utils";

function Circle(props) {
	const { className, stroke, strokeWidth, opacity, fill, point, r } = props;
	const radius = functor(r)(point.datum);
	return (
		<circle className={className}
			cx={point.x} cy={point.y}
			stroke={stroke} strokeWidth={strokeWidth}
			fillOpacity={opacity} fill={fill} r={radius} />
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
	strokeWidth: PropTypes.number,
	r: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func
	]).isRequired
};

Circle.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-marker-circle",
};

Circle.drawOnCanvas = (props, point, ctx) => {

	const { stroke, fill, opacity, strokeWidth } = props;

	ctx.strokeStyle = stroke;
	ctx.lineWidth = strokeWidth;

	if (fill !== "none") {
		ctx.fillStyle = hexToRGBA(fill, opacity);
	}

	Circle.drawOnCanvasWithNoStateChange(props, point, ctx);
};


Circle.drawOnCanvasWithNoStateChange = (props, point, ctx) => {

	const { r } = props;
	const radius = functor(r)(point.datum);

	ctx.moveTo(point.x, point.y);
	ctx.beginPath();
	ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.fill();
};

export default Circle;
