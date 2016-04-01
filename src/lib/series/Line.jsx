"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import wrap from "./wrap";

import { first } from "../utils";

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
	stroke: "black",
	defined: d => !isNaN(d),
};

Line.getPath = (props) => {
	var { plotData, xScale, yScale, xAccessor, yAccessor, defined } = props;

	var dataSeries = d3.svg.line()
		.defined(d => defined(yAccessor(d)))
		.x(d => xScale(xAccessor(d)))
		.y(d => yScale(yAccessor(d)));
	return dataSeries(plotData);
};

function segment(points, ctx) {
	ctx.beginPath();

	let [x, y] = first(points);
	ctx.moveTo(x, y);
	for (let i = 1; i < points.length; i++) {
		let [x1, y1] = points[i];
		ctx.lineTo(x1, y1);
	};

	ctx.stroke();
};

Line.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, stroke, defined } = props;

	ctx.strokeStyle = stroke;

	var points = [];
	for (let i = 0; i < plotData.length; i++) {
		let d = plotData[i];
		if (defined(yAccessor(d), i)) {
			let [x, y] = [xScale(xAccessor(d)), yScale(yAccessor(d))];

			points.push([x, y]);
		} else if (points.length) {
			segment(points, ctx);
			points = [];
		}
	}

	if (points.length) segment(points, ctx);

};

export default wrap(Line);
