"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import wrap from "./wrap";
import { hexToRGBA, isDefined, isNotDefined } from "../utils";

class Area extends Component {
	render() {
		var { props } = this;
		var { stroke, fill, className, opacity } = props;

		className = className.concat(isDefined(stroke) ? "" : " line-stroke");
		return (
			<path d={Area.getArea(props)} stroke={stroke} fill={fill} className={className} opacity={opacity} />
		);
	}
};

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
};
Area.getArea = (props) => {
	var { plotData, xScale, yScale, xAccessor, yAccessor, base } = props;
	var height = yScale.range()[0];
	var newBase = d3.functor( isNotDefined(base) ? height - 1 : base );

	var areaSeries = d3.svg.area()
		.defined((d) => isDefined(yAccessor(d)))
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
	var newBase = d3.functor( isNotDefined(base) ? height - 1 : base);

	ctx.fillStyle = hexToRGBA(fill, opacity);
	ctx.strokeStyle = stroke;
	// ctx.globalAlpha = opacity;

	plotData.forEach((d) => {
		if (isDefined(yAccessor(d))) {
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

	if (isDefined(base)) {
		plotData.slice().reverse().forEach((d) => {
			if (isDefined(yAccessor(d))) {
				ctx.lineTo(xScale(xAccessor(d)), newBase(yScale, d));
			}
		});
	}
	ctx.closePath();
	ctx.fill();
};

export default wrap(Area);
