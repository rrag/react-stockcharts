"use strict";

import React from "react";
import d3 from "d3";

import identity from "./utils/identity";
import { isDefined, isNotDefined } from "./utils/utils";
import EventHandler from "./EventHandler";
import CanvasContainer from "./CanvasContainer";
import eodIntervalCalculator from "./scale/eodIntervalCalculator";
import evaluator from "./scale/evaluator";

class ChartCanvas extends React.Component {
	constructor() {
		super();
		this.pushData = this.pushData.bind(this);
		this.alterData = this.alterData.bind(this);
		this.getDataInfo = this.getDataInfo.bind(this);
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
	/*setViewRange(start, end) {
		this.refs.chartContainer.setViewRange(start, end);
	}*/
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
		var { data: rawData, calculator, interval, type, height, width, margin, className, zIndex } = this.props;
		var { xExtents: xExtentsProp, xScale, intervalCalculator, allowedIntervals, calculator } = this.props;
		var { xAccessor, map, dataEvaluator, indexPath, discontinous } = this.props;

		if (isDefined(interval)
			&& (isNotDefined(allowedIntervals)
				|| allowedIntervals.indexOf(interval) > -1)) throw new Error("interval has to be part of allowedInterval");

		var evaluate = dataEvaluator()
			.allowedIntervals(allowedIntervals)
			.intervalCalculator(intervalCalculator)
			.xAccessor(xAccessor)
			.discontinous(discontinous)
			.index(indexPath) // use this only when discontinous
			.map(map)
			.scale(xScale.range([0, dimensions.width])) // if discontinous then set dateAccessor and indexAccessor
			.calculator(calculator); // if there is a discontinious xScale providing
									 // calculator validate if the incoming scale is discontinous, 

		var { xAccessor, inputXAccesor, initialDomainCalculator, domainCalculator} = evaluate(rawData);
		// xAccessor - if discontinious return indexAccessor, else xAccessor
		// inputXAccesor - send this down as context

		// console.log(xAccessor, inputXAccesor, initialDomainCalculator, domainCalculator, updatedScale);
		// in componentWillReceiveProps calculate plotData and interval only if this.props.xExtentsProp != nextProps.xExtentsProp
		var extent = d3.extent(xExtentsProp.map(d3.functor).map(each => each(rawData)));
		// var e = d3.extent(rawData, xExtentsProp.map(d3.functor));

		var { plotData, interval: updatedInterval, domain, scale: updatedScale } = initialDomainCalculator
			.width(dimensions.width)
			.interval(interval)(extent, inputXAccesor)
			// .xExtents(xExtents)

		// console.log(plotData, updatedInterval, domain);
		// in EventHandler in componentWillReceiveProps if this.props.plotData !== nextProps.plotData then update state
		/*if (xAccessor !== realXAccessor) {
			var { left } = getClosestItemIndexes(data, startDate, xAccessor);
			var { endRight } = getClosestItemIndexes(data, endDate, xAccessor);
			var start = realXAccessor(left);
			var end = realXAccessor(right);
		}*/

		return (
			<div style={{ position: "relative", height: height, width: width }} className={className} >
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
							data={plotData} interval={updatedInterval}
							xExtentsCalculator={domainCalculator} 
							xScale={updatedScale} xAccessor={xAccessor}
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
	interval: React.PropTypes.oneOf(["D", "W", "M"]), // ,"m1", "m5", "m15", "W", "M"
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	data: React.PropTypes.array.isRequired,
	initialDisplay: React.PropTypes.number,
	dataPreProcessor: React.PropTypes.func.isRequired,
	calculator: React.PropTypes.arrayOf(React.PropTypes.func).isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	xExtents: React.PropTypes.oneOfType([
		React.PropTypes.arrayOf(React.PropTypes.func),
		React.PropTypes.arrayOf(React.PropTypes.number),
		React.PropTypes.arrayOf(React.PropTypes.instanceOf(Date)),
		// React.PropTypes.func,
	]),
	xScale: React.PropTypes.func.isRequired,
	className: React.PropTypes.string,
	zIndex: React.PropTypes.number,
	children: React.PropTypes.node.isRequired,
	discontinous: React.PropTypes.bool.isRequired,
};

ChartCanvas.defaultProps = {
	margin: { top: 20, right: 30, bottom: 30, left: 80 },
	indexPath: "idx",
	map: identity,
	type: "hybrid",
	dataPreProcessor: identity,
	calculator: [],
	className: "react-stockchart",
	zIndex: 1,
	xExtents: [d3.min, d3.max],
	intervalCalculator: eodIntervalCalculator,
	dataEvaluator: evaluator,
	discontinous: false,
	// initialDisplay: 30
};

ChartCanvas.ohlcv = d => ({date:d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume});

export default ChartCanvas;
