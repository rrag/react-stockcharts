

import React, { Component } from "react";
import PropTypes from "prop-types";
import { line as d3Line } from "d3-shape";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas, getMouseCanvas } from "../GenericComponent";

import {
	isDefined,
	getClosestItemIndexes,
	strokeDashTypes,
	getStrokeDasharray,
	hexToRGBA,
} from "../utils";

class LineSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		// console.log("HERE")
		const { highlightOnHover, yAccessor, hoverTolerance } = this.props;

		if (!highlightOnHover) return false;

		const { mouseXY, currentItem, xScale, plotData } = moreProps;
		const { chartConfig: { yScale, origin } } = moreProps;

		const { xAccessor } = moreProps;

		const [x, y] = mouseXY;
		const radius = hoverTolerance;

		const { left, right } = getClosestItemIndexes(plotData, xScale.invert(x), xAccessor);
		if (left === right) {
			const cy = yScale(yAccessor(currentItem)) + origin[1];
			const cx = xScale(xAccessor(currentItem)) + origin[0];

			const hovering1 = Math.pow(x - cx, 2) + Math.pow(y - cy, 2) < Math.pow(radius, 2);

			return hovering1;
		} else {
			const l = plotData[left];
			const r = plotData[right];
			const x1 = xScale(xAccessor(l)) + origin[0];
			const y1 = yScale(yAccessor(l)) + origin[1];
			const x2 = xScale(xAccessor(r)) + origin[0];
			const y2 = yScale(yAccessor(r)) + origin[1];

			// y = m * x + b
			const m /* slope */ = (y2 - y1) / (x2 - x1);
			const b /* y intercept */ = -1 * m * x1 + y1;

			const desiredY = Math.round(m * x + b);

			const hovering2 = y >= desiredY - radius && y <= desiredY + radius;

			return hovering2;
		}
	}
	drawOnCanvas(ctx, moreProps) {
		const {
			yAccessor,
			stroke,
			strokeOpacity,
			strokeWidth,
			hoverStrokeWidth,
			defined,
			strokeDasharray,
			interpolation,
			canvasClip,
		} = this.props;

		const { connectNulls } = this.props;

		const { xAccessor } = moreProps;
		const { xScale, chartConfig: { yScale }, plotData, hovering } = moreProps;

		if (canvasClip) {
			ctx.save();
			canvasClip(ctx, moreProps);
		}

		ctx.lineWidth = hovering ? hoverStrokeWidth : strokeWidth;

		ctx.strokeStyle = hexToRGBA(stroke, strokeOpacity);
		ctx.setLineDash(getStrokeDasharray(strokeDasharray).split(","));

		const dataSeries = d3Line()
			.x(d => Math.round(xScale(xAccessor(d))))
			.y(d => Math.round(yScale(yAccessor(d))));

		if (isDefined(interpolation)) {
			dataSeries.curve(interpolation);
		}
		if (!connectNulls) {
			dataSeries.defined(d => defined(yAccessor(d)));
		}

		ctx.beginPath();
		dataSeries.context(ctx)(plotData);
		ctx.stroke();

		if (canvasClip) {
			ctx.restore();
		}
	}
	renderSVG(moreProps) {
		const { yAccessor, stroke, strokeOpacity, strokeWidth, hoverStrokeWidth, defined, strokeDasharray } = this.props;
		const { connectNulls } = this.props;
		const { interpolation, style } = this.props;
		const { xAccessor, chartConfig } = moreProps;

		const { xScale, plotData, hovering } = moreProps;

		const { yScale } = chartConfig;
		const dataSeries = d3Line()
			.x(d => Math.round(xScale(xAccessor(d))))
			.y(d => Math.round(yScale(yAccessor(d))));

		if (isDefined(interpolation)) {
			dataSeries.curve(interpolation);
		}
		if (!connectNulls) {
			dataSeries.defined(d => defined(yAccessor(d)));
		}
		const d = dataSeries(plotData);

		const { fill, className } = this.props;

		return (
			<path
				style={style}
				className={`${className} ${stroke ? "" : " line-stroke"}`}
				d={d}
				stroke={stroke}
				strokeOpacity={strokeOpacity}
				strokeWidth={hovering ? hoverStrokeWidth : strokeWidth}
				strokeDasharray={getStrokeDasharray(strokeDasharray)}
				fill={fill}
			/>
		);
	}
	render() {
		const { highlightOnHover, onHover, onUnHover } = this.props;
		const hoverProps = (highlightOnHover || onHover || onUnHover)
			? {
				isHover: this.isHover,
				drawOn: ["mousemove", "pan"],
				canvasToDraw: getMouseCanvas
			}
			: {
				drawOn: ["pan"],
				canvasToDraw: getAxisCanvas
			};

		return <GenericChartComponent
			svgDraw={this.renderSVG}

			canvasDraw={this.drawOnCanvas}

			onClickWhenHover={this.props.onClick}
			onDoubleClickWhenHover={this.props.onDoubleClick}
			onContextMenuWhenHover={this.props.onContextMenu}
			onHover={this.props.onHover}
			onUnHover={this.props.onUnHover}
			{...hoverProps}
		/>;
	}
}

/*
function segment(points, ctx) {
	ctx.beginPath();

	const [x, y] = first(points);
	ctx.moveTo(x, y);
	for (let i = 1; i < points.length; i++) {
		const [x1, y1] = points[i];
		ctx.lineTo(x1, y1);
	}

	ctx.stroke();
}
*/

LineSeries.propTypes = {
	className: PropTypes.string,
	strokeWidth: PropTypes.number,
	strokeOpacity: PropTypes.number,
	stroke: PropTypes.string,
	hoverStrokeWidth: PropTypes.number,
	fill: PropTypes.string,
	defined: PropTypes.func,
	hoverTolerance: PropTypes.number,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
	highlightOnHover: PropTypes.bool,
	onClick: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,
	onContextMenu: PropTypes.func,
	yAccessor: PropTypes.func,
	connectNulls: PropTypes.bool,
	interpolation: PropTypes.func,
	canvasClip: PropTypes.func,
	style: PropTypes.object,
};

LineSeries.defaultProps = {
	className: "line ",
	strokeWidth: 1,
	strokeOpacity: 1,
	hoverStrokeWidth: 4,
	fill: "none",
	stroke: "#4682B4",
	strokeDasharray: "Solid",
	defined: d => !isNaN(d),
	hoverTolerance: 6,
	highlightOnHover: false,
	connectNulls: false,
	onClick: function(e) { console.log("Click", e); },
	onDoubleClick: function(e) { console.log("Double Click", e); },
	onContextMenu: function(e) { console.log("Right Click", e); },
};

export default LineSeries;
