

import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericComponent from "../GenericComponent";
import { sum } from "d3-array";

import { first, last, isNotDefined, isDefined, hexToRGBA } from "../utils";

class HoverTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const pointer = helper(this.props, moreProps, ctx);
		const { height } = moreProps;

		if (isNotDefined(pointer)) return null;
		drawOnCanvas(ctx, this.props, this.context, pointer, height, moreProps);
	}
	render() {
		return <GenericComponent
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOn={["mousemove", "pan"/* , "mouseleave" */]}
		/>;
	}
	renderSVG(moreProps) {
		const pointer = helper(this.props, moreProps);

		if (isNotDefined(pointer)) return null;

		const { bgFill, bgOpacity, backgroundShapeSVG, tooltipSVG } = this.props;
		const { bgheight, bgwidth } = this.props;
		const { height } = moreProps;

		const { x, y, content, centerX, pointWidth, bgSize } = pointer;

		const bgShape = isDefined(bgwidth) && isDefined(bgheight)
			? { width: bgwidth, height: bgheight }
			: bgSize;

		return (
			<g>
				<rect x={centerX - pointWidth / 2}
					y={0}
					width={pointWidth}
					height={height}
					fill={bgFill}
					opacity={bgOpacity} />
				<g className="react-stockcharts-tooltip-content" transform={`translate(${x}, ${y})`}>
					{backgroundShapeSVG(this.props, bgShape)}
					{tooltipSVG(this.props, content)}
				</g>
			</g>
		);
	}
}

HoverTooltip.propTypes = {
	chartId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	yAccessor: PropTypes.func,
	tooltipSVG: PropTypes.func,
	backgroundShapeSVG: PropTypes.func,
	bgwidth: PropTypes.number,
	bgheight: PropTypes.number,
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	tooltipContent: PropTypes.func.isRequired,
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
	// bgwidth: 150,
	// bgheight: 50,
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
function backgroundShapeSVG({ fill, stroke, opacity }, { height, width }) {
	return <rect
		height={height}
		width={width}
		fill={fill}
		opacity={opacity}
		stroke={stroke} />;
}

function tooltipSVG({ fontFamily, fontSize, fontFill }, content) {
	const tspans = [];
	const startY = Y + fontSize * 0.9;

	for (let i = 0; i < content.y.length; i++) {
		const y = content.y[i];
		const textY = startY + (fontSize * (i + 1));

		tspans.push(<tspan key={`L-${i}`} x={X} y={textY} fill={y.stroke}>{y.label}</tspan>);
		tspans.push(<tspan key={i}>: </tspan>);
		tspans.push(<tspan key={`V-${i}`}>{y.value}</tspan>);
	}
	return <text fontFamily={fontFamily} fontSize={fontSize} fill={fontFill}>
		<tspan x={X} y={startY}>{content.x}</tspan>
		{tspans}
	</text>;
}
/* eslint-enable react/prop-types */

function backgroundShapeCanvas(props, { width, height }, ctx) {
	const { fill, stroke, opacity } = props;

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

	for (let i = 0; i < content.y.length; i++) {
		const y = content.y[i];
		const textY = startY + (fontSize * (i + 1));
		ctx.fillStyle = y.stroke || fontFill;
		ctx.fillText(y.label, X, textY);

		ctx.fillStyle = fontFill;
		ctx.fillText(": " + y.value, X + ctx.measureText(y.label).width, textY);
	}
}

function drawOnCanvas(ctx, props, context, pointer, height) {

	const { margin, ratio } = context;
	const { bgFill, bgOpacity } = props;
	const { backgroundShapeCanvas, tooltipCanvas } = props;

	const originX = 0.5 * ratio + margin.left;
	const originY = 0.5 * ratio + margin.top;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.scale(ratio, ratio);

	ctx.translate(originX, originY);

	const { x, y, content, centerX, pointWidth, bgSize } = pointer;

	ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);
	ctx.beginPath();
	ctx.rect(centerX - pointWidth / 2, 0, pointWidth, height);
	ctx.fill();

	ctx.translate(x, y);
	backgroundShapeCanvas(props, bgSize, ctx);
	tooltipCanvas(props, content, ctx);

	ctx.restore();
}

function calculateTooltipSize({ fontFamily, fontSize, fontFill }, content, ctx) {
	if (isNotDefined(ctx)) {
		const canvas = document.createElement("canvas");
		ctx = canvas.getContext("2d");
	}

	ctx.font = `${fontSize}px ${fontFamily}`;
	ctx.fillStyle = fontFill;
	ctx.textAlign = "left";

	const measureText = str => ({
		width: ctx.measureText(str).width,
		height: fontSize,
	});

	const { width, height } = content.y
		.map(({ label, value }) => measureText(`${label}: ${value}`))
		// Sum all y and x sizes (begin with x label size)
		.reduce((res, size) => sumSizes(res, size), measureText(String(content.x)))
	;

	return {
		width: width + 2 * X,
		height: height + 2 * Y
	};
}

function sumSizes(...sizes) {
	return {
		width: Math.max(...sizes.map(size => size.width)),
		height: sum(sizes, d => d.height),
	};
}

function normalizeX(x, bgSize, pointWidth, width) {
	// return x - bgSize.width - pointWidth / 2 - PADDING * 2 < 0
	return x < width / 2
		? x + pointWidth / 2 + PADDING
		: x - bgSize.width - pointWidth / 2 - PADDING;
}

function normalizeY(y, bgSize) {
	return y - bgSize.height <= 0
		? y + PADDING
		: y - bgSize.height - PADDING;
}

function origin(props, moreProps, bgSize, pointWidth) {
	const { chartId, yAccessor } = props;
	const { mouseXY, xAccessor, currentItem, xScale, chartConfig, width } = moreProps;
	let y = last(mouseXY);

	const xValue = xAccessor(currentItem);
	let x = Math.round(xScale(xValue));

	if (isDefined(chartId) && isDefined(yAccessor)
			&& isDefined(chartConfig) && isDefined(chartConfig.findIndex)) {
		const yValue = yAccessor(currentItem);
		const chartIndex = chartConfig.findIndex(x => x.id === chartId);

		y = Math.round(chartConfig[chartIndex].yScale(yValue));
	}

	x = normalizeX(x, bgSize, pointWidth, width);
	y = normalizeY(y, bgSize);

	return [x, y];
}

function helper(props, moreProps, ctx) {
	const { show, xScale, currentItem, plotData } = moreProps;
	const { origin, tooltipContent } = props;
	const { xAccessor, displayXAccessor } = moreProps;

	if (!show || isNotDefined(currentItem)) return;

	const xValue = xAccessor(currentItem);

	if (!show || isNotDefined(xValue)) return;

	const content = tooltipContent({ currentItem, xAccessor: displayXAccessor });
	const centerX = xScale(xValue);
	const pointWidth = Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData)))) / (plotData.length - 1);

	const bgSize = calculateTooltipSize(props, content, ctx);

	const [x, y] = origin(props, moreProps, bgSize, pointWidth);

	return { x, y, content, centerX, pointWidth, bgSize };
}

export default HoverTooltip;
