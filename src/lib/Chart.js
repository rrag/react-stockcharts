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
		const { id } = this.props;
		const { subscribe } = this.context;
		subscribe("chart_" + id,
			{
				listener: this.listener,
			}
		);
	}
	componentWillUnmount() {
		const { id } = this.props;
		const { unsubscribe } = this.context;
		unsubscribe("chart_" + id);
	}
	listener(type, moreProps, state, e) {
		const { id, onContextMenu } = this.props;

		if (type === "contextmenu") {
			const { currentCharts } = moreProps;
			if (currentCharts.indexOf(id) > -1) {
				onContextMenu(moreProps, e);
			}
		}
	}
	yScale() {
		const chartConfig = this.context.chartConfig.filter((each) => each.id === this.props.id)[0];
		return chartConfig.yScale.copy();
	}
	getChildContext() {
		const { id: chartId } = this.props;
		const chartConfig = this.context.chartConfig.filter((each) => each.id === chartId)[0];

		return {
			chartId,
			chartConfig,
		};
	}
	render() {
		const { origin } = this.context.chartConfig.filter((each) => each.id === this.props.id)[0];
		const [x, y] = origin;

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
