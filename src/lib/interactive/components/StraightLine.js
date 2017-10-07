import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

import {
	isDefined,
	noop,
	hexToRGBA,
	getStrokeDasharray,
	strokeDashTypes,
} from "../../utils";

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

			const hovering = isHovering({
				x1Value, y1Value,
				x2Value, y2Value,
				mouseXY,
				type,
				tolerance,
				xScale,
				yScale,
			});

			// console.log("hovering ->", hovering);

			return hovering;
		}
		return false;
	}
	drawOnCanvas(ctx, moreProps) {
		const { stroke, strokeWidth, strokeOpacity, strokeDasharray } = this.props;
		const { x1, y1, x2, y2 } = helper(this.props, moreProps);

		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = hexToRGBA(stroke, strokeOpacity);
		ctx.setLineDash(getStrokeDasharray(strokeDasharray).split(","));

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	renderSVG(moreProps) {
		const { stroke, strokeWidth, strokeOpacity } = this.props;

		const lineWidth = strokeWidth;

		const { x1, y1, x2, y2 } = helper(this.props, moreProps);
		return (
			<line
				x1={x1} y1={y1} x2={x2} y2={y2}
				stroke={stroke} strokeWidth={lineWidth}
				strokeOpacity={strokeOpacity} />
		);
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

			drawOn={["mousemove", "pan", "drag"]}
		/>;
	}
}

export function isHovering2(start, end, [mouseX, mouseY], tolerance) {
	const m = getSlope(start, end);

	if (isDefined(m)) {
		const b = getYIntercept(m, end);
		const y = m * mouseX + b;
		return (mouseY < y + tolerance)
			&& mouseY > (y - tolerance)
			&& mouseX > Math.min(start[0], end[0]) - tolerance
			&& mouseX < Math.max(start[0], end[0]) + tolerance;
	} else {
		return mouseY >= Math.min(start[1], end[1])
			&& mouseY <= Math.max(start[1], end[1])
			&& mouseX < start[0] + tolerance
			&& mouseX > start[0] - tolerance;
	}
}

export function isHovering({
	x1Value, y1Value,
	x2Value, y2Value,
	mouseXY,
	type,
	tolerance,
	xScale,
	yScale,
}) {

	const line = generateLine({
		type,
		start: [x1Value, y1Value],
		end: [x2Value, y2Value],
		xScale,
		yScale,
	});

	const start = [xScale(line.x1), yScale(line.y1)];
	const end = [xScale(line.x2), yScale(line.y2)];

	const m = getSlope(start, end);
	const [mouseX, mouseY] = mouseXY;

	if (isDefined(m)) {
		const b = getYIntercept(m, end);
		const y = m * mouseX + b;

		return mouseY < (y + tolerance)
			&& mouseY > (y - tolerance)
			&& mouseX > Math.min(start[0], end[0]) - tolerance
			&& mouseX < Math.max(start[0], end[0]) + tolerance;
	} else {
		return mouseY >= Math.min(start[1], end[1])
			&& mouseY <= Math.max(start[1], end[1])
			&& mouseX < start[0] + tolerance
			&& mouseX > start[0] - tolerance;
	}
}

function helper(props, moreProps) {
	const { x1Value, x2Value, y1Value, y2Value, type } = props;

	const { xScale, chartConfig: { yScale } } = moreProps;

	const modLine = generateLine({
		type,
		start: [x1Value, y1Value],
		end: [x2Value, y2Value],
		xScale,
		yScale,
	});

	const x1 = xScale(modLine.x1);
	const y1 = yScale(modLine.y1);
	const x2 = xScale(modLine.x2);
	const y2 = yScale(modLine.y2);

	return {
		x1, y1, x2, y2
	};
}

export function getSlope(start, end) {
	const m /* slope */ = end[0] === start[0]
		? undefined
		: (end[1] - start[1]) / (end[0] - start[0]);
	return m;
}
export function getYIntercept(m, end) {
	const b /* y intercept */ = -1 * m * end[0] + end[1];
	return b;
}

export function generateLine({
	type, start, end, xScale, yScale
}) {
	const m /* slope */ = getSlope(start, end);
	// console.log(end[0] - start[0], m)
	const b /* y intercept */ = getYIntercept(m, start);

	switch (type) {
	case "XLINE":
		return getXLineCoordinates({
			type, start, end, xScale, yScale, m, b
		});
	case "RAY":
		return getRayCoordinates({
			type, start, end, xScale, yScale, m, b
		});
	case "LINE":
		return getLineCoordinates({
			type, start, end, xScale, yScale, m, b
		});
	}
}

function getXLineCoordinates({
	start, end, xScale, yScale, m, b
}) {
	const [xBegin, xFinish] = xScale.domain();
	const [yBegin, yFinish] = yScale.domain();

	if (end[0] === start[0]) {
		return {
			x1: end[0], y1: yBegin,
			x2: end[0], y2: yFinish,
		};
	}
	const [x1, x2] = end[0] > start[0]
		? [xBegin, xFinish]
		: [xFinish, xBegin];

	return {
		x1, y1: m * x1 + b,
		x2, y2: m * x2 + b
	};
}

function getRayCoordinates({
	start, end, xScale, yScale, m, b
}) {
	const [xBegin, xFinish] = xScale.domain();
	const [yBegin, yFinish] = yScale.domain();

	const x1 = start[0];
	if (end[0] === start[0]) {
		return {
			x1,
			y1: start[1],
			x2: x1,
			y2: end[1] > start[1] ? yFinish : yBegin,
		};
	}

	const x2 = end[0] > start[0]
		? xFinish
		: xBegin;

	return {
		x1, y1: m * x1 + b,
		x2, y2: m * x2 + b
	};
}

function getLineCoordinates({
	start, end
}) {

	const [x1, y1] = start;
	const [x2, y2] = end;
	if (end[0] === start[0]) {
		return {
			x1,
			y1: start[1],
			x2: x1,
			y2: end[1],
		};
	}

	return {
		x1, y1,
		x2, y2,
	};
}

StraightLine.propTypes = {
	x1Value: PropTypes.any.isRequired,
	x2Value: PropTypes.any.isRequired,
	y1Value: PropTypes.any.isRequired,
	y2Value: PropTypes.any.isRequired,

	interactiveCursorClass: PropTypes.string,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	strokeOpacity: PropTypes.number.isRequired,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),

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
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,

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

	edgeStrokeWidth: 3,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	r: 10,
	withEdge: false,
	strokeWidth: 1,
	strokeDasharray: "Solid",
	children: noop,
	tolerance: 7,
	selected: false,
};

export default StraightLine;