"use strict";

import React from "react";

import pure from "../pure";
import CrossHair from "./CrossHair";

import { displayDateFormat, displayNumberFormat } from "../utils/utils";

class MouseCoordinates extends React.Component {
	componentDidMount() {
		var { chartCanvasType, getCanvasContexts } = this.props;

		if (chartCanvasType !== "svg" && getCanvasContexts !== undefined) {
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
	xDisplayFormat: React.PropTypes.func.isRequired,
	type: React.PropTypes.oneOf(["crosshair"]).isRequired,

	xScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	displayXAccessor: React.PropTypes.func.isRequired,
	chartCanvasType: React.PropTypes.string,
	getCanvasContexts: React.PropTypes.func,
	mouseXY: React.PropTypes.array,
	currentCharts: React.PropTypes.arrayOf(React.PropTypes.number),
	chartConfig: React.PropTypes.array.isRequired,
	currentItem: React.PropTypes.object.isRequired,
	show: React.PropTypes.bool,
	stroke: React.PropTypes.string,
	opacity: React.PropTypes.number,
	textStroke: React.PropTypes.string,
	textBGFill: React.PropTypes.string,
	textBGopacity: React.PropTypes.number,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
};

MouseCoordinates.defaultProps = {
	// show: false,
	snapX: true,
	type: "crosshair",
	xDisplayFormat: displayDateFormat,
	stroke: "#000000",
	opacity: 0.2,
	textStroke: "#ffffff",
	textBGFill: "#8a8a8a",
	textBGopacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
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

	CrossHair.drawOnCanvasStatic(ctx, pointer);
	ctx.restore();
};

MouseCoordinates.helper = (props, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) => {
	if (!show) return;
	var { displayXAccessor, xAccessor, height, width, snapX, xDisplayFormat } = props;

	var edges = chartConfig
		.filter(eachChartConfig => currentCharts.indexOf(eachChartConfig.id) > -1)
		.filter(eachChartConfig => eachChartConfig.mouseCoordinates.at !== undefined)
		.filter(eachChartConfig => eachChartConfig.mouseCoordinates.format !== undefined)
		.map(eachChartConfig => {
			var mouseY = mouseXY[1] - eachChartConfig.origin[1];
			var yValue = eachChartConfig.yScale.invert(mouseY);
			return {
				id: eachChartConfig.id,
				at: eachChartConfig.mouseCoordinates.at,
				yValue,
				yDisplayFormat: eachChartConfig.mouseCoordinates.format,
				yDisplayValue: eachChartConfig.mouseCoordinates.format(yValue),
			};
		});


	var xValue = xAccessor(currentItem);
	var displayValue = displayXAccessor(currentItem);
	// console.log(show, edges, xValue);

	var x = snapX ? Math.round(xScale(xValue)) : mouseXY[0];
	var y = mouseXY[1];

	var { stroke, opacity, textStroke, textBGFill, textBGopacity, fontFamily, fontSize } = props;

	return { height, width, mouseXY: [x, y], xDisplayValue: xDisplayFormat(displayValue), edges,
		stroke, opacity, textStroke, textBGFill, textBGopacity, fontFamily, fontSize };
};

// export default MouseCoordinates;
export default pure(MouseCoordinates, {
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	margin: React.PropTypes.object.isRequired,
	show: React.PropTypes.bool,
	mouseXY: React.PropTypes.array,

	xScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	displayXAccessor: React.PropTypes.func.isRequired,
	chartCanvasType: React.PropTypes.string.isRequired,
	chartConfig: React.PropTypes.array.isRequired,
	currentItem: React.PropTypes.object.isRequired,
	currentCharts: React.PropTypes.arrayOf(React.PropTypes.number),

	getCanvasContexts: React.PropTypes.func,
	callbackForCanvasDraw: React.PropTypes.func.isRequired,
	getAllCanvasDrawCallback: React.PropTypes.func,
});
