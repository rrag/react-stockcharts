"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import GenericComponent from "../GenericComponent";
import { first } from "../utils";

class LineSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { yAccessor, stroke, strokeWidth, defined } = this.props;
		var { xAccessor, xScale, chartConfig: { yScale }, plotData } = moreProps;

		ctx.lineWidth = strokeWidth;
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
	}
	renderSVG(moreProps) {
		var { yAccessor, stroke, strokeWidth, defined } = this.props;
		var { xAccessor, xScale, chartConfig: { yScale }, plotData } = moreProps;

		var dataSeries = d3.svg.line()
			.defined(d => defined(yAccessor(d)))
			.x(d => xScale(xAccessor(d)))
			.y(d => yScale(yAccessor(d)));

		var d = dataSeries(plotData);

		var { stroke, strokeWidth, fill, className } = this.props;

		return <path className={`${className} ${stroke ? "" : " line-stroke"}`}
			d={d}
			stroke={stroke}
			strokeWidth={strokeWidth}
			fill={fill}
			/>;
	}
	render() {
		return <GenericComponent
			canvasToDraw={contexts => contexts.axes}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnPan
			/>
	}
}
function segment(points, ctx) {
	ctx.beginPath();

	let [x, y] = first(points);
	ctx.moveTo(x, y);
	for (let i = 1; i < points.length; i++) {
		let [x1, y1] = points[i];
		ctx.lineTo(x1, y1);
	}

	ctx.stroke();
}

LineSeries.propTypes = {
	className: PropTypes.string,
	strokeWidth: PropTypes.number,
};

LineSeries.defaultProps = {
	stroke: "#4682B4",
	className: "line ",
	strokeWidth: 1,
	fill: "none",
	stroke: "black",
	defined: d => !isNaN(d),
};

export default LineSeries;
