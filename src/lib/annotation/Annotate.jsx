"use strict";

import React, { PropTypes, Component } from "react";
import ReactDOM from "react-dom";
import d3 from "d3";


import pure from "../pure";
import wrap from "../series/wrap";
import { isDefined } from "../utils";

class Annotate extends Component {
	componentDidMount() {
		annotate(this.refs.annotation, this.props, this.props, true);
	}
	componentDidUpdate() {
		annotate(this.refs.annotation, this.props, this.props, false);
	}
	render() {
		var { className } = this.props;
		return (
			<g ref="annotation" className={className}>
			</g>
		);
	}
}

Annotate.propTypes = {
	with: PropTypes.func,
	when: PropTypes.func,
	usingProps: PropTypes.object,
};

Annotate.defaultProps = {
	className: "react-stockcharts-Annotate",
};

function helper({ when }, plotData) {
	return plotData.filter(when);
}

function annotate(node, props, { xScale, chartConfig, plotData }, isFirstTime) {
	var data = helper(props, plotData);
	var { className, xAccessor, usingProps, with: annotation } = props;

	console.log(node, d3.select(node));
	var a = annotation()
		.props(props)
		.parentNode(d3.select(node))

	a(data, isFirstTime);
}
Annotate.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var data = helper(props, plotData);
	var { className, xAccessor, usingProps, with: Annotation } = props;

	var p = {
		...Annotation.defaultProps,
		...usingProps,
		xScale,
		yScale,
		xAccessor
	};

	data.forEach(d => {
		Annotation.drawOnCanvas({ ...p, datum: d }, ctx);
	});
};

export default pure(Annotate, {
	getCanvasContexts: PropTypes.func,
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	callbackForCanvasDraw: PropTypes.func.isRequired,
	chartId: PropTypes.number.isRequired,
	// seriesId: PropTypes.number.isRequired,
	// stroke: PropTypes.string,
	// fill: PropTypes.string,
	chartConfig: PropTypes.object.isRequired,
	chartCanvasType: PropTypes.string,
	xScale: PropTypes.func.isRequired,
	// yScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	plotData: PropTypes.array.isRequired,
});
