"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import StackedBarSeries, {
	// drawOnCanvasHelper,
	drawOnCanvas2,
	getBarsSVG2,
	// svgHelper,
	// identityStack
} from "./StackedBarSeries";

import { functor, last, head } from "../utils";

class BarSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		// const { xAccessor } = moreProps;

		// drawOnCanvasHelper(ctx, this.props, moreProps, xAccessor, identityStack);
		const bars = getBars(this.props, moreProps);
		drawOnCanvas2(this.props, ctx, bars);
	}
	renderSVG(moreProps) {
		// const { xAccessor } = moreProps;

		// return <g>{svgHelper(this.props, moreProps, xAccessor, identityStack)}</g>;

		const bars = getBars(this.props, moreProps);
		return <g>{getBarsSVG2(this.props, bars)}</g>;
	}
	render() {
		const { clip } = this.props;

		return <GenericChartComponent
			clip={clip}
			svgDraw={this.renderSVG}

			canvasToDraw={getAxisCanvas}
			canvasDraw={this.drawOnCanvas}

			drawOn={["pan"]}
			/>;
	}
}

BarSeries.propTypes = {
	baseAt: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func,
	]).isRequired,
	stroke: PropTypes.bool.isRequired,
	widthRatio: PropTypes.number.isRequired,
	yAccessor: PropTypes.func.isRequired,
	opacity: PropTypes.number.isRequired,
	fill: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]).isRequired,
	className: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]).isRequired,
	clip: PropTypes.bool.isRequired,
};


BarSeries.defaultProps = StackedBarSeries.defaultProps;

export default BarSeries;

/*
 Initially, this program was using StackedBarSeries.getBars
 to benefit from code reuse and having a single place that
 contains the logic for drawing all types of bar charts
 simple, grouped, horizontal, but turnes out
 making it highly cuztimizable also made it slow for the
 most simple case, a regular bar chart.
 This function contains just the necessary logic
 to create bars
*/
function getBars(props, moreProps) {
	const { baseAt, fill, stroke, widthRatio, yAccessor } = props;
	const { xScale, xAccessor, plotData, chartConfig: { yScale } } = moreProps;

	const getFill = functor(fill);
	const getBase = functor(baseAt);

	const width = Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(head(plotData))));
	const bw = (width / (plotData.length - 1) * widthRatio);
	const barWidth = Math.round(bw);
	const offset = (barWidth === 1 ? 0 : 0.5 * bw);

	const bars = plotData
		.map(d => {
			const yValue = yAccessor(d);
			let y = yScale(yValue);

			const x = Math.round(xScale(xAccessor(d)) - offset);
			let h = getBase(xScale, yScale, d) - yScale(yValue);

			if (h < 0) {
				y = y + h;
				h = -h;
			}

			return {
				// type: "line"
				x,
				y: Math.round(y),
				height: Math.round(h),
				width: barWidth,
				fill: getFill(d, 0),
				stroke: stroke ? getFill(d, 0) : "none",
			};
		});

	return bars;
}