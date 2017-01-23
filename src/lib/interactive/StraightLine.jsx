import React, { PropTypes, Component } from "react";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";

import { head, last, noop, hexToRGBA } from "../utils";

function getX1Y1(x1Value, y1Value, xScale, yScale) {
	return [xScale(x1Value), yScale(y1Value)];
}
function getX2Y2(x2Value, y2Value, xScale, yScale) {
	return [xScale(x2Value), yScale(y2Value)];
}
class StraightLine extends Component {
	constructor(props) {
		super(props);
		this.saveNode = this.saveNode.bind(this);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	saveNode(node) {
		this.node = node;
	}
	isHover(moreProps) {
		var { tolerance, noHover } = this.props;

		if (!noHover) {
			var { x1Value, x2Value, y1Value, y2Value, type } = this.props;
			var { mouseXY, xScale } = moreProps;
			var { chartConfig: { yScale } } = moreProps;

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
		var { stroke, strokeWidth, opacity, selected } = this.props;
		var { hovering } = moreProps;
		const { x1, y1, x2, y2 } = helper(this.props, moreProps);

		ctx.lineWidth = (hovering || selected)
			? strokeWidth + 2
			: strokeWidth;
		ctx.strokeStyle = hexToRGBA(stroke, opacity);
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	renderSVG(moreProps) {
		var { stroke, strokeWidth, opacity, selected } = this.props;
		var { hovering } = moreProps;

		const lineWidth = (hovering || selected)
			? strokeWidth + 2
			: strokeWidth;

		const { x1, y1, x2, y2 } = helper(this.props, moreProps);
		return (
			<line
				x1={x1} y1={y1} x2={x2} y2={y2}
				stroke={stroke} strokeWidth={lineWidth}
				opacity={opacity} />
		);

	}
	render() {
		var { selected, onSelect } = this.props;
		var { onDragStart, onDrag, onDragComplete } = this.props;

		return <GenericChartComponent ref={this.saveNode}
			selected={selected}
			onSelect={onSelect}
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			isHover={this.isHover}
			onDragStart={onDragStart}
			onDrag={onDrag}
			onDragComplete={onDragComplete}
			drawOnPan
			/>;
	}
}

function isHovering(start, end, [mouseX, mouseY], tolerance) {
	var m = getSlope(start, end);
	var b = getYIntercept(m, end);
	const y = m * mouseX + b;
	return (mouseY < y + tolerance) && mouseY > (y - tolerance);
}

function helper(props, moreProps) {
	var { x1Value, x2Value, y1Value, y2Value, type } = props;

	var { xScale, chartConfig: { yScale }, plotData } = moreProps;
	var { xAccessor } = moreProps;

	var modLine = generateLine(type,
		[x1Value, y1Value],
		[x2Value, y2Value], xAccessor, plotData);

	var x1 = xScale(modLine.x1);
	var y1 = yScale(modLine.y1);
	var x2 = xScale(modLine.x2);
	var y2 = yScale(modLine.y2);

	return {
		x1, y1, x2, y2
	};
}

function getSlope(start, end) {
	var m /* slope */ = end[0] === start[0]
		? 0
		: (end[1] - start[1]) / (end[0] - start[0]);
	return m;
}
function getYIntercept(m, end) {
	var b /* y intercept */ = -1 * m * end[0] + end[1];
	return b;
}

function generateLine(type, start, end, xAccessor, plotData) {
	var m /* slope */ = getSlope(start, end);
	// console.log(end[0] - start[0], m)
	var b /* y intercept */ = getYIntercept(m, end);
	// y = m * x + b
	var x1 = type === "XLINE"
		? xAccessor(head(plotData))
		: start[0]; // RAY or LINE start is the same

	var y1 = m * x1 + b;

	var x2 = type === "XLINE"
		? xAccessor(last(plotData))
		: type === "RAY"
			? end[0] > start[0] ? xAccessor(last(plotData)) : xAccessor(head(plotData))
			: end[0];
	var y2 = m * x2 + b;
	return { x1, y1, x2, y2 };
}

StraightLine.propTypes = {
	x1Value: PropTypes.any.isRequired,
	x2Value: PropTypes.any.isRequired,
	y1Value: PropTypes.any.isRequired,
	y2Value: PropTypes.any.isRequired,

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
	r: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	edgeFill: PropTypes.string.isRequired,
	defaultClassName: PropTypes.string,
	echo: PropTypes.any,
	edgeStroke: PropTypes.string.isRequired,
	edgeStrokeWidth: PropTypes.number.isRequired,
	withEdge: PropTypes.bool.isRequired,
	onSelect: PropTypes.func.isRequired,
	children: PropTypes.func.isRequired,
	tolerance: PropTypes.number.isRequired,
	selected: PropTypes.bool.isRequired,
	noHover: PropTypes.bool.isRequired,
};

StraightLine.defaultProps = {
	onEdge1Drag: noop,
	onEdge2Drag: noop,
	onDragStart: noop,
	onDrag: noop,
	onDragComplete: noop,
	edgeStrokeWidth: 3,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	r: 10,
	withEdge: false,
	strokeWidth: 1,
	onSelect: noop,
	children: noop,
	tolerance: 4,
	selected: false,
	noHover: false,
};

export default StraightLine;