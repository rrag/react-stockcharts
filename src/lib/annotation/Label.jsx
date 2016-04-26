"use strict";

import d3 from "d3";
import React, { PropTypes, Component } from "react";

import pure from "../pure";
import { isDefined, hexToRGBA } from "../utils";
import LabelAnnotation, { drawOnCanvas, defaultProps } from "./LabelAnnotation";

class Label extends Component {

	componentDidMount() {
		var { selectCanvas, getCanvasContexts, chartConfig, chartCanvasType, text } = this.props;
		if (chartCanvasType !== "svg") {
			var ctx = selectCanvas(getCanvasContexts());
			var yScale = getYScale(chartConfig);

			drawOnCanvas2({ ...this.props, yScale, text: getText(this.props) }, ctx);
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	render() {
		var { chartConfig, chartCanvasType, text } = this.props;
		if (chartCanvasType !== "svg") return null;

		return <LabelAnnotation yScale={getYScale(chartConfig)} {...this.props} text={getText(this.props)}/>;
	}
}

function getText(props) {
	return d3.functor(props.text)(props);
}

function getYScale(chartConfig) {
	return Array.isArray(chartConfig) ? undefined : chartConfig.yScale;
}

Label.propTypes = {
	className: PropTypes.string,
	text: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func
	]).isRequired,
};

Label.defaultProps = {
	...defaultProps,
	selectCanvas: canvases => canvases.bg,
};

function drawOnCanvas2(props, ctx) {
	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	var { canvasOriginX, canvasOriginY, margin } = props;

	if (isDefined(canvasOriginX))
		ctx.translate(canvasOriginX, canvasOriginY);
	else
		ctx.translate(margin.left + 0.5, margin.top + 0.5);

	drawOnCanvas(props, ctx);

	ctx.restore();

}

export default pure(Label, {
	xScale: PropTypes.func,
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,
	xAccessor: PropTypes.func,
	chartConfig: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]).isRequired,
	chartCanvasType: PropTypes.string,
	getCanvasContexts: PropTypes.func,
	interval: PropTypes.string,
	plotData: PropTypes.array,
	margin: PropTypes.object,
});