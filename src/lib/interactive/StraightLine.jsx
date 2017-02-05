import React, { PropTypes, Component } from "react";

import GenericChartComponent from "../GenericChartComponent";
import { getInteractiveCanvas } from "../GenericComponent";

import { isDefined, head, last, noop, hexToRGBA } from "../utils";

function getX1Y1(x1Value, y1Value, xScale, yScale) {
	return [xScale(x1Value), yScale(y1Value)];
}
function getX2Y2(x2Value, y2Value, xScale, yScale) {
	return [xScale(x2Value), yScale(y2Value)];
}
class StraightLine extends Component {
	constructor(props) {
		super(props);

		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		const { tolerance, onHover } = this.props;

		if (isDefined(onHover)) {
			const { x1Value, x2Value, y1Value, y2Value, type } = this.props;
			const { mouseXY, xScale } = moreProps;
			const { chartConfig: { yScale } } = moreProps;

			const [mouseX] = mouseXY;

			const start = (x1Value < x2Value
				? getX1Y1(x1Value, y1Value, xScale, yScale)
				: getX2Y2(x2Value, y2Value, xScale, yScale));

			const end = x1Value > x2Value
				? getX1Y1(x1Value, y1Value, xScale, yScale)
				: getX2Y2(x2Value, y2Value, xScale, yScale);

			const isWithinLineBounds = type === "LINE"
				&& (mouseX >= start[0] && mouseX <= end[0]);

			if (isWithinLineBounds
					|| (type === "RAY" && mouseX >= start[0])
					|| type === "XLINE") {
				const hovering = isHovering(start, end, mouseXY, tolerance);

				// console.log("hovering ->", hovering);

				return hovering;
			}
		}
		return false;
	}
	drawOnCanvas(ctx, moreProps) {
		const { stroke, strokeWidth, opacity } = this.props;
		const { x1, y1, x2, y2 } = helper(this.props, moreProps);

		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = hexToRGBA(stroke, opacity);
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	renderSVG(moreProps) {
		const { stroke, strokeWidth, opacity } = this.props;

		const lineWidth = strokeWidth;

		const { x1, y1, x2, y2 } = helper(this.props, moreProps);
		return (
			<line
				x1={x1} y1={y1} x2={x2} y2={y2}
				stroke={stroke} strokeWidth={lineWidth}
				opacity={opacity} />
		);
	}
	render() {
		const { selected, onClick, onClickOutside, interactiveCursorClass } = this.props;
		const { onDragStart, onDrag, onDragComplete, onHover, onBlur } = this.props;

		return <GenericChartComponent
			isHover={this.isHover}

			svgDraw={this.renderSVG}
			canvasToDraw={getInteractiveCanvas}
			canvasDraw={this.drawOnCanvas}

			interactiveCursorClass={interactiveCursorClass}
			selected={selected}

			onClick={onClick}
			onClickOutside={onClickOutside}
			onDragStart={onDragStart}
			onDrag={onDrag}
			onDragComplete={onDragComplete}
			onHover={onHover}
			onBlur={onBlur}

			drawOn={["mousemove", "pan", "drag"]}
			/>;
	}
}

function isHovering(start, end, [mouseX, mouseY], tolerance) {
	const m = getSlope(start, end);
	const b = getYIntercept(m, end);
	const y = m * mouseX + b;
	return (mouseY < y + tolerance) && mouseY > (y - tolerance);
}

function helper(props, moreProps) {
	const { x1Value, x2Value, y1Value, y2Value, type } = props;

	const { xScale, chartConfig: { yScale }, plotData } = moreProps;
	const { xAccessor } = moreProps;

	const modLine = generateLine(type,
		[x1Value, y1Value],
		[x2Value, y2Value], xAccessor, plotData);

	const x1 = xScale(modLine.x1);
	const y1 = yScale(modLine.y1);
	const x2 = xScale(modLine.x2);
	const y2 = yScale(modLine.y2);

	return {
		x1, y1, x2, y2
	};
}

function getSlope(start, end) {
	const m /* slope */ = end[0] === start[0]
		? 0
		: (end[1] - start[1]) / (end[0] - start[0]);
	return m;
}
function getYIntercept(m, end) {
	const b /* y intercept */ = -1 * m * end[0] + end[1];
	return b;
}

export function generateLine(type, start, end, xAccessor, plotData) {
	const m /* slope */ = getSlope(start, end);
	// console.log(end[0] - start[0], m)
	const b /* y intercept */ = getYIntercept(m, end);
	// y = m * x + b
	const x1 = type === "XLINE"
		? xAccessor(head(plotData))
		: start[0]; // RAY or LINE start is the same

	const y1 = m * x1 + b;

	const x2 = type === "XLINE"
		? xAccessor(last(plotData))
		: type === "RAY"
			? end[0] > start[0] ? xAccessor(last(plotData)) : xAccessor(head(plotData))
			: end[0];
	const y2 = m * x2 + b;
	return { x1, y1, x2, y2 };
}

StraightLine.propTypes = {
	x1Value: PropTypes.any.isRequired,
	x2Value: PropTypes.any.isRequired,
	y1Value: PropTypes.any.isRequired,
	y2Value: PropTypes.any.isRequired,

	interactiveCursorClass: PropTypes.string,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	type: PropTypes.oneOf([
		"XLINE", // extends from -Infinity to +Infinity
		"RAY", // extends to +/-Infinity in one direction
		"LINE", // extends between the set bounds
	]).isRequired,

	onEdge1Drag: PropTypes.func.isRequired,
	onEdge2Drag: PropTypes.func.isRequired,
	onDragStart: PropTypes.func.isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
	onClickOutside: PropTypes.func.isRequired,
	onHover: PropTypes.func,
	onBlur: PropTypes.func,

	opacity: PropTypes.number.isRequired,
	defaultClassName: PropTypes.string,

	r: PropTypes.number.isRequired,
	edgeFill: PropTypes.string.isRequired,
	edgeStroke: PropTypes.string.isRequired,
	edgeStrokeWidth: PropTypes.number.isRequired,
	withEdge: PropTypes.bool.isRequired,
	children: PropTypes.func.isRequired,
	tolerance: PropTypes.number.isRequired,
	selected: PropTypes.bool.isRequired,
};

StraightLine.defaultProps = {
	onEdge1Drag: noop,
	onEdge2Drag: noop,
	onDragStart: noop,
	onDrag: noop,
	onDragComplete: noop,

	onClick: noop,
	onClickOutside: noop,

	edgeStrokeWidth: 3,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	r: 10,
	withEdge: false,
	strokeWidth: 1,
	children: noop,
	tolerance: 4,
	selected: false,
};

export default StraightLine;