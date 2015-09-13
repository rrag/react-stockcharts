"use strict";

import React from "react";

import AxisTicks from "./AxisTicks";
import AxisLine from "./AxisLine";

class Axis extends React.Component {
	constructor(props) {
		super(props);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.props.type !== "svg" && this.context.axesCanvasContext !== undefined) this.drawOnCanvas();
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props, this.context);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		var { axesCanvasContext, chartData, margin, chartId, canvasOrigin } = nextContext;
		var draw = Axis.drawOnCanvasStatic.bind(null, margin, nextProps, canvasOrigin);

		nextContext.secretToSuperFastCanvasDraw.push({
			chartId: chartId,
			type: "axis",
			draw: draw,
		});
	}
	drawOnCanvas() {
		var { axesCanvasContext, chartData, margin, canvasOrigin } = this.context;
		var { scale } = this.props;

		Axis.drawOnCanvasStatic(margin, this.props, canvasOrigin, axesCanvasContext, chartData, scale, scale);
	}

	render() {
		if (this.context.type !== "svg") return null;

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
	className: React.PropTypes.string.isRequired,
	orient: React.PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
	innerTickSize: React.PropTypes.number,
	outerTickSize: React.PropTypes.number,
	tickFormat: React.PropTypes.func,
	tickPadding: React.PropTypes.number,
	tickSize: React.PropTypes.number,
	ticks: React.PropTypes.array,
	tickValues: React.PropTypes.array,
	scale: React.PropTypes.func.isRequired,
	showDomain: React.PropTypes.bool.isRequired,
	showTicks: React.PropTypes.bool.isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number.isRequired,
};

Axis.defaultProps = {
	defaultClassName: "react-stockcharts-axis ",
	showDomain: true,
	showTicks: true,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
};

Axis.contextTypes = {
	axesCanvasContext: React.PropTypes.object,
	type: React.PropTypes.string,
	chartData: React.PropTypes.object.isRequired,
	chartId: React.PropTypes.number.isRequired,
	margin: React.PropTypes.object.isRequired,
	canvasOrigin: React.PropTypes.array,
	secretToSuperFastCanvasDraw: React.PropTypes.array.isRequired,
};

Axis.drawOnCanvasStatic = (margin, props, canvasOrigin, ctx, chartData, xScale, yScale) => {
	var { transform, showDomain, showTicks } = props;
	// var originX = 0.5 + chartData.config.origin[0] + margin.left + transform[0];
	// var originY = 0.5 + chartData.config.origin[1] + margin.top + transform[1];

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOrigin[0] + transform[0], canvasOrigin[1] + transform[1]);

	if (showDomain) AxisLine.drawOnCanvasStatic(props, ctx, chartData, xScale, yScale);
	if (showTicks) AxisTicks.drawOnCanvasStatic(props, ctx, chartData, xScale, yScale);

	// ctx.setTransform(1, 0, 0, 1, 0, 0);
	// ctx.translate(0.5, 0.5);
}

export default Axis;
