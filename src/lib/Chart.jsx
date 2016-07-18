"use strict";

import React, { PropTypes } from "react";
import d3 from "d3";

import PureComponent from "./utils/PureComponent";

class Chart extends PureComponent {
	constructor(props, context) {
		super(props, context);
		this.yScale = this.yScale.bind(this);
	}
	yScale() {
		var chartConfig = this.context.chartConfig.filter((each) => each.id === this.props.id)[0];
		return chartConfig.yScale.copy();
	}
	getChildContext() {
		var { id: chartId } = this.props;
		var chartConfig = this.context.chartConfig.filter((each) => each.id === chartId)[0];

		var { width, height } = chartConfig;
		var canvasOriginX = 0.5 + chartConfig.origin[0] + this.context.margin.left;
		var canvasOriginY = 0.5 + chartConfig.origin[1] + this.context.margin.top;

		return { chartId, chartConfig, canvasOriginX, canvasOriginY, width, height };
	}
	render() {
		var { origin } = this.context.chartConfig.filter((each) => each.id === this.props.id)[0];
		var [x, y] = origin;

		return <g transform={`translate(${ x }, ${ y })`}>{this.props.children}</g>;
	}
}

Chart.propTypes = {
	height: PropTypes.number,
	width: PropTypes.number,
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	id: PropTypes.number.isRequired,
	yExtents: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	yScale: PropTypes.func.isRequired,
	yMousePointerDisplayLocation: PropTypes.oneOf(["left", "right"]),
	yMousePointerDisplayFormat: PropTypes.func,
	flipYScale: PropTypes.bool.isRequired,
	padding: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.shape({
			top: PropTypes.number,
			bottom: PropTypes.number,
		})
	]).isRequired,
};

Chart.defaultProps = {
	id: 0,
	origin: [0, 0],
	padding: 0,
	yScale: d3.scale.linear(),
	yMousePointerRectWidth: 50,
	yMousePointerRectHeight: 20,
	yMousePointerArrowWidth: 10,
	flipYScale: false,
};

Chart.contextTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	chartConfig: PropTypes.array,
	margin: PropTypes.object.isRequired,

	// adding here even when this is not used by Chart, refer to https://github.com/facebook/react/issues/2517
	// used by CurrentCoordinate
	currentItem: PropTypes.object,
	mouseXY: PropTypes.array,
	show: PropTypes.bool,
};

Chart.childContextTypes = {
	height: PropTypes.number,
	width: PropTypes.number,
	chartConfig: PropTypes.object.isRequired,
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,
	chartId: PropTypes.number.isRequired,
};

export default Chart;
