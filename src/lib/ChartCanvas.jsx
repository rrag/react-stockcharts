"use strict";

import React from "react";
import objectAssign from "object-assign";

import ChartDataUtil from "./utils/ChartDataUtil";
import Utils from "./utils/utils";
import { DummyTransformer } from "./transforms";
import EventHandler from "./EventHandler";

class ChartCanvas extends React.Component {
	constructor() {
		super();
		this.getCanvasContextList = this.getCanvasContextList.bind(this);
	}
	getDimensions(props) {
		return {
			height: props.height - props.margin.top - props.margin.bottom,
			width: props.width - props.margin.left - props.margin.right,
		};
	}
	getChildContext() {
		var axesCanvasContext, mouseCoordCanvasContext;
		if (this.state.canvases) {
			axesCanvasContext = this.state.canvases.axesCanvasContext;
			mouseCoordCanvasContext = this.state.canvases.mouseCoordCanvasContext;
		}
		return {
			axesCanvasContext: axesCanvasContext,
			mouseCoordCanvasContext: mouseCoordCanvasContext,
			margin: this.props.margin,
		};
	}
	getCanvasContextList() {
		var contexts = ["canvas_axes", "canvas_mouse_coordinates"]
			.map(key => this.refs[key])
			.map(each => each.getContext('2d'))

		return {
			axesCanvasContext: contexts[0],
			mouseCoordCanvasContext: contexts[1],
		};
	}
	componentDidMount() {
		this.componentDidUpdate();
	}
	componentDidUpdate() {
		if (this.props.type === "svg" && this.state.canvases !== null) {
			this.setState({ canvases: null });
		} else if (this.props.type !== "svg" && !this.state.canvases) {
			var canvases = this.getCanvasContextList();
			this.setState({
				canvases: canvases
			});
		}
	}
	updateState(props, context) {
		var { defaultDataTransform, dataTransform, interval } = props;
		var i = 0, eachTransform, options = {}, data = props.data;
		var transforms = defaultDataTransform.concat(dataTransform);
		for (i = 0; i < transforms.length; i++) {
			// console.log(transforms[i]);
			eachTransform = transforms[i].transform();
			options = objectAssign({}, options, transforms[i].options);
			options = eachTransform.options(options);
			data = eachTransform(data, interval);
		}

		var state = {
			data: data,
			options: options
		};
		this.setState(state);
	}
	componentWillMount() {
		this.updateState(this.props);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.data !== nextProps.data || this.props.dataTransform !== nextProps.dataTransform) {
			this.updateState(nextProps);
		}
	}
	render() {
		var dimensions = this.getDimensions(this.props);
		var children = React.Children.map(this.props.children, (child) => {
			// console.log(child);
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
				// React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
			return newChild;
		});
		var style = `<![CDATA[
						.react-stockcharts-grabbing-cursor {
							cursor: grabbing;
							cursor: -moz-grabbing;
							cursor: -webkit-grabbing;
						}
						.react-stockcharts-crosshair-cursor {
							cursor: crosshair;
						}
						.react-stockcharts-toottip-hover {
							pointer-events: all;
							cursor: pointer;
						}
					]]>`;
		var { data, options, canvasList } = this.state;
		var { interval, initialDisplay, type, height, width, margin, className } = this.props;
		var displayCount = initialDisplay || this.props.data.length;

		var canvasList = [];
		if (type !== "svg") {
			canvasList = ChartDataUtil.getCharts(this.props)
				.map(each => ({
					width: each.props.width || dimensions.width,
					height: each.props.height || dimensions.height,
					origin: ChartDataUtil.getChartOrigin(each.props.origin, dimensions.width, dimensions.height),
					id: each.props.id,
				}));
		}
		var axesCanvas = (this.props.type !== "svg") ? <canvas key="axes" id="axes" ref="canvas_axes" width={width} height={height}
					style={{ position: "absolute", left: 0, top: 0, zIndex: -1 }} /> : null;
		var mouseCanvas = (this.props.type !== "svg") ? <canvas key="mouse_coordinates" id="mouse" ref="canvas_mouse_coordinates" width={width} height={height}
					style={{ position: "absolute", left: 0, top: 0, zIndex: -1 }} /> : null;
		return (
			<div style={{position: "relative", height: height, width: width}} className={className} >
				{axesCanvas}
				{mouseCanvas}
				<svg width={width} height={height} style={{ position: "absolute" }}>
					<style type="text/css" dangerouslySetInnerHTML={{ __html: style }}>
					</style>
					<defs>
						<clipPath id="chart-area-clip">
							<rect x="0" y="0" width={dimensions.width} height={dimensions.height} />
						</clipPath>
					</defs>
					<g transform={`translate(${margin.left}, ${margin.top})`}>
						<EventHandler ref="chartContainer"
							data={data} options={options} interval={interval} 
							initialDisplay={initialDisplay}
							dimensions={dimensions} type={type} >
							{children}
						</EventHandler>
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
	dataTransform: React.PropTypes.array.isRequired,
	className: React.PropTypes.string
};

ChartCanvas.childContextTypes = {
	axesCanvasContext: React.PropTypes.object,
	mouseCoordCanvasContext: React.PropTypes.object,
	margin: React.PropTypes.object,
};

ChartCanvas.defaultProps = {
	margin: {top: 20, right: 30, bottom: 30, left: 80},
	interval: "D",
	type: "hybrid",
	defaultDataTransform: [ { transform: DummyTransformer } ],
	dataTransform: [ ],
	className: "react-stockchart",
	// initialDisplay: 30
};

module.exports = ChartCanvas;
