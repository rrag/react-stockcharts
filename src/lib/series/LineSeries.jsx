"use strict";

import React, { PropTypes, Component } from "react";
import { line as d3Line } from "d3-shape";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";
import { first, getClosestItemIndexes } from "../utils";

class LineSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		// console.log("HERE")
		var { highlightOnHover, yAccessor, hoverTolerance } = this.props;

		if (!highlightOnHover) return false;

		var { mouseXY, currentItem, xScale, plotData } = moreProps;
		var { chartConfig: { yScale, origin } } = moreProps;

		var { xAccessor } = moreProps;

		var [x, y] = mouseXY;
		const radius = hoverTolerance;

		var { left, right } = getClosestItemIndexes(plotData, xScale.invert(x), xAccessor);
		if (left === right) {
			var cy = yScale(yAccessor(currentItem)) + origin[1];
			var cx = xScale(xAccessor(currentItem)) + origin[0];

			var hovering1 = Math.pow(x - cx, 2) + Math.pow(y - cy, 2) < Math.pow(radius, 2);

			return hovering1;
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

			var hovering2 = y >= desiredY - radius && y <= desiredY + radius;

			return hovering2;
		}
	}
	drawOnCanvas(ctx, moreProps) {
		var { yAccessor, stroke, strokeWidth, hoverStrokeWidth, defined } = this.props;
		var { xAccessor } = moreProps;

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
		var { xAccessor } = moreProps;

		var { xScale, chartConfig: { yScale }, plotData, hovering } = moreProps;

		var dataSeries = d3Line()
			.defined(d => defined(yAccessor(d)))
			.x(d => xScale(xAccessor(d)))
			.y(d => yScale(yAccessor(d)));

		var d = dataSeries(plotData);

		var { fill, className } = this.props;

		return <path className={`${className} ${stroke ? "" : " line-stroke"}`}
			d={d}
			stroke={stroke}
			strokeWidth={hovering ? hoverStrokeWidth : strokeWidth}
			fill={fill}
			/>;
	}
	render() {
		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			isHover={this.isHover}
			onClick={this.props.onClick}
			onDoubleClick={this.props.onDoubleClick}
			onContextMenu={this.props.onContextMenu}
			drawOnPan
			/>;
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
	stroke: PropTypes.string,
	hoverStrokeWidth: PropTypes.number,
	fill: PropTypes.string,
	defined: PropTypes.func,
	hoverTolerance: PropTypes.number,
	highlightOnHover: PropTypes.bool,
	onClick: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onContextMenu: PropTypes.func,
	yAccessor: PropTypes.func,
};

LineSeries.defaultProps = {
	className: "line ",
	strokeWidth: 1,
	hoverStrokeWidth: 4,
	fill: "none",
	stroke: "#4682B4",
	defined: d => !isNaN(d),
	hoverTolerance: 6,
	highlightOnHover: false,
	onClick: function(e) { console.log("Click", e); },
	onDoubleClick: function(e) { console.log("Double Click", e); },
	onContextMenu: function(e) { console.log("Right Click", e); },
};

export default LineSeries;
