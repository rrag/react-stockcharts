"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import pure from "../pure";
import CrossHair from "./CrossHair";

import { isDefined } from "../utils";

class MouseCoordinates extends Component {
	componentDidMount() {
		var { chartCanvasType, getCanvasContexts } = this.props;

		if (chartCanvasType !== "svg" && isDefined(getCanvasContexts)) {
			var contexts = getCanvasContexts();
			if (contexts) MouseCoordinates.drawOnCanvas(contexts.mouseCoord, this.props);
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props, this.props);
	}
	componentWillReceiveProps(nextProps) {
		var draw = MouseCoordinates.drawOnCanvasStatic.bind(null, nextProps);

		var temp = nextProps.getAllCanvasDrawCallback().filter(each => each.type === "mouse");
		if (temp.length === 0) {
			nextProps.callbackForCanvasDraw({
				type: "mouse",
				draw: draw,
			});
		} else {
			nextProps.callbackForCanvasDraw(temp[0], {
				type: "mouse",
				draw: draw,
			});
		}
	}
	render() {
		var { chartCanvasType, mouseXY, xScale, currentCharts, chartConfig, currentItem, show } = this.props;
		var { stroke, opacity, textStroke, textBGFill, textBGopacity, fontFamily, fontSize } = this.props;

		if (chartCanvasType !== "svg") return null;

		var pointer = MouseCoordinates.helper(this.props, show, xScale, mouseXY, currentCharts, chartConfig, currentItem);

		if (!pointer) return null;

		return <CrossHair height={pointer.height} width={pointer.width} mouseXY={pointer.mouseXY}
					xDisplayValue={pointer.xDisplayValue} edges={pointer.edges}
					stroke={stroke} opacity={opacity} textStroke={textStroke}
					textBGFill={textBGFill} textBGopacity={textBGopacity}
					fontFamily={fontFamily} fontSize={fontSize} />;
	}
}

MouseCoordinates.propTypes = {
	xDisplayFormat: PropTypes.func.isRequired,
	type: PropTypes.oneOf(["crosshair"]).isRequired,

	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
	chartCanvasType: PropTypes.string,
	getCanvasContexts: PropTypes.func,
	mouseXY: PropTypes.array,
	currentCharts: PropTypes.arrayOf(PropTypes.number),
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object.isRequired,
	show: PropTypes.bool,
	stroke: PropTypes.string,
	opacity: PropTypes.number,
	textStroke: PropTypes.string,
	textBGFill: PropTypes.string,
	textBGopacity: PropTypes.number,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
};

MouseCoordinates.defaultProps = {
	// show: false,
	snapX: true,
	showX: true,
	type: "crosshair",
	xDisplayFormat: d3.time.format("%Y-%m-%d"),
	stroke: "#000000",
	opacity: 0.2,
	textStroke: "#ffffff",
	textBGFill: "#8a8a8a",
	textBGopacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	rectWidth: 100,
	rectHeight: 20,
};

MouseCoordinates.drawOnCanvas = (canvasContext, props) => {
	var { mouseXY, currentCharts, chartConfig, currentItem, xScale, show } = props;

	// console.log(props.currentCharts);
	MouseCoordinates.drawOnCanvasStatic(props, canvasContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem);
};
MouseCoordinates.drawOnCanvasStatic = (props, ctx, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) => {
	var { margin } = props;
	var pointer = MouseCoordinates.helper(props, show, xScale, mouseXY, currentCharts, chartConfig, currentItem);

	if (!pointer) return null;

	var originX = 0.5 + margin.left;
	var originY = 0.5 + margin.top;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(originX, originY);

	// console.log(pointer);
	CrossHair.drawOnCanvasStatic(ctx, pointer);
	ctx.restore();
};

MouseCoordinates.helper = (props, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) => {
	var { displayXAccessor, xAccessor, height, width, snapX, xDisplayFormat } = props;

	var xValue = xAccessor(currentItem);
	var x = snapX ? Math.round(xScale(xValue)) : mouseXY[0];
	var y = mouseXY[1];

	var displayValue = snapX ? displayXAccessor(currentItem) : xScale.invert(x);

	if (!show || !displayValue) return;

	var edges = chartConfig
		.filter(eachChartConfig => currentCharts.indexOf(eachChartConfig.id) > -1)
		.filter(eachChartConfig => isDefined(eachChartConfig.mouseCoordinates.at))
		.filter(eachChartConfig => isDefined(eachChartConfig.mouseCoordinates.yDisplayFormat))
		.map(eachChartConfig => {
			var mouseY = mouseXY[1] - eachChartConfig.origin[1];
			var yValue = eachChartConfig.yScale.invert(mouseY);
			return {
				id: eachChartConfig.id,
				yDisplayValue: eachChartConfig.mouseCoordinates.yDisplayFormat(yValue),
				...eachChartConfig.mouseCoordinates,
				yValue,
			};
		});

	var { stroke, opacity, textStroke, textBGFill, textBGopacity, fontFamily, fontSize } = props;

	var { showX, rectHeight, rectWidth } = props;
	return { showX, rectHeight, rectWidth, height, width, mouseXY: [x, y], xDisplayValue: xDisplayFormat(displayValue), edges,
		stroke, opacity, textStroke, textBGFill, textBGopacity, fontFamily, fontSize };
};

// export default MouseCoordinates;
export default pure(MouseCoordinates, {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	margin: PropTypes.object.isRequired,
	show: PropTypes.bool,
	mouseXY: PropTypes.array,

	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
	chartCanvasType: PropTypes.string.isRequired,
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object.isRequired,
	currentCharts: PropTypes.arrayOf(PropTypes.number),

	getCanvasContexts: PropTypes.func,
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
});
