

import React, { Component } from "react";
import PropTypes from "prop-types";
import { area as d3Area } from "d3-shape";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { hexToRGBA, isDefined, first, functor } from "../utils";

class AreaOnlySeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const { yAccessor, defined, base, canvasGradient } = this.props;
		const { fill, stroke, opacity, interpolation, canvasClip } = this.props;

		const { xScale, chartConfig: { yScale }, plotData, xAccessor } = moreProps;

		if (canvasClip) {
			ctx.save();
			canvasClip(ctx, moreProps);
		}

		if (canvasGradient != null) {
			ctx.fillStyle = canvasGradient(moreProps, ctx);
		} else {
			ctx.fillStyle = hexToRGBA(fill, opacity);
		}
		ctx.strokeStyle = stroke;

		ctx.beginPath();
		const newBase = functor(base);
		const areaSeries = d3Area()
			.defined(d => defined(yAccessor(d)))
			.x((d) => Math.round(xScale(xAccessor(d))))
			.y0((d) => newBase(yScale, d, moreProps))
			.y1((d) => Math.round(yScale(yAccessor(d))))
			.context(ctx);

		if (isDefined(interpolation)) {
			areaSeries.curve(interpolation);
		}
		areaSeries(plotData);
		ctx.fill();

		if (canvasClip) {
			ctx.restore();
		}
	}
	renderSVG(moreProps) {
		const { yAccessor, defined, base, style } = this.props;
		const { stroke, fill, className, opacity, interpolation } = this.props;

		const { xScale, chartConfig: { yScale }, plotData, xAccessor } = moreProps;

		const newBase = functor(base);
		const areaSeries = d3Area()
			.defined(d => defined(yAccessor(d)))
			.x((d) => Math.round(xScale(xAccessor(d))))
			.y0((d) => newBase(yScale, d, moreProps))
			.y1((d) => Math.round(yScale(yAccessor(d))));

		if (isDefined(interpolation)) {
			areaSeries.curve(interpolation);
		}

		const d = areaSeries(plotData);
		const newClassName = className.concat(isDefined(stroke) ? "" : " line-stroke");
		return (
			<path
				style={style}
				d={d}
				stroke={stroke}
				fill={hexToRGBA(fill, opacity)}
				className={newClassName}

			/>
		);
	}
	render() {
		return (
			<GenericChartComponent
				svgDraw={this.renderSVG}
				canvasDraw={this.drawOnCanvas}
				canvasToDraw={getAxisCanvas}
				drawOn={["pan"]}
			/>
		);
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
	interpolation: PropTypes.func,
	canvasClip: PropTypes.func,
	style: PropTypes.object,
	canvasGradient: PropTypes.func,
};

AreaOnlySeries.defaultProps = {
	className: "line ",
	fill: "none",
	opacity: 1,
	defined: d => !isNaN(d),
	base: (yScale /* , d, moreProps */) => first(yScale.range()),
};

export default AreaOnlySeries;
