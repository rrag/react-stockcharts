"use strict";

import React from "react";
import d3 from "d3";

import wrap from "./wrap";

const Area = (props) => {
	var { stroke, fill, className, opacity } = props;

	className = className.concat((stroke !== undefined) ? "" : " line-stroke");
	return (
		<path d={Area.getArea(props)} stroke={stroke} fill={fill} className={className} opacity={opacity} />
	);
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
	type: React.PropTypes.string.isRequired,
	base: React.PropTypes.func,
};

Area.defaultProps = {
	className: "line ",
	fill: "none",
	opacity: 1,
};
Area.getArea = (props) => {
	var { plotData, xScale, yScale, xAccessor, yAccessor, base } = props;
	var height = yScale.range()[0];
	if (base === undefined) base = () => (height - 1);

	var areaSeries = d3.svg.area()
		.defined((d) => yAccessor(d) !== undefined)
		.x((d) => xScale(xAccessor(d)))
		.y0(base.bind(null, yScale))
		.y1((d) => yScale(yAccessor(d)));

	return areaSeries(plotData);
};

Area.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, fill, stroke, opacity, base } = props;
	var begin = true;
	var height = yScale.range()[0];
	var newBase = (base === undefined) ? () => (height - 1) : base;

	ctx.fillStyle = fill;
	ctx.strokeStyle = stroke;
	ctx.globalAlpha = opacity;

	plotData.forEach((d) => {
		if (yAccessor(d) !== undefined) {
			if (begin) {
				ctx.beginPath();
				begin = false;
				let [x, y] = [xScale(xAccessor(d)), yScale(yAccessor(d))];
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
				ctx.lineTo(xScale(xAccessor(d)), base(yScale, d));
			}
		});
	}
	ctx.closePath();
	ctx.fill();
};

export default wrap(Area);
