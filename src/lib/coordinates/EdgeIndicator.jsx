"use strict";

import React from "react";
import d3 from "d3";

import Utils from "../utils/utils";
import EdgeCoordinate from "./EdgeCoordinate";
import ChartDataUtil from "../utils/ChartDataUtil";

class EdgeIndicator extends React.Component {
	constructor(props) {
		super(props);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	componentDidMount() {
		var { type } = this.props;
		var { getCanvasContexts } = this.context;

		if (type !== "svg" && getCanvasContexts !== undefined) {
			var contexts = getCanvasContexts();
			if (contexts) this.drawOnCanvas(contexts.axes);
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props, this.context);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		var { chartData, margin, width } = nextContext;
		var draw = EdgeIndicator.drawOnCanvasStatic.bind(null, margin, nextProps, width);

		nextContext.secretToSuperFastCanvasDraw.push({
			type: "axis",
			draw: draw,
		});
	}
	drawOnCanvas(ctx) {
		var { chartData, margin, width } = this.context;
		EdgeIndicator.drawOnCanvasStatic(margin, this.props, width, ctx, chartData);
	}
	render() {
		if (this.context.type !== "svg") return null;

		var { width, chartData } = this.context;
		var edge = EdgeIndicator.helper(this.props, width, chartData);

		if (edge === undefined) return null;
		return <EdgeCoordinate
			type={edge.type}
			className="react-stockcharts-edge-coordinate"
			fill={edge.fill}
			show={edge.show}
			x1={edge.x1}
			y1={edge.y1}
			x2={edge.x2}
			y2={edge.y2}
			coordinate={edge.coordinate}
			edgeAt={edge.edgeAt}
			orient={edge.orient} />;
	}
}

EdgeIndicator.contextTypes = {
	width: React.PropTypes.number.isRequired,
	chartData: React.PropTypes.array.isRequired,
	getCanvasContexts: React.PropTypes.func,
	type: React.PropTypes.string,
	margin: React.PropTypes.object.isRequired,
	secretToSuperFastCanvasDraw: React.PropTypes.array.isRequired,
};

EdgeIndicator.propTypes = {
	type: React.PropTypes.oneOf(["horizontal"]).isRequired,
	className: React.PropTypes.string,
	itemType: React.PropTypes.oneOf(["first", "last", "current"]).isRequired,
	orient: React.PropTypes.oneOf(["left", "right"]),
	edgeAt: React.PropTypes.oneOf(["left", "right"]),
	forChart: React.PropTypes.number.isRequired,
	forDataSeries: React.PropTypes.number.isRequired,
	displayFormat: React.PropTypes.func.isRequired,
};

EdgeIndicator.defaultProps = {
	type: "horizontal",
	orient: "left",
	edgeAt: "left",
	displayFormat: Utils.displayNumberFormat,
	yAxisPad: 5,
	namespace: "ReStock.EdgeIndicator"
};

EdgeIndicator.drawOnCanvasStatic = (margin, props, width, ctx, chartDataArray) => {
	var edge = EdgeIndicator.helper(props, width, chartDataArray);

	if (edge === undefined) return null;

	var originX = margin.left;
	var originY = margin.top;
	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(originX, originY);

	EdgeCoordinate.drawOnCanvasStatic(ctx, edge);
	ctx.restore();
};

EdgeIndicator.helper = (props, width, chartData) => {
	var { type: edgeType, displayFormat, forChart, forDataSeries, itemType, edgeAt, yAxisPad, orient } = props;

	var currentChartData = ChartDataUtil.getChartDataForChartNew(chartData, forChart);
	// var currentItem = ChartDataUtil.getCurrentItemForChartNew(currentItems, forChart);
	var edge = null, item, yAccessor;
	// console.log(chartData.config.compareSeries.length);
	var displayFormat = currentChartData.config.compareSeries.length > 0 ? d3.format(".0%") : displayFormat;

	if (forDataSeries !== undefined
			&& currentChartData.config.overlays.length > 0
			&& currentChartData.plot.overlayValues.length > 0) {

		var overlay = currentChartData.config.overlays
			.filter((eachOverlay) => eachOverlay.id === forDataSeries);
		var overlayValue = currentChartData.plot.overlayValues
			.filter((eachOverlayValue) => eachOverlayValue.id === forDataSeries);

		item = itemType === "first"
			? overlayValue[0].first
			: overlayValue[0].last;

		yAccessor = overlay[0].yAccessor;

		if (item !== undefined) {
			let yValue = yAccessor(item), xValue = currentChartData.config.xAccessor(item);
			let x1 = Math.round(currentChartData.plot.scales.xScale(xValue)), y1 = Math.round(currentChartData.plot.scales.yScale(yValue));

			let stroke = overlay[0].stroke;
			let edgeX = edgeAt === "left"
				? 0 - yAxisPad
				: width + yAxisPad;

			edge = {
				type: edgeType,
				fill: stroke,
				show: true,
				x1: x1 + currentChartData.config.origin[0],
				y1: y1 + currentChartData.config.origin[1],
				x2: edgeX + currentChartData.config.origin[0],
				y2: y1 + currentChartData.config.origin[1],
				coordinate: displayFormat(yValue),
				edgeAt: edgeX,
				orient: orient,
				chartOrigin: currentChartData.config.origin,
			};
		}
	}
	return edge;
};

module.exports = EdgeIndicator;
