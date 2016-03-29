"use strict";

import React, { PropTypes, Component } from "react";

import wrap from "./wrap";

import StackedBarSeries, { drawOnCanvasHelper, svgHelper } from "./StackedBarSeries";
import { identity } from "../utils";

class GroupedBarSeries extends Component {
	render() {
		return <g className="react-stockcharts-grouped-bar-series">
			{GroupedBarSeries.getBarsSVG(this.props)}
		</g>;
	}
}

GroupedBarSeries.propTypes = {
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
};

GroupedBarSeries.defaultProps = {
	...StackedBarSeries.defaultProps,
	widthRatio: 0.8,
	spaceBetweenBar: 5,
};

GroupedBarSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor } = props;
	drawOnCanvasHelper(props, ctx, xScale, yScale, plotData, xAccessor, yAccessor,
		identity, postProcessor);
};

GroupedBarSeries.getBarsSVG = (props) => {
	return svgHelper(props, identity, postProcessor);
};

function postProcessor(array) {
	return array.map(each => {
		return {
			...each,
			x: each.x + each.offset - each.groupOffset,
			width: each.groupWidth,
		};
	});
}

export default wrap(GroupedBarSeries);
