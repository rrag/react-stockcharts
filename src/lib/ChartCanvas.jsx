"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import { shallowEqual, identity, isDefined } from "./utils";
import { shouldShowCrossHairStyle } from "./utils/ChartDataUtil";

import EventHandler from "./EventHandler";
import CanvasContainer from "./CanvasContainer";
import evaluator from "./scale/evaluator";

const CANDIDATES_FOR_RESET = ["seriesName", /* "data",*/
	"xScaleProvider", /* "xAccessor",*/"map",
	"indexAccessor", "indexMutator"];

function shouldResetChart(thisProps, nextProps) {
	return !CANDIDATES_FOR_RESET.every(key => {
		var result = shallowEqual(thisProps[key], nextProps[key]);
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

function calculateFullData(props) {
	var { data: inputData, calculator, plotFull, xScale: xScaleProp } = props;
	var { xAccessor: inputXAccesor, map, xScaleProvider, indexAccessor, indexMutator } = props;

	var wholeData = isDefined(plotFull)
			? plotFull
			: inputXAccesor === identity;

	// xScale = discontinuousTimeScaleProvider(data);
	var dimensions = getDimensions(props);
	var evaluate = evaluator()
		// .allowedIntervals(allowedIntervals)
		// .intervalCalculator(intervalCalculator)
		.xAccessor(inputXAccesor)
		// .discontinuous(discontinuous)
		.indexAccessor(indexAccessor)
		.indexMutator(indexMutator)
		.map(map)
		.useWholeData(wholeData)
		.width(dimensions.width)
		.scaleProvider(xScaleProvider)
		.xScale(xScaleProp)
		.calculator(calculator);

	var { xAccessor, displayXAccessor, xScale, filterData, lastItem } = evaluate(inputData);

	return { xAccessor, displayXAccessor, xScale, filterData, lastItem };
}

function calculateState(props) {

	var { xAccessor: inputXAccesor, xExtents: xExtentsProp, data } = props;

	var extent = typeof xExtentsProp === "function"
		? xExtentsProp(data)
		: d3.extent(xExtentsProp.map(d => d3.functor(d)).map(each => each(data, inputXAccesor)));

	var { xAccessor, displayXAccessor, xScale, filterData, lastItem } = calculateFullData(props);

	var { plotData, domain } = filterData(extent, inputXAccesor);

	return {
		plotData,
		filterData,
		xScale: xScale.domain(domain),
		xAccessor,
		displayXAccessor,
		dataAltered: false,
		lastItem,
	};
}

function getCursorStyle(children) {
	var style = `
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
	}`;
	var tooltipStyle = `
	.react-stockcharts-avoid-interaction {
  		pointer-events: none;
	}
	.react-stockcharts-default-cursor {
		cursor: default;
	}
	.react-stockcharts-move-cursor {
		cursor: move;
	}
	.react-stockcharts-ns-resize-cursor {
		cursor: ns-resize;
	}
	.react-stockcharts-ew-resize-cursor {
		cursor: ew-resize;
	}`;
	/* return (<style
		type="text/css"
		dangerouslySetInnerHTML={{
			__html: shouldShowCrossHairStyle(children) ? style + tooltipStyle : tooltipStyle
		}}></style>);*/
	return (<style type="text/css">{shouldShowCrossHairStyle(children) ? style + tooltipStyle : tooltipStyle}</style>);
}

class ChartCanvas extends Component {
	constructor() {
		super();
		this.getDataInfo = this.getDataInfo.bind(this);
		this.getCanvases = this.getCanvases.bind(this);
	}
	getDataInfo() {
		return this.refs.chartContainer.getDataInfo();
	}
	getCanvases() {
		if (this.refs && this.refs.canvases) {
			return this.refs.canvases.getCanvasContexts();
		}
	}
	componentWillMount() {
		this.setState(calculateState(this.props));
	}
	componentWillReceiveProps(nextProps) {
		var reset = shouldResetChart(this.props, nextProps);
		// console.log("shouldResetChart =", reset);

		/*
		plotData,
		filterData,
		xScale: xScale.domain(domain),
		xAccessor,
		dataAltered: false,
		lastItem, */

		if (reset) {
			if (process.env.NODE_ENV !== "production") console.log("RESET CHART, one or more of these props changed", CANDIDATES_FOR_RESET);
			this.setState(calculateState(nextProps));
		} else if (!shallowEqual(this.props.xExtents, nextProps.xExtents)) {
			if (process.env.NODE_ENV !== "production") console.log("xExtents changed");
			// since the xExtents changed update plotData, xScale, filterData to state
			let { plotData, xScale, xAccessor, filterData, lastItem } = calculateState(nextProps);
			this.setState({ plotData, xScale, xAccessor, filterData, lastItem, dataAltered: false });
		} else if (this.props.data !== nextProps.data) {
			if (process.env.NODE_ENV !== "production") console.log("data is changed but seriesName did not");
			// this means there are more points pushed/removed or existing points are altered
			let { xScale, xAccessor, filterData, lastItem } = calculateFullData(nextProps);
			this.setState({ xScale, xAccessor, filterData, lastItem, dataAltered: true });
		} else if (!shallowEqual(this.props.calculator, nextProps.calculator)) {
			if (process.env.NODE_ENV !== "production") console.log("calculator changed");
			// data did not change but calculator changed, so update only the filterData to state
			let { xAccessor, filterData, lastItem } = calculateFullData(nextProps);
			this.setState({ xAccessor, filterData, lastItem, dataAltered: false });
		} else {
			if (process.env.NODE_ENV !== "production")
				console.log("Trivial change, may be width/height or type changed, but that does not matter");
		}
	}
	render() {
		var cursor = getCursorStyle(this.props.children);

		var { type, height, width, margin, className, zIndex, postCalculator, flipXScale } = this.props;
		var { padding } = this.props;

		var { plotData, filterData, xScale, xAccessor, dataAltered, lastItem, displayXAccessor } = this.state;
		var dimensions = getDimensions(this.props);
		// var stateProps = { fullData, plotData, showingInterval, xExtentsCalculator, xScale, xAccessor, dataAltered };
		var props = { padding, type, margin, postCalculator };
		var stateProps = { plotData, filterData, xScale, xAccessor, dataAltered, lastItem, displayXAccessor };
		return (
			<div style={{ position: "relative", height: height, width: width }} className={className} >
				<CanvasContainer ref="canvases" width={width} height={height} type={type} zIndex={zIndex}/>
				<svg className={className} width={width} height={height} style={{ position: "absolute", zIndex: (zIndex + 5) }}>
					{cursor}
					<defs>
						<clipPath id="chart-area-clip">
							<rect x="0" y="0" width={dimensions.width} height={dimensions.height} />
						</clipPath>
					</defs>
					<g transform={`translate(${margin.left + 0.5}, ${margin.top + 0.5})`}>
						<EventHandler ref="chartContainer"
							{...props}
							{...stateProps}
							direction={flipXScale ? -1 : 1}
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
							lastItem={last(data)}

*/

ChartCanvas.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	margin: PropTypes.object,
	// interval: PropTypes.oneOf(["D", "W", "M"]), // ,"m1", "m5", "m15", "W", "M"
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	data: PropTypes.array.isRequired,
	// initialDisplay: PropTypes.number,
	calculator: PropTypes.arrayOf(PropTypes.func).isRequired,
	xAccessor: PropTypes.func,
	xExtents: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	// xScale: PropTypes.func.isRequired,
	className: PropTypes.string,
	seriesName: PropTypes.string.isRequired,
	zIndex: PropTypes.number,
	children: PropTypes.node.isRequired,
	xScaleProvider: function(props, propName/* , componentName */) {
		if (isDefined(props[propName]) &&  typeof props[propName] === "function" && isDefined(props.xScale)) {
			return new Error("Do not define both xScaleProvider and xScale choose only one");
		}
	},
	xScale: function(props, propName/* , componentName */) {
		if (isDefined(props[propName]) &&  typeof props[propName] === "function" && isDefined(props.xScaleProvider)) {
			return new Error("Do not define both xScaleProvider and xScale choose only one");
		}
	},
	postCalculator: PropTypes.func.isRequired,
	flipXScale: PropTypes.bool.isRequired,
	padding: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.shape({
			left: PropTypes.number,
			right: PropTypes.number,
		})
	]).isRequired,
};

ChartCanvas.defaultProps = {
	margin: { top: 20, right: 30, bottom: 30, left: 80 },
	indexAccessor: d => d.idx,
	indexMutator: (d, idx) => ({ ...d, idx }),
	map: identity,
	type: "hybrid",
	calculator: [],
	className: "react-stockchart",
	zIndex: 1,
	xExtents: [d3.min, d3.max],
	// dataEvaluator: evaluator,
	postCalculator: identity,
	padding: 0,
	xAccessor: identity,
	flipXScale: false,
	// initialDisplay: 30
};

ChartCanvas.ohlcv = d => ({ date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume });

export default ChartCanvas;