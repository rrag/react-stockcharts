

import { merge } from "d3-array";

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { drawOnCanvas2, getBarsSVG2 } from "./StackedBarSeries";
import { isDefined, isNotDefined, first, functor, plotDataLengthBarWidth } from "../utils";

class OverlayBarSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const { yAccessor } = this.props;
		const bars = getBars(this.props, moreProps, yAccessor);

		drawOnCanvas2(this.props, ctx, bars);
	}
	renderSVG(moreProps) {
		const { yAccessor } = this.props;

		const bars = getBars(this.props, moreProps, yAccessor);
		return <g className="react-stockcharts-bar-series">
			{getBarsSVG2(this.props, bars)}
		</g>;
	}
	render() {
		const { clip } = this.props;

		return <GenericChartComponent
			svgDraw={this.renderSVG}
			canvasToDraw={getAxisCanvas}
			canvasDraw={this.drawOnCanvas}
			clip={clip}
			drawOn={["pan"]}
		/>;
	}
}

OverlayBarSeries.propTypes = {
	baseAt: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func,
	]).isRequired,
	direction: PropTypes.oneOf(["up", "down"]).isRequired,
	stroke: PropTypes.bool.isRequired,
	widthRatio: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	fill: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]).isRequired,
	className: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]).isRequired,
	xAccessor: PropTypes.func,
	yAccessor: PropTypes.arrayOf(PropTypes.func),
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
	clip: PropTypes.bool.isRequired,
};

OverlayBarSeries.defaultProps = {
	baseAt: (xScale, yScale/* , d*/) => first(yScale.range()),
	direction: "up",
	className: "bar",
	stroke: false,
	fill: "#4682B4",
	opacity: 1,
	widthRatio: 0.5,
	width: plotDataLengthBarWidth,
	clip: true,
};

function getBars(props, moreProps, yAccessor) {
	const { xScale, xAccessor, chartConfig: { yScale }, plotData } = moreProps;
	const { baseAt, className, fill, stroke } = props;

	const getClassName = functor(className);
	const getFill = functor(fill);
	const getBase = functor(baseAt);
	const widthFunctor = functor(props.width);

	const width = widthFunctor(props, moreProps);
	const offset = Math.floor(0.5 * width);

	// console.log(xScale.domain(), yScale.domain());

	const bars = plotData
		.map(d => {
			// eslint-disable-next-line prefer-const
			let innerBars = yAccessor.map((eachYAccessor, i) => {
				const yValue = eachYAccessor(d);
				if (isNotDefined(yValue)) return undefined;

				const xValue = xAccessor(d);
				const x = Math.round(xScale(xValue)) - offset;
				const y = yScale(yValue);
				// console.log(yValue, y, xValue, x)
				return {
					width: offset * 2,
					x: x,
					y: y,
					className: getClassName(d, i),
					stroke: stroke ? getFill(d, i) : "none",
					fill: getFill(d, i),
					i,
				};
			}).filter(yValue => isDefined(yValue));

			let b = getBase(xScale, yScale, d);
			let h;
			for (let i = innerBars.length - 1; i >= 0; i--) {
				h = b - innerBars[i].y;
				if (h < 0) {
					innerBars[i].y = b;
					h = -1 * h;
				}
				innerBars[i].height = h;
				b = innerBars[i].y;
			}
			return innerBars;
		});

	return merge(bars);
}

export default OverlayBarSeries;
