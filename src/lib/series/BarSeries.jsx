"use strict";

import React, { PropTypes, Component } from "react";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";

import StackedBarSeries, { drawOnCanvasHelper, svgHelper, identityStack } from "./StackedBarSeries";

class BarSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { xAccessor } = this.context;

		drawOnCanvasHelper(ctx, this.props, moreProps, xAccessor, identityStack);

	}
	renderSVG(moreProps) {
		var { xAccessor } = this.context;

		return <g>{svgHelper(this.props, moreProps, xAccessor, identityStack)}</g>;
	}
	render() {
		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnPan
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
};

BarSeries.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
};

BarSeries.defaultProps = StackedBarSeries.defaultProps;

export default BarSeries;
