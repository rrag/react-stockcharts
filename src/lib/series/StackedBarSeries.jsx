"use strict";

import d3 from "d3";
import React, { PropTypes, Component } from "react";

import wrap from "./wrap";
import { drawOnCanvas2, getBarsSVG2 } from "./OverlayBarSeries";

import { isDefined, isNotDefined, hexToRGBA, first, last } from "../utils";


class StackedBarSeries extends Component {
	render() {
		var { props } = this;
		return <g className="react-stockcharts-bar-series">
			{StackedBarSeries.getBarsSVG(props)}
		</g>;
	}
}

StackedBarSeries.propTypes = {
	baseAt: PropTypes.oneOfType([
		PropTypes.oneOf(["top", "bottom", "middle"]),
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
};

StackedBarSeries.defaultProps = {
	baseAt: "bottom",
	direction: "up",
	className: "bar",
	stroke: false,
	fill: "#4682B4",
	opacity: 1,
	widthRatio: 0.5,
};

StackedBarSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor } = props;
	var bars = StackedBarSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);
	drawOnCanvas2(props, ctx, xScale, yScale, plotData, bars);
};

StackedBarSeries.getBarsSVG = (props) => {

	/* eslint-disable react/prop-types */
	var { xAccessor, yAccessor, xScale, yScale, plotData } = props;
	/* eslint-disable react/prop-types */

	var bars = StackedBarSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);
	return getBarsSVG2(props, bars);
};

StackedBarSeries.getBars = (props, xAccessor, yAccessor, xScale, yScale, plotData) => {
	var { baseAt, className, fill, stroke, widthRatio } = props;
	var base = baseAt === "top"
				? 0
				: baseAt === "bottom"
					? first(yScale.range())
					: baseAt === "middle"
						? (first(yScale.range()) + last(yScale.range())) / 2
						: baseAt;

	var getClassName = d3.functor(className);
	var getFill = d3.functor(fill);
	var getBase = d3.functor(base);

	var height = last(yScale.range());
	var width = xScale(xAccessor(last(plotData)))
		- xScale(xAccessor(first(plotData)));
	var bw = (width / (plotData.length - 1) * widthRatio);
	var barWidth = Math.round(bw);
	var offset = (barWidth === 1 ? 0 : 0.5 * barWidth);

	var layers = yAccessor.map((eachYAccessor, i) => plotData
		.map(d => ({
			series: xAccessor(d),
			x: i,
			y: eachYAccessor(d),
			className: getClassName(d, i),
			stroke: stroke ? getFill(d, i) : "none",
			fill: getFill(d, i),
		})))

	console.log(layers);

	var stack = d3.layout.stack();
	var data = stack(layers);

	console.log(data);
	var bars = d3.merge(data)
			.map((d, idx) => ({
				className: d.className,
				stroke: d.stroke,
				fill: d.fill,
				x: xScale(d.series) - barWidth / 2,
				y: yScale(d.y0 + d.y),
				height: getBase(xScale, yScale, d) - yScale(d.y),
				barWidth: barWidth,
			}));
	console.log(bars);
	return bars;
};

export default wrap(StackedBarSeries);
