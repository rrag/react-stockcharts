"use strict";

import React from "react";
import Utils from "../utils/utils";
import PureComponent from "../utils/PureComponent";
import CrossHair from "./CrossHair";

class MouseCoordinates extends PureComponent {
	constructor(props, context) {
		super(props, context);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx) {
		var { mouseXY, currentCharts, chartData, currentItems, show } = this.context;

		MouseCoordinates.drawOnCanvasStatic(this.context, this.props, ctx, show, mouseXY, currentCharts, chartData, currentItems)
	}
	componentDidMount() {
		var { type, getCanvasContexts } = this.context;

		if (type !== "svg" && getCanvasContexts !== undefined) {
			var contexts = getCanvasContexts();
			if (contexts) this.drawOnCanvas(contexts.mouseCoord);
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props, this.context);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		var draw = MouseCoordinates.drawOnCanvasStatic.bind(null, nextContext, nextProps);

		var temp = nextContext.secretToSuperFastCanvasDraw.filter(each => each.type === "mouse");
		if (temp.length === 0) {
			nextContext.secretToSuperFastCanvasDraw.push({
				type: "mouse",
				draw: draw,
			});
		} else {
			temp[0].draw = draw;
		}
	}
	render() {
		var { type, mouseXY, currentCharts, chartData, currentItems, show } = this.context;
		if (type !== "svg") return null;

		var pointer = MouseCoordinates.helper(this.context, this.props, show, mouseXY, currentCharts, chartData, currentItems);

		if (!pointer) return null

		return <CrossHair height={pointer.height} width={pointer.width} mouseXY={pointer.mouseXY}
					xDisplayValue={pointer.xDisplayValue} edges={pointer.edges}/>;
	}
}

MouseCoordinates.contextTypes = {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	mainChart: React.PropTypes.number.isRequired,
	show: React.PropTypes.bool,
	mouseXY: React.PropTypes.array,
	dateAccessor: React.PropTypes.func,
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
	currentCharts: React.PropTypes.array.isRequired,
	getCanvasContexts: React.PropTypes.func,
	margin: React.PropTypes.object.isRequired,
	secretToSuperFastCanvasDraw: React.PropTypes.array.isRequired,
	type: React.PropTypes.string.isRequired,
};

MouseCoordinates.propTypes = {
	xDisplayFormat: React.PropTypes.func.isRequired,
	yDisplayFormat: React.PropTypes.func.isRequired,
	type: React.PropTypes.oneOf(["crosshair"]).isRequired
};

MouseCoordinates.defaultProps = {
	namespace: "ReStock.MouseCoordinates",
	show: false,
	snapX: true,
	type: "crosshair",
	xDisplayFormat: Utils.displayDateFormat,
	yDisplayFormat: Utils.displayNumberFormat,
};

MouseCoordinates.drawOnCanvasStatic = (context, props, ctx, show, mouseXY, currentCharts, chartData, currentItems) => {
	var { margin } = context;
	var pointer = MouseCoordinates.helper(context, props, show, mouseXY, currentCharts, chartData, currentItems);

	if (!pointer) return null

	var originX = 0.5 + margin.left;
	var originY = 0.5 + margin.top;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(originX, originY);

	CrossHair.drawOnCanvasStatic(ctx, pointer);
	ctx.restore();
}

MouseCoordinates.helper = (context, props, show, mouseXY, currentCharts, chartData, currentItems) => {
	if (!show) return;
	var { mainChart, dateAccessor, height, width } = context;
	var { snapX, type, xDisplayFormat } = props;
	var edges = chartData
		.filter((eachChartData) => currentCharts.indexOf(eachChartData.id) > -1)
		.map((each) => {
			var yDisplayFormat = each.config.compareSeries.length > 0
				? (d) => (Math.round(d * 10000) / 100).toFixed(2) + "%"
				: each.config.mouseCoordinates.format;
			var mouseY = mouseXY[1] - each.config.origin[1];
			var yValue = each.plot.scales.yScale.invert(mouseY);
			return {
				id: each.id,
				at: each.config.mouseCoordinates.at,
				yValue: yValue,
				yDisplayFormat: yDisplayFormat
			};
		})
		.filter((each) => each.at !== undefined)
		.filter((each) => each.yDisplayFormat !== undefined)
		.map(each => {
			each.yDisplayValue = each.yDisplayFormat(each.yValue);
			return each;
		});

	// console.log(edges);
	var singleChartData = chartData.filter((eachChartData) => eachChartData.id === mainChart)[0];

	// var yDisplayFormat = singleChartData.config.compareSeries.length > 0 ? (d) => (Math.round(d * 10000) / 100).toFixed(2) + "%" : this.props.yDisplayFormat;

	var item = currentItems.filter((eachItem) => eachItem.id === mainChart)[0];// ChartDataUtil.getCurrentItemForChart(this.props, this.context);
	if (item === undefined) return null;
	item = item.data;
	// console.log(singleChartData, item);
	var xValue = singleChartData.config.xAccessor(item);

	var xDisplayValue = dateAccessor === undefined
		? xValue
		: dateAccessor(item);

	// var yValue = singleChartData.plot.scales.yScale.invert(mouseXY[1]);
	if (xValue === undefined) return null;
	var x = snapX ? Math.round(singleChartData.plot.scales.xScale(xValue)) : mouseXY[0];
	var y = mouseXY[1];

	return { height, width, mouseXY: [x, y], xDisplayValue: xDisplayFormat(xDisplayValue), edges };
};

module.exports = MouseCoordinates;
