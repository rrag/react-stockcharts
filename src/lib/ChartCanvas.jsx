"use strict";

import React from "react";
import ChartDataUtil from "./utils/ChartDataUtil";
import Canvas from "./Canvas";
import Utils from "./utils/utils";
import objectAssign from "object-assign";

import d3 from "d3";

var c = d3.scale.category10();

class ChartCanvas extends React.Component {
	constructor() {
		super();
		this.recordInitialState = this.recordInitialState.bind(this);
		this.createCanvas = this.createCanvas.bind(this);
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
			createCanvas: this.createCanvas,
			type: this.props.type,
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
	createCanvas(origin, width, height) {
		let canvas = document.createElement("canvas"); //<Canvas width={width} height={height} top={origin[1]} left={origin[0]} />
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		canvas.setAttribute("height", height);
		canvas.setAttribute("style", `position: absolute; left: ${ origin[0] }px; top: ${ origin[1] }px; z-index: -1`);
		var ctx = canvas.getContext("2d");
		/*var l = React.findDOMNode(this.refs.canvasContainer).childNodes.length;
		ctx.fillStyle = c(l);
		ctx.fillRect(0, 0, 20 * (10 - l), height);*/
		React.findDOMNode(this.refs.canvasContainer).appendChild(canvas);
		return canvas;
	}
	recordInitialState(initial) {
		this.setState({
			initial: initial
		})
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
			<div style={{position: "relative", height: this.props.height, width: this.props.width}}>
				<div ref="canvasContainer" style={{ position: "relative", top: this.props.margin.top, left: this.props.margin.left}}></div>
				<svg width={this.props.width} height={this.props.height} style={{ position: "absolute" }}>
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
	interval: React.PropTypes.oneOf(["D", "W", "M"]).isRequired, // ,"m1", "m5", "m15", "W", "M"
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
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
	chartData: React.PropTypes.array,

	createCanvas: React.PropTypes.func,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	recordInitialState: React.PropTypes.func.isRequired,
};

ChartCanvas.defaultProps = {
	margin: {top: 20, right: 30, bottom: 30, left: 80},
	interval: "D",
	type: "svg"
};

module.exports = ChartCanvas;
