"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import wrap from "./wrap";
import { hexToRGBA, isDefined, first } from "../utils";

class Area extends Component {
	render() {
		var { props } = this;
		var { stroke, fill, className, opacity } = props;

		className = className.concat(isDefined(stroke) ? "" : " line-stroke");
		return (
			<path d={Area.getArea(props)} stroke={stroke} fill={fill} className={className} opacity={opacity} />
		);
	}
}

Area.propTypes = {
	className: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	yScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	yAccessor: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
	stroke: PropTypes.string,
	fill: PropTypes.string,
	opacity: PropTypes.number,
	base: PropTypes.oneOfType([
		PropTypes.func, PropTypes.number
	]),
};

Area.defaultProps = {
	className: "line ",
	fill: "none",
	opacity: 1,
	defined: d => !isNaN(d),
	base: (yScale/* , d*/) => first(yScale.range()),
};
Area.getArea = (props) => {
	var { plotData, xScale, yScale, xAccessor, yAccessor, base, defined } = props;
	var newBase = d3.functor(base);

	var areaSeries = d3.svg.area()
		.defined(d => defined(yAccessor(d)))
		.x((d) => xScale(xAccessor(d)))
		.y0(newBase.bind(null, yScale))
		.y1((d) => yScale(yAccessor(d)));

	// console.log("HERE", yAccessor(plotData[0]));
	return areaSeries(plotData);
};

function segment(points0, points1, ctx) {
	ctx.beginPath();
	var [x0, y0] = first(points0);
	ctx.moveTo(x0, y0);

	var i;
	for (i = 0; i < points1.length; i++) {
		let [x1, y1] = points1[i];
		ctx.lineTo(x1, y1);
	}

	for (i = points0.length - 1; i >= 0; i--) {
		let [x0, y0] = points0[i];
		ctx.lineTo(x0, y0);
	}
	ctx.closePath();
	ctx.fill();
}

Area.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, fill, stroke, opacity, base, defined } = props;
	// var height = yScale.range()[0];
	var newBase = d3.functor(base);

	ctx.fillStyle = hexToRGBA(fill, opacity);
	ctx.strokeStyle = stroke;

	var points0 = [], points1 = [];

	for (let i = 0; i < plotData.length; i++) {
		let d = plotData[i];
		if (defined(yAccessor(d), i)) {
			let [x, y1, y0] = [xScale(xAccessor(d)), yScale(yAccessor(d)), newBase(yScale, d)];

			points0.push([x, y0]);
			points1.push([x, y1]);
		} else if (points0.length) {
			segment(points0, points1, ctx);
			points0 = [];
			points1 = [];
		}
	}
	if (points0.length) segment(points0, points1, ctx);
};

export default wrap(Area);
