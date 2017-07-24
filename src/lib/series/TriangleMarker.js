"use strict";
import React from "react";
import PropTypes from "prop-types";
import { hexToRGBA, functor } from "../utils";

function Triangle(props) {
	const {
		className, stroke, strokeWidth,
		opacity, fill, point, width
	} = props;
	const w = functor(width)(point.datum);
	const { x, y } = point;
	const { innerOpposite, innerHypotenuse } = getTrianglePoints(w);
	const points = `
		${x} ${y - innerHypotenuse},
		${x + (w / 2)} ${y + innerOpposite},
		${x - (w / 2)} ${y + innerOpposite}
	`;
	return (
		<polygon
			className={className}
			points={points}
			stroke={stroke}
			strokeWidth={strokeWidth}
			fillOpacity={opacity}
			fill={fill}
		/>
	);
}
Triangle.propTypes = {
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
	width: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func
	]).isRequired
};
Triangle.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-marker-triangle",
};
Triangle.drawOnCanvas = (props, point, ctx) => {
	const { stroke, fill, opacity, strokeWidth } = props;
	ctx.strokeStyle = stroke;
	ctx.lineWidth = strokeWidth;
	if (fill !== "none") {
		ctx.fillStyle = hexToRGBA(fill, opacity);
	}
	Triangle.drawOnCanvasWithNoStateChange(props, point, ctx);
};
Triangle.drawOnCanvasWithNoStateChange = (props, point, ctx) => {
	const { width } = props;
	const w = functor(width)(point.datum);
	const { x, y } = point;
	const { innerOpposite, innerHypotenuse } = getTrianglePoints(w);
	ctx.beginPath();
	ctx.moveTo(x, y - innerHypotenuse);
	ctx.lineTo(x + (w / 2), y + innerOpposite);
	ctx.lineTo(x - (w / 2), y + innerOpposite);
	ctx.stroke();
	ctx.fill();
};
export default Triangle;

function getTrianglePoints(width) {
	const innerHypotenuse = (width / 2) * (1 / Math.cos(30 * Math.PI / 180));
	const innerOpposite = (width / 2) * (1 / Math.tan(60 * Math.PI / 180));
	return {
		innerOpposite,
		innerHypotenuse
	};
}
