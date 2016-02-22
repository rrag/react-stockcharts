"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import wrap from "./wrap";

import { isDefined, isNotDefined } from "../utils"

class Line extends Component {
	render() {
		var { stroke, fill, className } = this.props;

		className = className.concat((stroke) ? "" : " line-stroke");
		return <path d={Line.getPath(this.props)} stroke={stroke} fill={fill} className={className}/>;
	}
}

Line.propTypes = {
	className: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	yScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	yAccessor: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
	stroke: PropTypes.string,
	fill: PropTypes.string,
};

Line.defaultProps = {
	className: "line ",
	fill: "none",
	stroke: "black"
};

Line.getPath = (props) => {
	var { plotData, xScale, yScale, xAccessor, yAccessor } = props;

	var dataSeries = d3.svg.line()
		.defined(d => isDefined(yAccessor(d)))
		.x(d => xScale(xAccessor(d)))
		.y(d => yScale(yAccessor(d)));
	return dataSeries(plotData);
};

Line.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, stroke } = props;

	ctx.strokeStyle = stroke;
	ctx.beginPath();

	var begin = true;
	plotData.forEach((d) => {
		if (isNotDefined(yAccessor(d))) {
			ctx.stroke();
			ctx.beginPath();
			begin = true;
		} else {
			if (begin) {
				begin = false;
				let [x, y] = [~~ (0.5 + xScale(xAccessor(d))), ~~ (0.5 + yScale(yAccessor(d)))];
				ctx.moveTo(x, y);
			}
			ctx.lineTo(xScale(xAccessor(d)), yScale(yAccessor(d)));
		}
	});
	ctx.stroke();
};

export default wrap(Line);
