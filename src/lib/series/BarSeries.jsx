"use strict";

import React, { PropTypes, Component } from "react";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import StackedBarSeries, {
	drawOnCanvasHelper,
	svgHelper,
	identityStack
} from "./StackedBarSeries";

class BarSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const { xAccessor } = moreProps;

		drawOnCanvasHelper(ctx, this.props, moreProps, xAccessor, identityStack);

	}
	renderSVG(moreProps) {
		const { xAccessor } = moreProps;

		return <g>{svgHelper(this.props, moreProps, xAccessor, identityStack)}</g>;
	}
	render() {
		const { clip } = this.props;

		return <GenericChartComponent
			clip={clip}
			svgDraw={this.renderSVG}

			canvasToDraw={getAxisCanvas}
			canvasDraw={this.drawOnCanvas}

			drawOn={["pan"]}
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
	clip: PropTypes.bool.isRequired,
};


BarSeries.defaultProps = StackedBarSeries.defaultProps;

export default BarSeries;
