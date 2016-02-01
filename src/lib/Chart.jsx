"use strict";

import React from "react";
import d3 from "d3";
import objectAssign from "object-assign";

import PureComponent from "./utils/PureComponent";
import { isReactVersion13 } from "./utils/utils";
import { getChartOrigin } from "./utils/ChartDataUtil";

class Chart extends PureComponent {
	constuctor(props) {
		this.yScale = this.yScale.bind(this);
	}
	yScale() {
		var chartConfig = this.context.chartConfig.filter((each) => each.id === this.props.id)[0];
		return chartConfig.yScale.copy();
	}
	getChildContext() {
		var { id: chartId } = this.props
		var chartConfig = this.context.chartConfig.filter((each) => each.id === chartId)[0];

		var canvasOriginX = 0.5 + chartConfig.origin[0] + this.context.margin.left;
		var canvasOriginY = 0.5 + chartConfig.origin[1] + this.context.margin.top;

		// console.log(chartConfig.config.compareSeries);
		return { chartId, chartConfig, canvasOriginX, canvasOriginY };
	}
	render() {
		var { origin } = this.context.chartConfig.filter((each) => each.id === this.props.id)[0];
		var [x, y] = origin;

		return <g transform={`translate(${ x }, ${ y })`}>{this.props.children}</g>;
	}
}

Chart.propTypes = {
	height: React.PropTypes.number,
	width: React.PropTypes.number,
	origin: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.func
	]).isRequired,
	id: React.PropTypes.number.isRequired,
	yScale: React.PropTypes.func.isRequired,
	yMousePointerDisplayLocation: React.PropTypes.oneOf(["left", "right"]),
	yMousePointerDisplayFormat: React.PropTypes.func,
	padding: React.PropTypes.shape({
		top: React.PropTypes.number,
		bottom: React.PropTypes.number,
	}).isRequired,

};

Chart.defaultProps = {
	id: 0,
	// namespace: "ReStock.Chart",
	origin: [0, 0],
	padding: { top: 0, bottom: 0 },
	yScale: d3.scale.linear(),
};

Chart.contextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	chartConfig: React.PropTypes.array,
	margin: React.PropTypes.object.isRequired,
	interactiveState: React.PropTypes.array.isRequired,
	currentItem: React.PropTypes.object.isRequired,
	mouseXY: React.PropTypes.array,
	show: React.PropTypes.bool,
	// adding here even when this is not used by Chart, refer to https://github.com/facebook/react/issues/2517
};

Chart.childContextTypes = {
	chartConfig: React.PropTypes.object.isRequired,
	canvasOriginX: React.PropTypes.number,
	canvasOriginY: React.PropTypes.number,
	chartId: React.PropTypes.number.isRequired,
};

export default Chart;
