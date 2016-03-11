"use strict";

// import d3 from "d3";
import React, { PropTypes, Component } from "react";

import wrap from "./wrap";

// import { isDefined, isNotDefined, hexToRGBA } from "../utils";

class HorizontalBarSeries extends Component {
	render() {
		var { props } = this;
		return <g className="histogram">
			{HorizontalBarSeries.getBarsSVG(props)}
		</g>;
	}
}

HorizontalBarSeries.propTypes = {
	baseAt: PropTypes.oneOfType([
		PropTypes.oneOf(["left", "right", "middle"]),
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
	yAccessor: PropTypes.func,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
};

HorizontalBarSeries.defaultProps = {
	baseAt: "left",
	direction: "up",
	className: "bar",
	stroke: false,
	fill: "#4682B4",
	opacity: 1,
	widthRatio: 0.5,
};
/*
HorizontalBarSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, stroke } = props;
	var bars = HorizontalBarSeries.getBars(props, xAccessor, [yAccessor], xScale, yScale, plotData);
	drawOnCanvas2(props, ctx, xScale, yScale, plotData, bars);
};

HorizontalBarSeries.getBarsSVG = (props) => {

	var { xAccessor, yAccessor, xScale, yScale, plotData } = props;

	var bars = HorizontalBarSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);
	return getBarsSVG2(props, bars);
};

HorizontalBarSeries.getBars = (props, xAccessor, yAccessor, xScale, yScale, plotData) => {
	var { baseAt, className, fill, stroke, widthRatio } = props;
	var base = baseAt === "left"
				? 0
				: baseAt === "right"
					? yScale.range()[0]
					: baseAt === "middle"
						? (yScale.range()[0] + yScale.range()[1]) / 2
						: baseAt;

	console.log(plotData.map(d => d.y), base, yAccessor);
	var getClassName = d3.functor(className);
	var getFill = d3.functor(fill);
	var getBase = d3.functor(base);

	var width = xScale(xAccessor(plotData[plotData.length - 1]))
		- xScale(xAccessor(plotData[0]));
	var bw = (width / (plotData.length - 1) * widthRatio);
	var barWidth = Math.round(bw);
	var offset = (barWidth === 1 ? 0 : 0.5 * barWidth);

	var bars = plotData
			.map(d => {
				var innerBars = yAccessor.map((eachYAccessor, i) => {
					var yValue = eachYAccessor(d);
					if (isNotDefined(yValue)) return undefined;

					var x = Math.round(xScale(xAccessor(d))) - offset;
					return {
						barWidth: barWidth,
						x: x,
						y: yScale(yValue),
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
				};
				return innerBars;
			});

	return d3.merge(bars);
};
*/
export default wrap(HorizontalBarSeries);
