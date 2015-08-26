"use strict";

import React from "react";
import ChartDataUtil from "./utils/ChartDataUtil";
import Utils from "./utils/utils";
import objectAssign from "object-assign";
import { DummyTransformer } from "./transforms";
import EventHandler from "./EventHandler";

class ChartCanvas extends React.Component {
	constructor() {
		super();
		this.createCanvas = this.createCanvas.bind(this);
	}
	getDimensions(props) {
		return {
			height: props.height - props.margin.top - props.margin.bottom,
			width: props.width - props.margin.left - props.margin.right,
		};
	}
	getChildContext() {
		return {
			createCanvas: this.createCanvas,
		};
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
	createCanvas(origin, width, height) {
		let canvas = document.createElement("canvas");
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		canvas.setAttribute("style", `position: absolute; left: ${ origin[0] }px; top: ${ origin[1] }px; z-index: -1`);

		React.findDOMNode(this.refs.canvasContainer).appendChild(canvas);
		return canvas;
	}
	render() {
		var dimensions = this.getDimensions(this.props);
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
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
		var { data, options } = this.state;
		var { interval, initialDisplay, type, height, width, margin, className } = this.props;
		var displayCount = initialDisplay || this.props.data.length;
		return (
			<div style={{position: "relative", height: height, width: width}} className={className} >
				<div ref="canvasContainer" style={{ position: "relative", top: margin.top, left: margin.left}}></div>
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
							dimensions={dimensions} type={type}>
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
	// width: React.PropTypes.number.isRequired,
	// height: React.PropTypes.number.isRequired,
	// data: React.PropTypes.object.isRequired,
	// interval: React.PropTypes.string.isRequired,
	// initialDisplay: React.PropTypes.number.isRequired,
	// initialStartIndex: React.PropTypes.number.isRequired,
	// plotData: React.PropTypes.array,
	// chartData: React.PropTypes.array,
	// dataTransformProps: React.PropTypes.object,

	createCanvas: React.PropTypes.func,
	// type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	// recordInitialState: React.PropTypes.func.isRequired,
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
