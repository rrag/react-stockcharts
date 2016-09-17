"use strict";

import React, { PropTypes, Component } from "react";
import { area as d3Area } from "d3-shape";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";
import { hexToRGBA, isDefined, first, functor } from "../utils";

class AreaOnlySeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { yAccessor, defined, base } = this.props;
		var { fill, stroke, opacity } = this.props;
		var { xAccessor } = this.context;

		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		var newBase = functor(base);

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
	}
	renderSVG(moreProps) {
		var { yAccessor, defined, base } = this.props;
		var { stroke, fill, className, opacity } = this.props;

		var { xAccessor } = this.context;

		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		var newBase = functor(base);
		var areaSeries = d3Area()
			.defined(d => defined(yAccessor(d)))
			.x((d) => xScale(xAccessor(d)))
			.y0(newBase.bind(null, yScale))
			.y1((d) => yScale(yAccessor(d)));

		var d = areaSeries(plotData);
		className = className.concat(isDefined(stroke) ? "" : " line-stroke");
		return (
			<path d={d} stroke={stroke} fill={fill} className={className} opacity={opacity} />
		);
	}
	render() {
		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnPan
			/>;
	}
}

AreaOnlySeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.string,
	fill: PropTypes.string,
	opacity: PropTypes.number,
	defined: PropTypes.func,
	base: PropTypes.oneOfType([
		PropTypes.func, PropTypes.number
	]),
};
AreaOnlySeries.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
};

AreaOnlySeries.defaultProps = {
	className: "line ",
	fill: "none",
	opacity: 1,
	defined: d => !isNaN(d),
	base: (yScale/* , d*/) => first(yScale.range()),
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

export default AreaOnlySeries;
