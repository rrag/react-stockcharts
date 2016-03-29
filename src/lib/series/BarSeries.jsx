"use strict";

import React, { PropTypes, Component } from "react";

import wrap from "./wrap";

import StackedBarSeries, { drawOnCanvasHelper, svgHelper } from "./StackedBarSeries";
import { identity } from "../utils";


class BarSeries extends Component {
	render() {
		return <g className="react-stockcharts-bar-series">
			{BarSeries.getBarsSVG(this.props)}
		</g>;
	}
}

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
	var { yAccessor, xAccessor } = props;
	drawOnCanvasHelper(props, ctx, xScale, yScale, plotData, xAccessor, yAccessor, identity);
};

BarSeries.getBarsSVG = (props) => {
	return svgHelper(props, identity);
};

export default wrap(BarSeries);
