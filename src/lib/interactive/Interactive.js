"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";

class Interactive extends Component {
	constructor(props) {
		super(props);
		this.panHandler = this.panHandler.bind(this);
	}
	panHandler(propOverride) {
		var { forChart } = this.props;
		var { chartConfig } = propOverride;

		var singleChartConfig = chartConfig.filter(each => each.id === forChart)[0];

		this.setState({
			...propOverride,
			chartConfig: singleChartConfig,
		});
	}
	componentWillReceiveProps(nextProps) {
		var { plotData, xScale, chartConfig, forChart } = nextProps;
		var { mouseXY, currentItem, currentCharts, interactiveState } = nextProps;

		var singleChartConfig = chartConfig.filter(each => each.id === forChart)[0];

		this.setState({
			xScale,
			chartConfig: singleChartConfig,
			plotData,
			mouseXY,
			currentCharts,
			currentItem,
			interactiveState,
		});

		var { id, chartCanvasType, callbackForCanvasDraw, getAllCanvasDrawCallback } = nextProps;

		if (chartCanvasType !== "svg") {
			var temp = getAllCanvasDrawCallback().filter(each => each.type === "annotation").filter(each => each.id === id);
			if (temp.length === 0) {
				callbackForCanvasDraw({
					id,
					type: "annotation",
					draw: this.panHandler,
				});
			} else {
				callbackForCanvasDraw(temp[0], {
					id,
					type: "annotation",
					draw: this.panHandler,
				});
			}
		}
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props);
	}
	getChildContext() {
		var { forChart, chartConfig } = this.props;
		var singleChartConfig = chartConfig.filter(each => each.id === forChart)[0];

		return this.state;
	}
	render() {
		var { className } = this.props;
		var { origin } = this.state.chartConfig;
		var [x, y] = origin;
		// 
		return (
			<g transform={`translate(${ x }, ${ y })`} className={className}>
				{this.props.children}
			</g>
		);
	}
}

Interactive.childContextTypes = {
	xScale: PropTypes.func.isRequired,
	chartConfig: PropTypes.object.isRequired,
	plotData: PropTypes.array.isRequired,
	mouseXY: PropTypes.array,
	currentCharts: PropTypes.arrayOf(PropTypes.number),
	currentItem: PropTypes.object,
	interactiveState: PropTypes.array.isRequired,
}

Interactive.propTypes = {
	className: PropTypes.string,
	// id: PropTypes.number.isRequired,
	forChart: PropTypes.number.isRequired,
	xAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
};

export default pure(Interactive, {
	interactiveState: PropTypes.array.isRequired,
	show: PropTypes.bool,

	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
	chartConfig: PropTypes.array.isRequired,
	mouseXY: PropTypes.array,
	currentItem: PropTypes.object,
	currentCharts: PropTypes.arrayOf(PropTypes.number),

	chartCanvasType: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
	xAccessor: PropTypes.func.isRequired,

	setInteractiveState: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
});
