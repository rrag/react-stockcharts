import React, { Component } from "react";
import PropTypes from "prop-types";

import { path as d3Path } from "d3-path";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";
import { generateLine, isHovering } from "./StraightLine";

import { isDefined, isNotDefined, noop, hexToRGBA } from "../../utils";

class ChannelWithArea extends Component {
	constructor(props) {
		super(props);

		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		const { tolerance, onHover } = this.props;

		if (isDefined(onHover)) {

			const { line1, line2 } = helper(this.props, moreProps);

			const { mouseXY } = moreProps;

			const [mouseX, mouseY] = mouseXY;

			const left = Math.min(line1.x1, line1.x2);
			const right = Math.max(line1.x1, line1.x2);
			const top = Math.min(line1.y1, line1.y2, line2.y1, line2.y2);
			const bottom = Math.max(line1.y1, line1.y2, line2.y1, line2.y2);

			const isWithinLineBounds = mouseX >= left && mouseX <= right
				&& mouseY >= top && mouseY <= bottom;

			if (isWithinLineBounds) {
				const line1Hovering = isHovering(
					[line1.x1, line1.y1],
					[line1.x2, line1.y2],
					mouseXY,
					tolerance);

				const line2Hovering = isHovering(
					[line2.x1, line2.y1],
					[line2.x2, line2.y2],
					mouseXY,
					tolerance);

				// console.log("hovering ->", hovering);

				return line1Hovering || line2Hovering;
			}
		}
		return false;
	}
	drawOnCanvas(ctx, moreProps) {
		const { stroke, strokeWidth, opacity, fill } = this.props;
		const { line1, line2 } = helper(this.props, moreProps);

		if (isDefined(line1)) {
			const { x1, y1, x2, y2 } = line1;

			ctx.lineWidth = strokeWidth;
			ctx.strokeStyle = hexToRGBA(stroke, opacity);

			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			if (isDefined(line2)) {
				const {
					y1: line2Y1,
					y2: line2Y2
				} = line2;

				ctx.beginPath();
				ctx.moveTo(x1, line2Y1);
				ctx.lineTo(x2, line2Y2);
				ctx.stroke();

				ctx.fillStyle = hexToRGBA(fill, opacity);
				ctx.beginPath();
				ctx.moveTo(x1, y1);

				ctx.lineTo(x2, y2);
				ctx.lineTo(x2, line2Y2);
				ctx.lineTo(x1, line2Y1);

				ctx.closePath();
				ctx.fill();
			}
		}
	}
	renderSVG(moreProps) {
		const { stroke, strokeWidth, opacity, fill } = this.props;
		const { line1, line2 } = helper(this.props, moreProps);

		if (isDefined(line1)) {
			const { x1, y1, x2, y2 } = line1;
			const line = isDefined(line2)
				? <line
					strokeWidth={strokeWidth}
					stroke={stroke}
					strokeOpacity={opacity}
					x1={x1}
					y1={line2.y1}
					x2={x2}
					y2={line2.y2}
				/>
				: null;
			const area = isDefined(line2)
				? <path
					fill={fill}
					fillOpacity={opacity}
					d={getPath(line1, line2)}
				/>
				: null;

			return (
				<g>
					<line
						strokeWidth={strokeWidth}
						stroke={stroke}
						strokeOpacity={opacity}
						x1={x1}
						y1={y1}
						x2={x2}
						y2={y2}
					/>
					{line}
					{area}
				</g>
			);
		}
	}
	render() {
		const { selected, interactiveCursorClass } = this.props;
		const { onDragStart, onDrag, onDragComplete, onHover, onUnHover } = this.props;

		return <GenericChartComponent
			isHover={this.isHover}

			svgDraw={this.renderSVG}
			canvasToDraw={getMouseCanvas}
			canvasDraw={this.drawOnCanvas}

			interactiveCursorClass={interactiveCursorClass}
			selected={selected}

			onDragStart={onDragStart}
			onDrag={onDrag}
			onDragComplete={onDragComplete}
			onHover={onHover}
			onUnHover={onUnHover}

			drawOn={["mousemove", "mouseleave", "pan", "drag"]}
		/>;
	}
}
function getPath(line1, line2) {
	const ctx = d3Path();
	ctx.moveTo(line1.x1, line1.y1);
	ctx.lineTo(line1.x2, line1.y2);
	ctx.lineTo(line1.x2, line2.y2);
	ctx.lineTo(line1.x1, line2.y1);

	ctx.closePath();
	return ctx.toString();
}

function helper(props, moreProps) {
	const { startXY, endXY, dy, type } = props;

	const { xScale, chartConfig: { yScale } } = moreProps;

	if (isNotDefined(startXY) || isNotDefined(endXY)) {
		return {};
	}
	const modLine = generateLine({
		type,
		start: startXY,
		end: endXY,
		xScale,
	});

	const x1 = xScale(modLine.x1);
	const y1 = yScale(modLine.y1);
	const x2 = xScale(modLine.x2);
	const y2 = yScale(modLine.y2);

	const line1 = {
		x1, y1, x2, y2
	};
	const line2 = isDefined(dy)
		? {
			x1,
			y1: yScale(modLine.y1 + dy),
			x2,
			y2: yScale(modLine.y2 + dy),
		}
		: undefined;

	return { line1, line2 };
}

ChannelWithArea.propTypes = {
	interactiveCursorClass: PropTypes.string,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	opacity: PropTypes.number.isRequired,

	type: PropTypes.oneOf([
		"XLINE", // extends from -Infinity to +Infinity
		"RAY", // extends to +/-Infinity in one direction
		"LINE", // extends between the set bounds
	]).isRequired,

	onDragStart: PropTypes.func.isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,

	defaultClassName: PropTypes.string,

	tolerance: PropTypes.number.isRequired,
	selected: PropTypes.bool.isRequired,
};

ChannelWithArea.defaultProps = {
	onDragStart: noop,
	onDrag: noop,
	onDragComplete: noop,
	type: "LINE",

	strokeWidth: 1,
	tolerance: 4,
	selected: false,
};

export default ChannelWithArea;