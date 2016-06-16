"use strict";

import React, { PropTypes, Component } from "react";

import { first, last, isDefined, isNotDefined, hexToRGBA } from "../utils";
import pure from "../pure";

class HoverTooltip extends Component {
	componentDidMount() {
		var { getCanvasContexts, chartCanvasType } = this.props;

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

		var temp = nextProps.getAllCanvasDrawCallback().filter(each => each.type === "mouse").filter(each => each.subType === "HoverTooltip");
		if (temp.length === 0) {
			nextProps.callbackForCanvasDraw({
				type: "mouse",
				subType: "HoverTooltip",
				draw: draw,
			});
		} else {
			nextProps.callbackForCanvasDraw(temp[0], {
				type: "mouse",
				subType: "HoverTooltip",
				draw: draw,
			});
		}
	}
	render() {
		var { backgroundShapeSVG } = this.props;
		var { chartConfig, currentItem, height, mouseXY } = this.props;
		var { chartCanvasType, show, xScale, bgFill, bgOpacity } = this.props;

		if (chartCanvasType !== "svg") return null;
		var pointer = helper(this.props, show, xScale, mouseXY, chartConfig, currentItem);

		if (isNotDefined(pointer)) return null;
		var { x, y, content, centerX, drawWidth } = pointer;

		return (
			<g>
				<rect x={centerX - drawWidth / 2} y={0} width={drawWidth} height={height} fill={bgFill} opacity={bgOpacity} />
				<g className="react-stockcharts-tooltip-content" transform={`translate(${x}, ${y})`}>
					{backgroundShapeSVG(this.props)}
					{tooltipSVG(this.props, content)}
				</g>
			</g>
		);
	}
}

HoverTooltip.propTypes = {
	// forChart: PropTypes.number.isRequired,
	getCanvasContexts: PropTypes.func,
	chartCanvasType: PropTypes.string,
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	mouseXY: PropTypes.array,
	show: PropTypes.bool,
	xScale: PropTypes.func.isRequired,


	backgroundShapeSVG: PropTypes.func,
	bgwidth: PropTypes.number.isRequired,
	bgheight: PropTypes.number.isRequired,
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	tooltipContent: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.func
	]).isRequired,
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
};


HoverTooltip.defaultProps = {
	bgwidth: 150,
	bgheight: 50,
	tooltipSVG: tooltipSVG,
	tooltipCanvas: tooltipCanvas,
	origin: origin,
	fill: "#D4E2FD",
	bgFill: "#D4E2FD",
	bgOpacity: 0.5,
	stroke: "#9B9BFF",
	fontFill: "#000000",
	opacity: 0.8,
	backgroundShapeSVG: backgroundShapeSVG,
	backgroundShapeCanvas: backgroundShapeCanvas,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
};

const PADDING = 5;


/* eslint-disable react/prop-types */
function backgroundShapeSVG({ bgheight, bgwidth, fill, stroke, opacity }) {
	return <rect height={bgheight} width={bgwidth} fill={fill} opacity={opacity} stroke={stroke} />;
}

function tooltipSVG({ fontFamily, fontSize, fontFill }, content) {
	var tspans = [];
	for (var i = 0; i < content.y.length; i++) {
		let y = content.y[i];
		tspans.push(<tspan key={`L-${i}`} x={10} dy={fontSize} fill={y.stroke}>{y.label}</tspan>);
		tspans.push(<tspan key={`${i}`}>: </tspan>);
		tspans.push(<tspan key={`V-${i}`}>{y.value}</tspan>);
	}
	return <text fontFamily={fontFamily} fontSize={fontSize} fill={fontFill}>
		<tspan x={10} y={15}>{content.x}</tspan>
		{tspans}
	</text>;
}
/* eslint-enable react/prop-types */

function backgroundShapeCanvas({ bgheight, bgwidth, fill, stroke, opacity }, ctx) {
	ctx.fillStyle = hexToRGBA(fill, opacity);
	ctx.strokeStyle = stroke;
	ctx.beginPath();
	ctx.rect(0, 0, bgwidth, bgheight);
	ctx.fill();
	ctx.stroke();
}

function tooltipCanvas({ fontFamily, fontSize, fontFill }, content, ctx) {
	ctx.font = `${fontSize}px ${fontFamily}`;
	ctx.fillStyle = fontFill;
	ctx.textAlign = "left";

	const X = 10;
	const Y = 15;
	ctx.fillText(content.x, X, Y);

	for (var i = 0; i < content.y.length; i++) {
		let y = content.y[i];
		let textY = Y + (fontSize * (i + 1));
		ctx.fillStyle = y.stroke || fontFill;
		ctx.fillText(y.label, X, textY);

		ctx.fillStyle = fontFill;
		ctx.fillText(": " + y.value, X + ctx.measureText(y.label).width, textY);
	}
}

function origin({ mouseXY, bgheight, bgwidth, xAccessor, currentItem, xScale }) {
	var y = last(mouseXY);

	var snapX = xScale(xAccessor(currentItem));
	var originX = (snapX - bgwidth - PADDING * 2 < 0) ? snapX + PADDING : snapX - bgwidth - PADDING;
	// originX = (x - width - PADDING * 2 < 0) ? x + PADDING : x - width - PADDING;

	var originY = y - bgheight / 2;
	return [originX, originY];
}

function drawOnCanvas(canvasContext, props) {
	var { mouseXY, chartConfig, currentItem, xScale, show } = props;

	// console.log(props.
	drawOnCanvasStatic(props, canvasContext, show, xScale, mouseXY, null, chartConfig, currentItem);
}

function drawOnCanvasStatic(props, ctx, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) {

	var { height, margin } = props;
	var { bgFill, bgOpacity } = props;
	var { backgroundShapeCanvas, tooltipCanvas } = props;

	var pointer = helper(props, show, xScale, mouseXY, chartConfig, currentItem);

	if (!pointer) return;

	var originX = 0.5 + margin.left;
	var originY = 0.5 + margin.top;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(originX, originY);

	var { x, y, content, centerX, drawWidth } = pointer;

	ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);
	ctx.beginPath();
	ctx.rect(centerX - drawWidth / 2, 0, drawWidth, height);
	ctx.fill();

	ctx.translate(x, y);
	backgroundShapeCanvas(props, ctx);
	tooltipCanvas(props, content, ctx);

	ctx.restore();
}

function helper(props, show, xScale, mouseXY, chartConfig, currentItem) {
	var { origin } = props;
	var { tooltipContent } = props;
	var { xAccessor, displayXAccessor, plotData } = props;

	if (!show || isNotDefined(currentItem)) return;

	var xValue = xAccessor(currentItem);

	if (!show || isNotDefined(xValue)) return;

	var [x, y] = origin({ ...props, show, xScale, mouseXY, chartConfig, currentItem });

	var content = tooltipContent({ currentItem, xAccessor: displayXAccessor });
	var centerX = xScale(xValue);
	var drawWidth = Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData)))) / (plotData.length - 1);

	return { x, y, content, centerX, drawWidth };
}

export default pure(HoverTooltip, {
	margin: PropTypes.object.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,

	getCanvasContexts: PropTypes.func,
	getAllCanvasDrawCallback: PropTypes.func,
	chartCanvasType: PropTypes.string,
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object,
	mouseXY: PropTypes.array,
	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
	show: PropTypes.bool,
	plotData: PropTypes.array,
	callbackForCanvasDraw: PropTypes.func.isRequired,
});
