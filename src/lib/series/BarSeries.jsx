"use strict";

import React, { PropTypes, Component } from "react";

import wrap from "./wrap";

import StackedBarSeries, { getBars, drawOnCanvas2, getBarsSVG2 } from "./StackedBarSeries";
import { identity, first, last } from "../utils";


class BarSeries extends Component {
	render() {

		// console.log(modifiedXScale.domain(), modifiedYScale.domain())
		return <g className="react-stockcharts-bar-series">
			{BarSeries.getBarsSVG(props)}
		</g>;
		/*return <StackedBarSeries {...this.props} 
			yAccessor={modifiedYAccessor} xAccessor={modifiedXAccessor} 
			yScale={modifiedYScale} xScale={modifiedXScale} />;*/
	}
}
	/*render() {
		var { props } = this;

	}*/
BarSeries.propTypes = {
	baseAt: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func,
	]).isRequired,
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
	yAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
};

BarSeries.defaultProps = StackedBarSeries.defaultProps;

BarSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {

	var { yAccessor, xAccessor, swapScales } = props;

	var modifiedYAccessor = swapScales ? [xAccessor] : [yAccessor];
	var modifiedXAccessor = swapScales ? yAccessor : xAccessor;

	var modifiedXScale = swapScales ? yScale : xScale;
	var modifiedYScale = swapScales ? xScale : yScale;

	var after =  swapScales ? swap(xScale) : identity;

	var bars = getBars(props, modifiedXAccessor, modifiedYAccessor, modifiedXScale, modifiedYScale, plotData, identity, after);

	console.log(bars);

	drawOnCanvas2(props, ctx, bars);
};

function swap(xScale) {
	var start = first(xScale.range());

	return array => array.map(each => {
		return {
			...each,
			x: each.y === each.height ? start : each.y,
			y: each.x,
			height: each.width,
			width: each.height
		};
	});
}

BarSeries.getBarsSVG = (props) => {
	/* eslint-disable react/prop-types */
	var { xAccessor, yAccessor, xScale, yScale, plotData, swapScales } = props;
	/* eslint-disable react/prop-types */
	var modifiedYAccessor = swapScales ? [xAccessor] : [yAccessor];
	var modifiedXAccessor = swapScales ? yAccessor : xAccessor;

	var modifiedXScale = swapScales ? yScale : xScale;
	var modifiedYScale = swapScales ? xScale : yScale;

	var bars = getBars(props, modifiedXAccessor, modifiedYAccessor, modifiedXScale, modifiedYScale, plotData);
	return getBarsSVG2(props, bars);
};

export default wrap(BarSeries);
