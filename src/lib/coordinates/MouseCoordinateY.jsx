"use strict";

import React, { PropTypes, Component } from "react";

import EdgeCoordinate from "./EdgeCoordinate";
import pure from "../pure";

import { isDefined, isNotDefined, shallowEqual } from "../utils";

class MouseCoordinateY extends Component {
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
				.filter(each => each.subType === "MouseCoordinateY")
				.filter(each => each.chartId === chartId)
				.filter(each => each.id === id);

			if (temp.length === 0) {
				nextProps.callbackForCanvasDraw({
					type: "mouse",
					subType: "MouseCoordinateY",
					id, chartId, draw,
				});
			} else {
				nextProps.callbackForCanvasDraw(temp[0], {
					type: "mouse",
					subType: "MouseCoordinateY",
					id, chartId, draw,
				});
			}
		}
	}
	render() {
		var { chartCanvasType, chartConfig, mouseXY, xScale, currentCharts, currentItem } = this.props;
		if (chartCanvasType !== "svg") return null;

		var props = helper(this.props, xScale, chartConfig, mouseXY, currentCharts, currentItem);
		if (isNotDefined(props)) return null;

		return (
			<EdgeCoordinate
				className="vertical"
				{...props}
				/>
		);
	}
}

MouseCoordinateY.propTypes = {
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

MouseCoordinateY.defaultProps = {
	yAxisPad: 0,
	rectWidth: 50,
	rectHeight: 20,
	orient: "left",
	at: "left",
	arrowWidth: 10,
	fill: "#525252",
	opacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",
};

function helper(props, xScale, { id, yScale, origin }, mouseXY, currentCharts/* , currentItem */) {
	if (isNotDefined(mouseXY)) return null;
	if (currentCharts.indexOf(id) < 0) return null;

	var { width, show } = props;

	var { orient, at, rectWidth, rectHeight, displayFormat } = props;
	var { fill, opacity, fontFamily, fontSize, textFill } = props;

	var x1 = 0, x2 = width;
	var edgeAt = (at === "right")
		? width
		: 0;

	var type = "horizontal";
	var y = mouseXY[1] - origin[1];
	var coordinate = displayFormat(yScale.invert(y));
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
		x1,
		x2,
		y1: y,
		y2: y,
	};
	return coordinateProps;
}

function drawOnCanvas(canvasContext, props) {
	var { chartConfig, currentItem, xScale, mouseXY, show, currentCharts } = props;

	drawOnCanvasStatic(props, canvasContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem);
}

// mouseContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem
function drawOnCanvasStatic(props, ctx, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) {
	var { canvasOriginX, canvasOriginY } = props;

	var edgeProps = helper(props, xScale, chartConfig, mouseXY, currentCharts, currentItem);

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOriginX, canvasOriginY);

	EdgeCoordinate.drawOnCanvasStatic(ctx, edgeProps);

	ctx.restore();
}

export default pure(MouseCoordinateY, {
	show: PropTypes.bool.isRequired,
	currentItem: PropTypes.object,
	chartConfig: PropTypes.object.isRequired,
	mouseXY: PropTypes.array,
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,

	width: PropTypes.number.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
	currentCharts: PropTypes.arrayOf(PropTypes.number),

	xAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func.isRequired,
	chartId: PropTypes.number.isRequired,
	getCanvasContexts: PropTypes.func,
	margin: PropTypes.object.isRequired,
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
	chartCanvasType: PropTypes.string.isRequired,
});
