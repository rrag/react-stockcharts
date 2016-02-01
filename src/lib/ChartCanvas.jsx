"use strict";

import React from "react";
import d3 from "d3";

import identity from "./utils/identity";
import { isDefined, isNotDefined } from "./utils/utils";
// import shallowEqual from "fbjs/lib/shallowEqual";
import shallowEqual from "./utils/shallowEqual";
import EventHandler from "./EventHandler";
import CanvasContainer from "./CanvasContainer";
import eodIntervalCalculator from "./scale/eodIntervalCalculator";
import evaluator from "./scale/evaluator";

function shouldResetChart(thisProps, nextProps) {
	var candidates = ["data", "interval", "discontinous", "intervalCalculator", "allowedIntervals",
		"xScale", /*"xAccessor",*/ "map", "dataEvaluator", "indexAccessor", "indexMutator"];
	return !candidates.every(key => {
		var result = shallowEqual(thisProps[key], nextProps[key])
		// console.log(key, result);
		return result;
	});
}

function getDimensions(props) {
	return {
		height: props.height - props.margin.top - props.margin.bottom,
		width: props.width - props.margin.left - props.margin.right,
	};
}

function calculateState(props) {
	var { data, calculator, interval } = props;
	var { xExtents: xExtentsProp, xScale, intervalCalculator, allowedIntervals } = props;
	var { xAccessor, map, dataEvaluator, indexAccessor, indexMutator, discontinous } = props;

	var dimensions = getDimensions(props);

	if (isDefined(interval)
		&& (isNotDefined(allowedIntervals)
			|| allowedIntervals.indexOf(interval) > -1)) throw new Error("interval has to be part of allowedInterval");

	var evaluate = dataEvaluator()
		.allowedIntervals(allowedIntervals)
		.intervalCalculator(intervalCalculator)
		.xAccessor(xAccessor)
		.discontinous(discontinous)
		.indexAccessor(indexAccessor)
		.indexMutator(indexMutator)
		.map(map)
		.scale(xScale)
		.calculator(calculator.slice());

	var { xAccessor: realXAccessor, inputXAccesor, domainCalculator: xExtentsCalculator, fullData } = evaluate(data);
	// xAccessor - if discontinious return indexAccessor, else xAccessor
	// inputXAccesor - send this down as context

	// console.log(xAccessor, inputXAccesor, domainCalculator, domainCalculator, updatedScale);
	// in componentWillReceiveProps calculate plotData and interval only if this.props.xExtentsProp != nextProps.xExtentsProp
	var extent = d3.extent(xExtentsProp.map(d3.functor).map(each => each(data)));

	var { plotData, interval: showingInterval, scale: updatedScale } = xExtentsCalculator
		.width(dimensions.width)
		.scale(xScale)
		.data(fullData)
		.interval(interval)(extent, inputXAccesor);

	return {
		fullData, plotData, showingInterval, xExtentsCalculator, xScale: updatedScale, xAccessor: realXAccessor
	};
}

class ChartCanvas extends React.Component {
	constructor() {
		super();
		this.pushData = this.pushData.bind(this);
		this.alterData = this.alterData.bind(this);
		this.getDataInfo = this.getDataInfo.bind(this);
		this.getCanvases = this.getCanvases.bind(this);
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
	getChildContext() {
		return {
			displayXAccessor: this.props.xAccessor,
		}
	}

	componentWillMount() {
		// console.log(plotData, updatedInterval, domain);
		// in EventHandler in componentWillReceiveProps if this.props.plotData !== nextProps.plotData then update state
		/*if (xAccessor !== realXAccessor) {
			var { left } = getClosestItemIndexes(data, startDate, xAccessor);
			var { endRight } = getClosestItemIndexes(data, endDate, xAccessor);
			var start = realXAccessor(left);
			var end = realXAccessor(right);
		}*/

		this.setState(calculateState(this.props));
	}
	componentWillReceiveProps(nextProps) {
		var reset = shouldResetChart(this.props, nextProps)
		console.log("shouldResetChart =", reset);
		var { xExtents: xExtentsProp, calculator } = nextProps;
		var { xAccessor, map, dataEvaluator, indexAccessor, indexMutator } = nextProps;

		if (reset) {
			console.log("RESET CHART");
			this.setState(calculateState(nextProps));
		} else if (!shallowEqual(this.props.xExtents, nextProps.xExtents)) {
			console.log("xExtents changed");
			// since the xExtents changed update fullData, plotData, xExtentsCalculator to state
			var { fullData, plotData, xExtentsCalculator } = calculateState(nextProps);
			this.setState({ fullData, plotData, xExtentsCalculator });
		} else if (!shallowEqual(this.props.calculator, nextProps.calculator)) {
			console.log("calculator changed");
			// data did not change but calculator changed, so update only the fullData to state
			var { fullData } = calculateState(nextProps);
			this.setState({ fullData });
		}
	}
	render() {
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

		var { interval, type, height, width, margin, className, zIndex } = this.props;
		var { fullData, plotData, showingInterval, xExtentsCalculator, xScale, xAccessor } = this.state;

		// console.log(data);
		var dimensions = getDimensions(this.props);
		var props = { interval, type, margin };
		var stateProps = { fullData, plotData, showingInterval, xExtentsCalculator, xScale, xAccessor};
		return (
			<div style={{ position: "relative", height: height, width: width }} className={className} >
				<CanvasContainer ref="canvases" width={width} height={height} type={type} zIndex={zIndex}/>
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
							{...props}
							{...stateProps}
							dimensions={dimensions}
							canvasContexts={this.getCanvases}>
							{this.props.children}
						</EventHandler>
					</g>
				</svg>
			</div>
		);
	}
}

/*
							interval={interval} type={type} margin={margin} 
							data={plotData} showingInterval={updatedInterval}
							xExtentsCalculator={domainCalculator} 
							xScale={updatedScale} xAccessor={xAccessor}
							dimensions={dimensions}

*/

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
	indexAccessor: d => d.idx,
	indexMutator: (d, idx) => d.idx = idx,
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

ChartCanvas.childContextTypes = {
	displayXAccessor: React.PropTypes.func.isRequired,
}

ChartCanvas.ohlcv = d => ({date:d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume});

export default ChartCanvas;
