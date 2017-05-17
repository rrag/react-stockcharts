"use strict";

import React from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";

import PureComponent from "./utils/PureComponent";
import { isNotDefined, noop } from "./utils";

class Chart extends PureComponent {
	constructor(props, context) {
		super(props, context);
		this.yScale = this.yScale.bind(this);
		this.listener = this.listener.bind(this);
	}
	componentWillMount() {
		var { id } = this.props;
		var { subscribe } = this.context;
		subscribe("chart_" + id, this.listener);
	}
	componentWillUnmount() {
		var { id } = this.props;
		var { unsubscribe } = this.context;
		unsubscribe("chart_" + id);
	}
	listener(type, moreProps, state, e) {
		var { id, onContextMenu } = this.props;

		if (type === "contextmenu") {
			var { currentCharts } = moreProps;
			if (currentCharts.indexOf(id) > -1) {
				onContextMenu(moreProps, e);
			}
		}
	}
	yScale() {
		var chartConfig = this.context.chartConfig.filter((each) => each.id === this.props.id)[0];
		return chartConfig.yScale.copy();
	}
	getChildContext() {
		var { id: chartId } = this.props;
		var chartConfig = this.context.chartConfig.filter((each) => each.id === chartId)[0];

		return {
			chartId,
			chartConfig,
		};
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
	]),
	yExtentsCalculator: function(props, propName, componentName) {
		if (isNotDefined(props.yExtents) && typeof props.yExtentsCalculator !== "function")
			return new Error("yExtents or yExtentsCalculator must"
				+ ` be present on ${componentName}. Validation failed.`);
	},
	onContextMenu: PropTypes.func.isRequired,
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
	children: PropTypes.node,
};

Chart.defaultProps = {
	id: 0,
	origin: [0, 0],
	padding: 0,
	yScale: scaleLinear(),
	flipYScale: false,
	yPan: true,
	onContextMenu: noop,
};

Chart.contextTypes = {
	chartConfig: PropTypes.array,
	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
};

Chart.childContextTypes = {
	chartConfig: PropTypes.object.isRequired,
	chartId: PropTypes.number.isRequired,
};

export default Chart;
