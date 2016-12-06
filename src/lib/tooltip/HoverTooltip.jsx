"use strict";

import React, { PropTypes, Component } from "react";
import GenericComponent from "../GenericComponent";

import { first, last, isNotDefined, hexToRGBA } from "../utils";

class HoverTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var pointer = helper(this.props, moreProps);
		var { height } = moreProps;

		if (isNotDefined(pointer)) return null;
		drawOnCanvas(ctx, this.props, this.context, pointer, height, moreProps);
	}
	render() {
		return <GenericComponent
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnMouseMove
			drawOnPan
			drawOnMouseExitOfCanvas
			/>;
	}
	renderSVG(moreProps) {
		var pointer = helper(this.props, moreProps);

		if (isNotDefined(pointer)) return null;

		var { chartId, yAccessor, bgFill, bgOpacity, bgwidth, bgheight, backgroundShapeSVG } = this.props;
		var { height, xAccessor, xScale, chartConfig, currentItem } = moreProps;

		var { x, y, content, centerX, drawWidth } = pointer;

		if (chartId && yAccessor) {
			var xValue = xAccessor(currentItem);
			var yValue = yAccessor(currentItem);
			var chartIndex = chartConfig.findIndex(x => x.id === chartId);

			x = Math.round(xScale(xValue));
			y = Math.round(chartConfig[chartIndex].yScale(yValue));

			x = (x - bgwidth  - PADDING * 2 < 0) ? x + PADDING : x - bgwidth - PADDING;
			y = (y - bgheight < 0) ? y + PADDING : y - bgheight - PADDING;
		}

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
	chartId: PropTypes.number,
	yAccessor: PropTypes.func,
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

HoverTooltip.contextTypes = {
	margin: PropTypes.object.isRequired,
	ratio: PropTypes.number.isRequired,
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
const X = 10;
const Y = 10;


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

function calculateTooltipSize({ fontFamily, fontSize, fontFill }, content) {
	const canvas = document.createElement("canvas");
	let ctx = canvas.getContext("2d");
	let width = 0;
	let height = content.y.length * fontSize + fontSize;

	ctx.font = `${fontSize}px ${fontFamily}`;
	ctx.fillStyle = fontFill;
	ctx.textAlign = "left";
	for (let i = 0; i < content.y.length; i++) {
		let y = content.y[i];
		const textWidth = ctx.measureText(`${y.label}: ${y.value}`).width;
		if (textWidth > width) width = textWidth;
	}
	return {
		width: width + 2 * X,
		height: height + 2 * Y
	};
}

function backgroundShapeCanvas(props, content, ctx) {
	const { fill, stroke, opacity } = props;
	const { width, height } = calculateTooltipSize(props, content);
	ctx.fillStyle = hexToRGBA(fill, opacity);
	ctx.strokeStyle = stroke;
	ctx.beginPath();
	ctx.rect(0, 0, width, height);
	ctx.fill();
	ctx.stroke();
}

function tooltipCanvas({ fontFamily, fontSize, fontFill }, content, ctx) {
	const startY = Y + fontSize * 0.9;
	ctx.font = `${fontSize}px ${fontFamily}`;
	ctx.fillStyle = fontFill;
	ctx.textAlign = "left";
	ctx.fillText(content.x, X, startY);

	for (var i = 0; i < content.y.length; i++) {
		let y = content.y[i];
		let textY = startY + (fontSize * (i + 1));
		ctx.fillStyle = y.stroke || fontFill;
		ctx.fillText(y.label, X, textY);

		ctx.fillStyle = fontFill;
		ctx.fillText(": " + y.value, X + ctx.measureText(y.label).width, textY);
	}
}

function origin(mouseXY, bgheight, bgwidth, xAccessor, currentItem, xScale) {
	var y = last(mouseXY);

	var snapX = xScale(xAccessor(currentItem));
	var originX = (snapX - bgwidth - PADDING * 2 < 0) ? snapX + PADDING : snapX - bgwidth - PADDING;
	// originX = (x - width - PADDING * 2 < 0) ? x + PADDING : x - width - PADDING;

	var originY = y - bgheight / 2;
	return [originX, originY];
}

function drawOnCanvas(ctx, props, context, pointer, height, moreProps) {

	var { margin, ratio } = context;
	var { bgwidth, bgheight, bgFill, bgOpacity, chartId, yAccessor } = props;
	var { backgroundShapeCanvas, tooltipCanvas } = props;
	var { xAccessor, xScale, chartConfig, currentItem } = moreProps;

	var originX = 0.5 * ratio + margin.left;
	var originY = 0.5 * ratio + margin.top;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.scale(ratio, ratio);

	ctx.translate(originX, originY);

	var { x, y, content, centerX, drawWidth } = pointer;

	if (chartId && yAccessor) {
		var xValue = xAccessor(currentItem);
		var yValue = yAccessor(currentItem);
		var chartIndex = chartConfig.findIndex(x => x.id === chartId);

		x = Math.round(xScale(xValue));
		y = Math.round(chartConfig[chartIndex].yScale(yValue));

		x = (x - bgwidth  - PADDING * 2 < 0) ? x + PADDING : x - bgwidth - PADDING;
		y = (y - bgheight < 0) ? y + PADDING : y - bgheight - PADDING;
	}

	ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);
	ctx.beginPath();
	ctx.rect(centerX - drawWidth / 2, 0, drawWidth, height);
	ctx.fill();

	ctx.translate(x, y);
	backgroundShapeCanvas(props, content, ctx);
	tooltipCanvas(props, content, ctx);

	ctx.restore();
}

function helper(props, moreProps) {
	var { show, xScale, mouseXY, currentItem, plotData } = moreProps;
	var { bgheight, bgwidth, origin, tooltipContent } = props;
	var { xAccessor, displayXAccessor } = moreProps;

	if (!show || isNotDefined(currentItem)) return;

	var xValue = xAccessor(currentItem);

	if (!show || isNotDefined(xValue)) return;

	var [x, y] = origin(mouseXY, bgheight, bgwidth, xAccessor, currentItem, xScale);

	var content = tooltipContent({ currentItem, xAccessor: displayXAccessor });
	var centerX = xScale(xValue);
	var drawWidth = Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData)))) / (plotData.length - 1);

	return { x, y, content, centerX, drawWidth };
}

export default HoverTooltip;
