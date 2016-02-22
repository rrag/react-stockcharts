"use strict";

import React from "react";
import d3 from "d3";

import wrap from "./wrap";
import { hexToRGBA } from "../utils";

class Area extends React.Component {
	render() {
		var { props } = this;
		var { stroke, fill, className, opacity } = props;

		className = className.concat((stroke !== undefined) ? "" : " line-stroke");
		return (
			<path d={Area.getArea(props)} stroke={stroke} fill={fill} className={className} opacity={opacity} />
		);
	}
};

Area.propTypes = {
	className: React.PropTypes.string,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string,
	opacity: React.PropTypes.number,
	base: React.PropTypes.oneOfType([
		React.PropTypes.func, React.PropTypes.number
	]),
};

Area.defaultProps = {
	className: "line ",
	fill: "none",
	opacity: 1,
};
Area.getArea = (props) => {
	var { plotData, xScale, yScale, xAccessor, yAccessor, base } = props;
	var height = yScale.range()[0];
	var newBase = d3.functor( base === undefined ? height - 1: base );

	var areaSeries = d3.svg.area()
		.defined((d) => yAccessor(d) !== undefined)
		.x((d) => xScale(xAccessor(d)))
		.y0(newBase.bind(null, yScale))
		.y1((d) => yScale(yAccessor(d)));

	// console.log("HERE", yAccessor(plotData[0]));
	return areaSeries(plotData);
};

Area.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, fill, stroke, opacity, base } = props;
	var begin = true;
	var height = yScale.range()[0];
	var newBase = d3.functor( base === undefined ? height - 1 : base);

	ctx.fillStyle = hexToRGBA(fill, opacity);
	ctx.strokeStyle = stroke;
	// ctx.globalAlpha = opacity;

	plotData.forEach((d) => {
		if (yAccessor(d) !== undefined) {
			if (begin) {
				ctx.beginPath();
				begin = false;
				let [x, y] = [~~ (0.5 + xScale(xAccessor(d))), ~~ (0.5 + yScale(yAccessor(d)))];
				ctx.moveTo(x, newBase(yScale, d));
				ctx.lineTo(x, y);
			}
			ctx.lineTo(xScale(xAccessor(d)), yScale(yAccessor(d)));
		}
	});

	var last = plotData[plotData.length - 1];
	ctx.lineTo(xScale(xAccessor(last)), newBase(yScale, last));

	if (base !== undefined) {
		plotData.slice().reverse().forEach((d) => {
			if (yAccessor(d) !== undefined) {
				ctx.lineTo(xScale(xAccessor(d)), newBase(yScale, d));
			}
		});
	}
	ctx.closePath();
	ctx.fill();
};

export default wrap(Area);
