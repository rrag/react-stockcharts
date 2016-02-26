"use strict";

import React, { Component, PropTypes } from "react";
import d3 from "d3";

import EdgeCoordinate from "./EdgeCoordinate";

import pure from "../pure";
import { first, last, isDefined, isNotDefined } from "../utils";

class EdgeIndicator extends Component {
	componentDidMount() {
		var { chartCanvasType, getCanvasContexts } = this.props;

		if (chartCanvasType !== "svg" && isDefined(getCanvasContexts)) {
			var contexts = getCanvasContexts();
			if (contexts)
				EdgeIndicator.drawOnCanvas(this.props, contexts.axes);
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props);
	}
	componentWillReceiveProps(nextProps) {
		var draw = EdgeIndicator.drawOnCanvasStatic.bind(null, nextProps);

		var { chartId } = nextProps;

		nextProps.callbackForCanvasDraw({
			type: "edge",
			chartId, draw,
		});
	}
	render() {
		var { xScale, chartConfig, plotData, chartCanvasType } = this.props;

		if (chartCanvasType !== "svg") return null;

		var edge = EdgeIndicator.helper(this.props, xScale, chartConfig.yScale, plotData);


		if (isNotDefined(edge)) return null;
		return <EdgeCoordinate
			className="react-stockcharts-edge-coordinate"
				{...edge} />;
	}
}

EdgeIndicator.propTypes = {
	yAccessor: PropTypes.func,

	type: PropTypes.oneOf(["horizontal"]).isRequired,
	className: PropTypes.string,
	fill: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]).isRequired,
	textFill: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]).isRequired,
	itemType: PropTypes.oneOf(["first", "last"]).isRequired,
	orient: PropTypes.oneOf(["left", "right"]),
	edgeAt: PropTypes.oneOf(["left", "right"]),
	displayFormat: PropTypes.func.isRequired,
};

EdgeIndicator.defaultProps = {
	type: "horizontal",
	orient: "left",
	edgeAt: "left",
	textFill: "#FFFFFF",
	displayFormat: d3.format(".2f"),
	yAxisPad: 5,
};

EdgeIndicator.drawOnCanvas = (props, canvasContext) => {
	var { chartConfig, xScale, plotData } = props;
	EdgeIndicator.drawOnCanvasStatic(props, canvasContext, xScale, chartConfig.yScale, plotData);
};

EdgeIndicator.drawOnCanvasStatic = (props, ctx, xScale, yScale, plotData) => {
	var { canvasOriginX, canvasOriginY } = props;
	var edge = EdgeIndicator.helper(props, xScale, yScale, plotData);

	if (isNotDefined(edge)) return null;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOriginX, canvasOriginY);

	EdgeCoordinate.drawOnCanvasStatic(ctx, edge);
	ctx.restore();
};

EdgeIndicator.helper = (props, xScale, yScale, plotData) => {
	var { type: edgeType, displayFormat, itemType, edgeAt, yAxisPad, orient } = props;
	var { yAccessor, xAccessor, fill, textFill } = props;

	// var currentItem = ChartDataUtil.getCurrentItemForChartNew(currentItems, forChart);
	var edge = null, item, yAccessor;
	// console.log(chartData.config.compareSeries.length);

	var item = itemType === "first" ? first(plotData, yAccessor) : last(plotData, yAccessor);

	if (isDefined(item)) {
		var yValue = yAccessor(item),
			xValue = xAccessor(item);

		var x1 = Math.round(xScale(xValue)),
			y1 = Math.round(yScale(yValue));

		var [left, right] = xScale.range();
		var edgeX = edgeAt === "left"
				? left - yAxisPad
				: right + yAxisPad;

		edge = {
			// ...props,
			type: edgeType,
			fill: d3.functor(fill)(item),
			textFill: d3.functor(textFill)(item),
			show: true,
			x1,
			y1,
			x2: edgeX,
			y2: y1,
			coordinate: displayFormat(yValue),
			edgeAt: edgeX,
			orient,
		};
	}
	return edge;
};

EdgeIndicator.propTypes = {
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,
	chartConfig: PropTypes.object.isRequired,
	xAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func.isRequired,
	chartId: PropTypes.number.isRequired,
	getCanvasContexts: PropTypes.func,
	margin: PropTypes.object.isRequired,
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
	chartCanvasType: PropTypes.string.isRequired,
	plotData: PropTypes.array.isRequired,
};


export default pure(EdgeIndicator, {
	// width: PropTypes.number.isRequired,
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,
	chartConfig: PropTypes.object.isRequired,
	xAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func.isRequired,
	chartId: PropTypes.number.isRequired,
	getCanvasContexts: PropTypes.func,
	margin: PropTypes.object.isRequired,
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
	chartCanvasType: PropTypes.string.isRequired,
	plotData: PropTypes.array.isRequired,
});
