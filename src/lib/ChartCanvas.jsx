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
		this.state = {
			canvasList: []
		}
	}
	getDimensions(props) {
		return {
			height: props.height - props.margin.top - props.margin.bottom,
			width: props.width - props.margin.left - props.margin.right,
		};
	}
	getChildContext() {
		return {
			canvasList: this.state.canvasList,
		};
	}
	getCanvasContextList() {
		var canvasList = Object.keys(this.refs)
			.filter(key => key.indexOf("chart_canvas_") > -1)
			.map(key => React.findDOMNode(this.refs[key]))
			.map(canvas => ({ id: canvas.id, context: canvas.getContext('2d') }));
		canvasList.forEach(ctx => ctx.context.translate(0.5, 0))
		return canvasList;
	}
	componentDidMount() {
		var canvasList = this.getCanvasContextList();
		this.setState({
			canvasList: canvasList,
		})
	}
	componentDidUpdate() {
		var newCanvasList = this.getCanvasContextList();
		var { canvasList } = this.state;
		if (canvasList.length !== newCanvasList.length) {
			this.setState({
				canvasList: newCanvasList,
			})
		} else {
			for (var i = 0; i < canvasList.length; i++) {
				var oldEach = canvasList[i];
				var newEach = newCanvasList[i];
				if (oldEach.id !== newEach.id || oldEach.context !== newEach.context) {
					this.setState({
						canvasList: newCanvasList,
					})
				}
			}
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
		var { data, options } = this.state;
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
		return (
			<div style={{position: "relative", height: height, width: width}} className={className} >
				<div style={{ position: "relative", top: margin.top, left: margin.left}}>
					{canvasList
						.map(each => <canvas key={each.id} ref={`chart_canvas_${ each.id }`} id={each.id}
							width={each.width} height={each.height}
							style={{ position: "absolute", left: `${ each.origin[0] }px`, top: `${ each.origin[1] }px`, zIndex: -1 }} /> )}
				</div>
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
	canvasList: React.PropTypes.array,
};

ChartCanvas.defaultProps = {
	margin: {top: 20, right: 30, bottom: 30, left: 80},
	interval: "D",
	type: "hybrid",
	defaultDataTransform: [ { transform: DummyTransformer } ],
	dataTransform: [ ],
	className: "react-stockchart",
	initialDisplay: 30
};

module.exports = ChartCanvas;
