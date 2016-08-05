"use strict";

import React, { PropTypes, Component } from "react";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";
import StackedBarSeries, { drawOnCanvasHelper, svgHelper } from "./StackedBarSeries";
import { identity } from "../utils";

class GroupedBarSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { yAccessor } = this.props;
		var { xAccessor } = this.context;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		drawOnCanvasHelper(ctx, this.props, moreProps, xAccessor,
		identity, postProcessor);
	}
	renderSVG(moreProps) {
		var { xAccessor } = this.context;

		// return <g>{svgHelper(this.props, moreProps, xAccessor, identity)}</g>;

		return <g className="react-stockcharts-grouped-bar-series">
			{svgHelper(props, moreProps, xAccessor, identity, postProcessor)}
		</g>;
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
GroupedBarSeries.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
};

GroupedBarSeries.defaultProps = {
	...StackedBarSeries.defaultProps,
	widthRatio: 0.8,
	spaceBetweenBar: 5,
};

GroupedBarSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {

};

GroupedBarSeries.getBarsSVG = (props) => {
	return 
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

export default GroupedBarSeries;
