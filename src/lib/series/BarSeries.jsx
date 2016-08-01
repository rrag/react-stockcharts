"use strict";

import React, { PropTypes, Component } from "react";

import GenericChartComponent from "../GenericChartComponent";

import StackedBarSeries, { drawOnCanvasHelper, svgHelper } from "./StackedBarSeries";
import { identity } from "../utils";


class BarSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { yAccessor } = this.props;
		var { xAccessor } = this.context;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		drawOnCanvasHelper(this.props, ctx, xScale, yScale, plotData, xAccessor, yAccessor, identity);
	}
	renderSVG(moreProps) {
		var { xAccessor } = this.context;

		return <g>{svgHelper(this.props, moreProps, xAccessor, identity)}</g>;
	}
	render() {
		return <GenericChartComponent
			canvasToDraw={contexts => contexts.axes}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnPan
			/>
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
};

BarSeries.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
}

BarSeries.defaultProps = StackedBarSeries.defaultProps;

export default BarSeries;
