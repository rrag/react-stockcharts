"use strict";

import { merge } from "d3-array";

import React, { PropTypes, Component } from "react";
import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";

import { drawOnCanvas2, getBarsSVG2 } from "./StackedBarSeries";
import { isDefined, isNotDefined, first, last, functor } from "../utils";

class OverlayBarSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { yAccessor } = this.props;
		var { xAccessor } = moreProps;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		var bars = getBars(this.props, xAccessor, yAccessor, xScale, yScale, plotData);

		drawOnCanvas2(this.props, ctx, bars);
	}
	renderSVG(moreProps) {
		var { yAccessor } = this.props;
		var { xAccessor } = moreProps;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		var bars = getBars(this.props, xAccessor, yAccessor, xScale, yScale, plotData);
		return <g className="react-stockcharts-bar-series">
			{getBarsSVG2(this.props, bars)}
		</g>;
	}
	render() {
		var { clip } = this.props;

		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			clip={clip}
			drawOnPan
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
	clip: true,
};

function getBars(props, xAccessor, yAccessor, xScale, yScale, plotData) {
	var { baseAt, className, fill, stroke, widthRatio } = props;

	var getClassName = functor(className);
	var getFill = functor(fill);
	var getBase = functor(baseAt);

	var width = Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData))));


	var bw = (width / (plotData.length - 1) * widthRatio);
	var barWidth = Math.round(bw);
	var offset = (barWidth === 1 ? 0 : 0.5 * bw);

	// console.log(xScale.domain(), yScale.domain());

	var bars = plotData
			.map(d => {
				var innerBars = yAccessor.map((eachYAccessor, i) => {
					var yValue = eachYAccessor(d);
					if (isNotDefined(yValue)) return undefined;

					var xValue = xAccessor(d);
					var x = Math.round(xScale(xValue)) - offset;
					var y = yScale(yValue);
					// console.log(yValue, y, xValue, x)
					return {
						width: barWidth,
						x: x,
						y: y,
						className: getClassName(d, i),
						stroke: stroke ? getFill(d, i) : "none",
						fill: getFill(d, i),
						i,
					};
				}).filter(yValue => isDefined(yValue));

				var b = getBase(xScale, yScale, d);
				var h;
				for (var i = innerBars.length - 1; i >= 0; i--) {
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
