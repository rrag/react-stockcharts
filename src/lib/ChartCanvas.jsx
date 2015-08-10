"use strict";

import React from "react";
import ChartDataUtil from "./utils/ChartDataUtil";
import Canvas from "./Canvas";
import Utils from "./utils/utils";
import objectAssign from "object-assign";

class ChartCanvas extends React.Component {
	constructor() {
		super();
		this.recordInitialState = this.recordInitialState.bind(this);
	}
	getAvailableHeight(props) {
		return props.height - props.margin.top - props.margin.bottom;
	}
	getAvailableWidth(props) {
		return props.width - props.margin.left - props.margin.right;
	}
	getChildContext() {
		return {
			width: this.getAvailableWidth(this.props),
			height: this.getAvailableHeight(this.props),
			data: this.state.data,
			interval: this.props.interval,
			initialDisplay: this.props.initialDisplay || this.state.plotData.length,
			initialStartIndex: this.props.initialStartIndex || 0,
			plotData: this.state.plotData,
			chartData: this.state.chartData,
			recordInitialState: this.recordInitialState,
		};
	}
	updateState(props, context) {
		var data = {};
		data[this.props.interval] = props.data;

		var state = {
			data: data,
			plotData: props.data
		};
		if (ChartDataUtil.containsChart(props)) {
			var defaultOptions = {
				width: this.getAvailableWidth(props),
				height: this.getAvailableHeight(props),
			};
			var plotData = props.data;
			var chartData = ChartDataUtil.getChartData(props, context, plotData, data, defaultOptions);

			state.chartData = chartData;
			state.plotData = plotData;
		}
		this.setState(state);
	}
	componentWillMount() {
		this.updateState(this.props)
	}
	componentWillReceiveProps(nextProps) {
		this.updateState(nextProps)
	}
	getCanvas() {
		return this.refs.canvas.getCanvas();
	}
	recordInitialState(initial) {
		this.setState({
			initial: initial
		})
		// console.log("recordInitialState ...", initial);
	}
	render() {
		var w = this.getAvailableWidth(this.props), h = this.getAvailableHeight(this.props);
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
			return newChild;
		});
		return (
			<div style={{position: "relative"}}>
				<svg width={this.props.width} height={this.props.height}>
					<defs>
						<clipPath id="chart-area-clip">
							<rect x="0" y="0" width={w} height={h} />
						</clipPath>
					</defs>
					<g transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`}>
						{children}
					</g>
				</svg>
			</div>
		);
	}
}

ChartCanvas.propTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	margin: React.PropTypes.object,
	interval: React.PropTypes.oneOf(["D"]).isRequired, // ,"m1", "m5", "m15", "W", "M"
	data: React.PropTypes.array.isRequired,
	initialDisplay: React.PropTypes.number,
};

ChartCanvas.childContextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	data: React.PropTypes.object.isRequired,
	interval: React.PropTypes.string.isRequired,
	initialDisplay: React.PropTypes.number.isRequired,
	initialStartIndex: React.PropTypes.number.isRequired,
	plotData: React.PropTypes.array,
	// canvas: React.PropTypes.any,
	chartData: React.PropTypes.array,

	recordInitialState: React.PropTypes.func.isRequired,
};

ChartCanvas.defaultProps = {
	margin: {top: 20, right: 30, bottom: 30, left: 80},
	interval: "D",
};

module.exports = ChartCanvas;
