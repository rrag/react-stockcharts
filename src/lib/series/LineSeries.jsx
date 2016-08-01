"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import GenericChartComponent from "../GenericChartComponent";
import { first, getClosestItemIndexes } from "../utils";

class LineSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		var { hoverHighlight, yAccessor, hoverTolerance } = this.props;

		if (!hoverHighlight) return false;

		var { mouseXY, currentItem, xScale, plotData } = moreProps;
		var { chartConfig: { yScale, origin } } = moreProps;

		var { xAccessor } = this.context;

		var [x, y] = mouseXY;
		const radius = hoverTolerance;

		var { left, right } = getClosestItemIndexes(plotData, xScale.invert(x), xAccessor)
		if (left === right) {
			var cy = yScale(yAccessor(currentItem)) + origin[1];
			var cx = xScale(xAccessor(currentItem)) + origin[0];

			var hovering1 = Math.pow(x - cx, 2) + Math.pow(y - cy, 2) < Math.pow(radius, 2)

			return hovering1
		} else {
			var l = plotData[left];
			var r = plotData[right];
			var x1 = xScale(xAccessor(l)) + origin[0];
			var y1 = yScale(yAccessor(l)) + origin[1];
			var x2 = xScale(xAccessor(r)) + origin[0];
			var y2 = yScale(yAccessor(r)) + origin[1];

			// y = m * x + b
			var m /* slope */ = (y2 - y1) / (x2 - x1);
			var b /* y intercept */ = -1 * m * x1 + y1;

			var desiredY = Math.round(m * x + b);

			var hovering2 = y >= desiredY - radius && y <= desiredY + radius

			return hovering2
		}
	}
	drawOnCanvas(ctx, moreProps) {
		var { yAccessor, stroke, strokeWidth, hoverStrokeWidth, defined } = this.props;
		var { xAccessor } = this.context;

		var { xScale, chartConfig: { yScale }, plotData, hovering } = moreProps;

		ctx.lineWidth = hovering ? hoverStrokeWidth : strokeWidth;

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
		var { yAccessor, stroke, strokeWidth, hoverStrokeWidth, defined } = this.props;
		var { xAccessor } = this.context;

		var { xScale, chartConfig: { yScale }, plotData, hovering } = moreProps;

		var dataSeries = d3.svg.line()
			.defined(d => defined(yAccessor(d)))
			.x(d => xScale(xAccessor(d)))
			.y(d => yScale(yAccessor(d)));

		var d = dataSeries(plotData);

		var { stroke, strokeWidth, fill, className } = this.props;

		return <path className={`${className} ${stroke ? "" : " line-stroke"}`}
			d={d}
			stroke={stroke}
			strokeWidth={hovering ? hoverStrokeWidth : strokeWidth}
			fill={fill}
			/>;
	}
	render() {
		return <GenericChartComponent
			canvasToDraw={contexts => contexts.axes}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			isHover={this.isHover}
			onClick={this.props.onClick}
			onDoubleClick={this.props.onDoubleClick}
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
LineSeries.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
}

LineSeries.defaultProps = {
	stroke: "#4682B4",
	className: "line ",
	strokeWidth: 1,
	hoverStrokeWidth: 4,
	fill: "none",
	stroke: "black",
	defined: d => !isNaN(d),
	hoverTolerance: 6,
	hoverHighlight: true,
	onClick: e => { console.log("Click", e); },
	onDoubleClick: e => { console.log("Double Click", e); },
};

export default LineSeries;
