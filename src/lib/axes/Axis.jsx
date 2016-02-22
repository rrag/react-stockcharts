"use strict";

import React, { PropTypes, Component } from "react";

import AxisTicks from "./AxisTicks";
import AxisLine from "./AxisLine";

import { isDefined } from "../utils";

class Axis extends Component {
	constructor(props) {
		super(props);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props, this.context);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		var { margin, chartId, canvasOriginX, canvasOriginY } = nextContext;
		var draw = Axis.drawOnCanvasStatic.bind(null, margin, nextProps, [canvasOriginX, canvasOriginY]);

		nextContext.callbackForCanvasDraw({
			chartId: chartId,
			type: "axis",
			draw: draw,
		});
	}
	componentDidMount() {
		if (this.context.chartCanvasType !== "svg" && isDefined(this.context.getCanvasContexts)) {
			var contexts = this.context.getCanvasContexts();
			if (contexts) this.drawOnCanvas(contexts.axes);
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	drawOnCanvas(ctx) {
		var { margin, canvasOriginX, canvasOriginY } = this.context;
		var { scale } = this.props;

		Axis.drawOnCanvasStatic(margin, this.props, [canvasOriginX, canvasOriginY], ctx, scale, scale);
	}

	render() {
		if (this.context.chartCanvasType !== "svg") return null;

		var domain = this.props.showDomain
			? <AxisLine {...this.props} />
			: null;
		var ticks = this.props.showTicks
			? <AxisTicks {...this.props} />
			: null;

		var className = "";
		if (this.props.className) className = this.props.defaultClassName.concat(this.props.className);
		return (
			<g className={className}
				transform={`translate(${ this.props.transform[0] }, ${ this.props.transform[1] })`}>
				{ticks}
				{domain}
			</g>
		);
	}
}

Axis.propTypes = {
	className: PropTypes.string.isRequired,
	defaultClassName: PropTypes.string.isRequired,
	transform: PropTypes.arrayOf(Number).isRequired,
	orient: PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
	innerTickSize: PropTypes.number,
	outerTickSize: PropTypes.number,
	tickFormat: PropTypes.func,
	tickPadding: PropTypes.number,
	tickSize: PropTypes.number,
	ticks: PropTypes.array,
	tickValues: PropTypes.array,
	scale: PropTypes.func.isRequired,
	showDomain: PropTypes.bool.isRequired,
	showTicks: PropTypes.bool.isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number.isRequired,
};

Axis.defaultProps = {
	defaultClassName: "react-stockcharts-axis ",
	showDomain: true,
	showTicks: true,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
};

Axis.contextTypes = {
	getCanvasContexts: PropTypes.func,
	chartCanvasType: PropTypes.string,
	chartId: PropTypes.number.isRequired,
	margin: PropTypes.object.isRequired,
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,
	// secretToSuperFastCanvasDraw: PropTypes.array.isRequired,
	callbackForCanvasDraw: PropTypes.func.isRequired,
};

Axis.drawOnCanvasStatic = (margin, props, canvasOrigin, ctx, xScale, yScale) => {
	var { transform, showDomain, showTicks } = props;
	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOrigin[0] + transform[0], canvasOrigin[1] + transform[1]);

	if (showDomain) AxisLine.drawOnCanvasStatic(props, ctx, xScale, yScale);
	if (showTicks) AxisTicks.drawOnCanvasStatic(props, ctx, xScale, yScale);

	ctx.restore();
};

export default Axis;
