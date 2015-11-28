"use strict";

import React from "react";
import objectAssign from "object-assign";

import ChartDataUtil from "./utils/ChartDataUtil";
import { DummyTransformer } from "./transforms";
import EventHandler from "./EventHandler";
import CanvasContainer from "./CanvasContainer";


class ChartCanvas extends React.Component {
	constructor() {
		super();
		this.getCanvases = this.getCanvases.bind(this);
	}
	getDimensions(props) {
		return {
			height: props.height - props.margin.top - props.margin.bottom,
			width: props.width - props.margin.left - props.margin.right,
		};
	}
	pushData(array) {
		this.refs.chartContainer.pushData(array);
	}
	alterData(array) {
		this.refs.chartContainer.alterData(array);
	}
	getDataInfo() {
		return this.refs.chartContainer.getDataInfo();
	}
	setViewRange(start, end) {
		this.refs.chartContainer.setViewRange(start, end);
	}
	getCanvases() {
		if (this.refs && this.refs.canvases) {
			return this.refs.canvases.getCanvasContexts();
		}
	}
	render() {
		var dimensions = this.getDimensions(this.props);
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
		var { data, dataTransform, interval, initialDisplay, type, height, width, margin, className, clip, zIndex } = this.props;

		return (
			<div style={{position: "relative", height: height, width: width}} className={className} >
				<CanvasContainer ref="canvases" width={width} height={height} type={this.props.type} zIndex={zIndex}/>
				<svg width={width} height={height} style={{ position: "absolute", zIndex: (zIndex + 5) }}>
					<style type="text/css" dangerouslySetInnerHTML={{ __html: style }}>
					</style>
					<defs>
						<clipPath id="chart-area-clip">
							<rect x="0" y="0" width={dimensions.width} height={dimensions.height} />
						</clipPath>
					</defs>
					<g transform={`translate(${margin.left + 0.5}, ${margin.top + 0.5})`}>
						<EventHandler ref="chartContainer"
							rawData={data} dataTransform={dataTransform} interval={interval} 
							initialDisplay={initialDisplay}
							dimensions={dimensions} type={type} margin={margin} canvasContexts={this.getCanvases}>
							{this.props.children}
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
	className: React.PropTypes.string,
	zIndex: React.PropTypes.number,
	// clip: React.PropTypes.bool.isRequired,
};

ChartCanvas.defaultProps = {
	margin: {top: 20, right: 30, bottom: 30, left: 80},
	interval: "D",
	type: "hybrid",
	// defaultDataTransform: [ { transform: DummyTransformer } ],
	dataTransform: [ ],
	className: "react-stockchart",
	zIndex: 1,
	// clip: true,
	// initialDisplay: 30
};

export default ChartCanvas;
