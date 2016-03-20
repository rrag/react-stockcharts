"use strict";

import d3 from "d3";
import React, { PropTypes, Component } from "react";

import wrap from "./wrap";
import { drawOnCanvas2, getBarsSVG2 } from "./OverlayBarSeries";

import { isDefined, isNotDefined } from "../utils";

class GroupedBarSeries extends Component {
	render() {
		return <g className="react-stockcharts-grouped-bar-series">
			{GroupedBarSeries.getBarsSVG(this.props)}
		</g>;
	}
}

GroupedBarSeries.propTypes = {
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

GroupedBarSeries.defaultProps = {
	baseAt: "bottom",
	direction: "up",
	className: "bar",
	stroke: false,
	fill: "#4682B4",
	opacity: 1,
	widthRatio: 0.8,
	spaceBetweenBar: 5,
};

GroupedBarSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor } = props;
	var bars = GroupedBarSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);
	drawOnCanvas2(props, ctx, xScale, yScale, plotData, bars);
};

GroupedBarSeries.getBarsSVG = (props) => {
	/* eslint-disable react/prop-types */
	var { xAccessor, yAccessor, xScale, yScale, plotData } = props;
	/* eslint-disable react/prop-types */

	var bars = GroupedBarSeries.getBars(props, xAccessor, yAccessor, xScale, yScale, plotData);
	return getBarsSVG2(props, bars);
};

GroupedBarSeries.getBars = (props, xAccessor, yAccessor, xScale, yScale, plotData) => {
	var { baseAt, className, fill, stroke, widthRatio, spaceBetweenBar } = props;
	var base = baseAt === "top"
				? 0
				: baseAt === "bottom"
					? yScale.range()[0]
					: baseAt === "middle"
						? (yScale.range()[0] + yScale.range()[1]) / 2
						: baseAt;

	var getClassName = d3.functor(className);
	var getFill = d3.functor(fill);
	var getBase = d3.functor(base);

	var width = xScale(xAccessor(plotData[plotData.length - 1]))
		- xScale(xAccessor(plotData[0]));
	var bw = (width / (plotData.length - 1) * widthRatio);
	var barWidth = Math.round(bw);
	var eachBarWidth = (barWidth - spaceBetweenBar * (yAccessor.length - 1)) / yAccessor.length;
	var offset = (barWidth === 1 ? 0 : 0.5 * barWidth);

	var bars = plotData
			.map(d => {
				var b = getBase(xScale, yScale, d);
				var innerBars = yAccessor.map((eachYAccessor, i) => {
					var yValue = eachYAccessor(d);
					if (isNotDefined(yValue)) return undefined;

					var dx = i > 0 ? (eachBarWidth + spaceBetweenBar) * i : 0;
					var x = Math.round(xScale(xAccessor(d))) - offset + dx;
					var y = yScale(yValue);
					return {
						barWidth: eachBarWidth,
						x,
						y,
						height: b - y,
						className: getClassName(d, i),
						stroke: stroke ? getFill(d, i) : "none",
						fill: getFill(d, i),
						i,
					};
				}).filter(yValue => isDefined(yValue));

				/* var b = getBase(xScale, yScale, d);
				var h;
				for (var i = innerBars.length - 1; i >= 0; i--) {
					h = b - innerBars[i].y;
					if (h < 0) {
						innerBars[i].y = b;
						h = -1 * h;
					}
					innerBars[i].height = h;
					b = innerBars[i].y;
				};*/
				return innerBars;
			});

	return d3.merge(bars);
};

export default wrap(GroupedBarSeries);
