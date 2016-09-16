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
		var pointer = helper(this.props, moreProps, this.context);

		if (isNotDefined(pointer)) return null;
		drawOnCanvas(ctx, this.props, this.context, pointer);
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
		var pointer = helper(this.props, moreProps, this.context);

		if (isNotDefined(pointer)) return null;

		var { bgFill, bgOpacity, backgroundShapeSVG } = this.props;
		var { height } = this.context;

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
	xAccessor: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
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

function origin(mouseXY, bgheight, bgwidth, xAccessor, currentItem, xScale) {
	var y = last(mouseXY);

	var snapX = xScale(xAccessor(currentItem));
	var originX = (snapX - bgwidth - PADDING * 2 < 0) ? snapX + PADDING : snapX - bgwidth - PADDING;
	// originX = (x - width - PADDING * 2 < 0) ? x + PADDING : x - width - PADDING;

	var originY = y - bgheight / 2;
	return [originX, originY];
}

function drawOnCanvas(ctx, props, context, pointer) {

	var { height, margin, ratio } = context;
	var { bgFill, bgOpacity } = props;
	var { backgroundShapeCanvas, tooltipCanvas } = props;

	var originX = 0.5 * ratio + margin.left;
	var originY = 0.5 * ratio + margin.top;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.scale(ratio, ratio);

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

function helper(props, moreProps, context) {
	var { show, xScale, mouseXY, currentItem, plotData } = moreProps;
	var { bgheight, bgwidth, origin, tooltipContent } = props;
	var { xAccessor, displayXAccessor } = context;

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