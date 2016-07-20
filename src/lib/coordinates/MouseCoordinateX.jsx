"use strict";

import React, { PropTypes, Component } from "react";

import EdgeCoordinate from "./EdgeCoordinate";
import pure from "../pure";

import { isDefined, isNotDefined, shallowEqual } from "../utils";

class MouseCoordinateX extends Component {
	componentDidMount() {
		var { chartCanvasType, getCanvasContexts } = this.props;

		if (chartCanvasType !== "svg" && isDefined(getCanvasContexts)) {
			var contexts = getCanvasContexts();
			if (contexts) drawOnCanvas(contexts.mouseCoord, this.props);
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props);
	}
	componentWillReceiveProps(nextProps) {
		var draw = drawOnCanvasStatic.bind(null, nextProps);
		var { id, chartId } = nextProps;

		if (!shallowEqual(this.props, nextProps)) {
			var temp = nextProps.getAllCanvasDrawCallback()
				.filter(each => each.type === "mouse")
				.filter(each => each.subType === "MouseCoordinateX")
				.filter(each => each.chartId === chartId)
				.filter(each => each.id === id);

			if (temp.length === 0) {
				nextProps.callbackForCanvasDraw({
					type: "mouse",
					subType: "MouseCoordinateX",
					id, chartId, draw,
				});
			} else {
				nextProps.callbackForCanvasDraw(temp[0], {
					type: "mouse",
					subType: "MouseCoordinateX",
					id, chartId, draw,
				});
			}
		}
	}
	render() {
		var { chartCanvasType, chartConfig, currentItem, xScale, mouseXY } = this.props;
		if (chartCanvasType !== "svg") return null;

		var props = helper(this.props, xScale, chartConfig, mouseXY, currentItem);
		if (isNotDefined(props)) return null;

		return (
			<EdgeCoordinate
				className="horizontal"
				{...props}
				/>
		);
	}
}

MouseCoordinateX.propTypes = {
	id: PropTypes.number.isRequired,
	displayFormat: PropTypes.func.isRequired,

	chartCanvasType: PropTypes.string.isRequired,
	getCanvasContexts: PropTypes.func,
	chartConfig: PropTypes.object.isRequired,
	mouseXY: PropTypes.array,
	xScale: PropTypes.func.isRequired,
	currentCharts: PropTypes.arrayOf(PropTypes.number),
	currentItem: PropTypes.object,
};

MouseCoordinateX.defaultProps = {
	yAxisPad: 0,
	rectWidth: 80,
	rectHeight: 20,
	orient: "bottom",
	at: "bottom",

	fill: "#525252",
	opacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",
	snapX: true,
};

function helper(props, xScale, { yScale }, mouseXY, currentItem) {
	if (isNotDefined(currentItem)) return null;

	var { xAccessor, height, show, snapX } = props;

	var { orient, at, rectWidth, rectHeight, displayFormat, displayXAccessor } = props;
	var { fill, opacity, fontFamily, fontSize, textFill } = props;

	var x = snapX ? xScale(xAccessor(currentItem)) : mouseXY[0];
	var edgeAt = (at === "bottom")
		? height
		: 0;

	var coordinate = snapX ? displayFormat(displayXAccessor(currentItem)) : displayFormat(xScale.invert(x));
	var type = "vertical";
	var y1 = 0, y2 = height;
	var hideLine = true;

	var coordinateProps = {
		coordinate,
		show,
		type,
		orient,
		edgeAt,
		hideLine,
		fill, opacity, fontFamily, fontSize, textFill,
		rectWidth,
		rectHeight,
		x1: x,
		x2: x,
		y1,
		y2
	};
	return coordinateProps;
}

function drawOnCanvas(canvasContext, props) {
	var { chartConfig, currentItem, xScale, mouseXY, currentCharts, show } = props;

	drawOnCanvasStatic(props, canvasContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem);
}

// mouseContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem
function drawOnCanvasStatic(props, ctx, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) {
	var { canvasOriginX, canvasOriginY } = props;

	var edgeProps = helper(props, xScale, chartConfig, mouseXY, currentItem);

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOriginX, canvasOriginY);

	EdgeCoordinate.drawOnCanvasStatic(ctx, edgeProps);

	ctx.restore();
}

export default pure(MouseCoordinateX, {
	show: PropTypes.bool.isRequired,
	currentItem: PropTypes.object,
	chartConfig: PropTypes.object.isRequired,
	mouseXY: PropTypes.array, // this is to avoid the flicker
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,

	height: PropTypes.number.isRequired,
	displayXAccessor: PropTypes.func.isRequired,

	xAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func.isRequired,
	chartId: PropTypes.number.isRequired,
	getCanvasContexts: PropTypes.func,
	margin: PropTypes.object.isRequired,
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
	chartCanvasType: PropTypes.string.isRequired,
});
