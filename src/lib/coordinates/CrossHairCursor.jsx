"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";

import { hexToRGBA, isDefined, isNotDefined } from "../utils";

class CrossHairCursor extends Component {
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
		this.componentWillReceiveProps(this.props, this.props);
	}
	componentWillReceiveProps(nextProps) {
		var draw = drawOnCanvasStatic.bind(null, nextProps);

		var temp = nextProps.getAllCanvasDrawCallback()
			.filter(each => isNotDefined(each.chartId))
			.filter(each => each.type === "mouse")
			.filter(each => each.subType === "crosshair");
		if (temp.length === 0) {
			nextProps.callbackForCanvasDraw({
				type: "mouse",
				subType: "crosshair",
				draw: draw,
			});
		} else {
			nextProps.callbackForCanvasDraw(temp[0], {
				type: "mouse",
				subType: "crosshair",
				draw: draw,
			});
		}
	}
	render() {
		var { chartCanvasType, mouseXY, xScale, currentItem, show } = this.props;
		if (chartCanvasType !== "svg") return null;

		var lines = helper(this.props, mouseXY, xScale, currentItem, show);

		if (isNotDefined(lines)) return null;

		return (
			<g className="CrossHairCursor ">
				{lines.map((each, idx) =>
					<line key={idx} {...each} />)}
			</g>
		);
	}
}

CrossHairCursor.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	mouseXY: PropTypes.array.isRequired,
	show: PropTypes.bool,
	xScale: PropTypes.func.isRequired,
	chartCanvasType: PropTypes.string.isRequired,
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object,
	currentCharts: PropTypes.arrayOf(PropTypes.number),
	getCanvasContexts: PropTypes.func,
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,

};

CrossHairCursor.defaultProps = {
	stroke: "#000000",
	opacity: 0.3,
	strokeDasharray: "4, 2",
	snapX: true,
};

function helper(props, mouseXY, xScale, currentItem, show) {
	var { height, width, xAccessor, snapX } = props;
	var { stroke, opacity, strokeDasharray } = props;

	if (!show || isNotDefined(currentItem)) return null;

	var line1 = {
		x1: 0,
		x2: width,
		y1: mouseXY[1],
		y2: mouseXY[1],
		stroke, strokeDasharray, opacity,
	};
	var x = snapX ? xScale(xAccessor(currentItem)) : mouseXY[0];
	var line2 = {
		x1: x,
		x2: x,
		y1: 0,
		y2: height,
		stroke, strokeDasharray, opacity,
	};
	return [line1, line2];
}
function drawOnCanvas(canvasContext, props) {
	var { mouseXY, currentCharts, chartConfig, currentItem, xScale, show } = props;

	// console.log(props.currentCharts);
	drawOnCanvasStatic(props, canvasContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem);
}

function drawOnCanvasStatic(props, ctx, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) {
	var { margin } = props;

	var lines = helper(props, mouseXY, xScale, currentItem, show);

	if (isDefined(lines)) {
		var originX = margin.left;
		var originY = 0.5 + margin.top;

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(originX, originY);

		lines.forEach(line => {

			ctx.strokeStyle = hexToRGBA(line.stroke, line.opacity);
			var dashArray = line.strokeDasharray.split(",").map(d => +d);
			ctx.setLineDash(dashArray);
			ctx.beginPath();
			ctx.moveTo(line.x1, line.y1);
			ctx.lineTo(line.x2, line.y2);
			ctx.stroke();
		});

		ctx.restore();
	}
}

export default pure(CrossHairCursor, {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	margin: PropTypes.object.isRequired,
	show: PropTypes.bool,
	mouseXY: PropTypes.array,

	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	chartCanvasType: PropTypes.string.isRequired,
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object,
	currentCharts: PropTypes.arrayOf(PropTypes.number),

	getCanvasContexts: PropTypes.func,
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
});
