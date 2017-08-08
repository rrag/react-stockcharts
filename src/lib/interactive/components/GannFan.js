import React, { Component } from "react";
import PropTypes from "prop-types";

import { pairs } from "d3-array";
import { path as d3Path } from "d3-path";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";
import { generateLine, isHovering, getSlope, getYIntercept } from "./StraightLine";

import {
	isDefined, isNotDefined,
	noop, hexToRGBA,
	degrees, radians,
	head, last
} from "../../utils";

class GannFan extends Component {
	constructor(props) {
		super(props);

		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		const { tolerance, onHover } = this.props;
		const { mouseXY } = moreProps;
		const [mouseX, mouseY] = mouseXY;

		let hovering = false;
		if (isDefined(onHover)) {

			const lines = helper(this.props, moreProps);

			for (let i = 0; i < lines.length; i++) {
				const line1 = lines[i];

				const left = Math.min(line1.x1, line1.x2);
				const right = Math.max(line1.x1, line1.x2);
				const top = Math.min(line1.y1, line1.y2);
				const bottom = Math.max(line1.y1, line1.y2);

				const isWithinLineBounds = mouseX >= left && mouseX <= right
					&& mouseY >= top && mouseY <= bottom;

				hovering = isWithinLineBounds
					&& isHovering(
						[line1.x1, line1.y1],
						[line1.x2, line1.y2],
						mouseXY,
						tolerance);

				if (hovering) break;
			}
		}
		return hovering;
	}
	drawOnCanvas(ctx, moreProps) {
		const { stroke, strokeWidth, opacity, fill, fillOpacity } = this.props;

		const lines = helper(this.props, moreProps);

		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = hexToRGBA(stroke, opacity);


		lines.forEach(line => {
			const { x1, y1, x2, y2 } = line;

			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		});
		const pairsOfLines = pairs(lines);

		pairsOfLines.forEach(([line1, line2], idx) => {
			ctx.fillStyle = hexToRGBA(fill[idx], fillOpacity);

			ctx.beginPath();
			ctx.moveTo(line1.x1, line1.y1);
			ctx.lineTo(line1.x2, line1.y2);
			ctx.lineTo(line2.x2, line2.y2);
			ctx.closePath();
			ctx.fill();
		});
	}
	renderSVG(moreProps) {
		const { stroke, strokeWidth, opacity, fill, fillOpacity } = this.props;

		const lines = helper(this.props, moreProps);
		const pairsOfLines = pairs(lines);

		return (
			<g>
				{lines.map((each, idx) => {
					const { x1, y1, x2, y2 } = each;
					return (
						<line key={idx}
							strokeWidth={strokeWidth}
							stroke={stroke}
							strokeOpacity={opacity}
							x1={x1}
							y1={y1}
							x2={x2}
							y2={y2}
						/>
					);
				})}
				{pairsOfLines.map(([line1, line2], idx) => {
					const ctx = d3Path();
					ctx.moveTo(line1.x1, line1.y1);
					ctx.lineTo(line1.x2, line1.y2);
					ctx.lineTo(line2.x2, line2.y2);
					ctx.closePath();
					return (
						<path key={idx}
							stroke="none"
							fill={fill[idx]}
							fillOpacity={fillOpacity}
							d={ctx.toString()}
						/>
					);
				})}
			</g>
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

			drawOn={["mousemove", "mouseleave", "pan", "drag"]}
		/>;
	}
}

const xyProvider1 = (moreProps, endXY, m, b, dx, dy) =>  {
	const { chartConfig: { yScale } } = moreProps;
	// y = mx + b
	// x = (y - b) / m
	const y = yScale(endXY[1]);
	const x = (y - b) / m;
	return [x, y + dy];
};

const xyProvider2 = (moreProps, endXY, m, b, dx/* , dy*/) =>  {
	const { xScale } = moreProps;
	// y = mx + b
	// x = (y - b) / m
	const x = xScale(endXY[0]);
	const y = m * x + b;
	return [x + dx, y];
};

const FAN_LINES_1 = [
	{ label: "1x8", angle: 82.5, xyProvider: xyProvider1 },
	{ label: "1x4", angle: 75, xyProvider: xyProvider1 },
	{ label: "1x3", angle: 71.25, xyProvider: xyProvider1 },
	{ label: "1x2", angle: 63.75, xyProvider: xyProvider1 },
];
const MAIN_LINE = { label: "1x1", angle: 45 };

const FAN_LINES_2 = [
	{ label: "2x1", angle: 26.25, xyProvider: xyProvider2 },
	{ label: "3x1", angle: 18.75, xyProvider: xyProvider2 },
	{ label: "4x1", angle: 15, xyProvider: xyProvider2 },
	{ label: "8x1", angle: 7.5, xyProvider: xyProvider2 },
];

function helper(props, moreProps) {
	const { startXY, endXY } = props;

	const { xScale, chartConfig, plotData } = moreProps;
	const { yScale } = chartConfig;
	const { xAccessor } = moreProps;

	if (isNotDefined(startXY) || isNotDefined(endXY)) {
		return [];
	}
	if (xAccessor(head(plotData)) >=  Math.max(startXY[0], endXY[0])
			|| xAccessor(last(plotData)) <=  Math.min(startXY[0], endXY[0])) {
		return [];
	}

	const modLine = generateLine({
		type: "RAY",
		start: startXY,
		end: endXY,
		xScale,
	});

	const x1 = xScale(modLine.x1);
	const y1 = yScale(modLine.y1);
	const x2 = xScale(modLine.x2);
	const y2 = yScale(modLine.y2);

	const m = getSlope([x1, y1], [x2, y2]);
	const realSlope = getSlope(startXY, endXY);

	const dx = x2 > x1 ? 10 : -10;
	const dy = y2 < y1 ? -10 : 10;

	const line1 = {
		x1, y1, x2, y2,
		text: {
			label: MAIN_LINE.label,
			xy: [xScale(endXY[0]) + dx, yScale(endXY[1]) + dy]
		},
	};

	if (isNotDefined(realSlope)) return [];

	const angle = degrees(Math.atan(m));

	const mapper = each => {
		const reference = correctAngle(angle, angle);
		const theta = correctAngle(angle, (each.angle / 45) * reference);

		// console.log(angle, reference, each.angle, theta);

		const slope = Math.tan(radians(theta));
		const b = getYIntercept(slope, [x1, y1]);
		const x2dash = x2 > x1
			? Math.max(...xScale.range())
			: Math.min(...xScale.range());
		const y2dash = slope * x2dash + b;

		const text = {
			label: each.label,
			xy: each.xyProvider(moreProps, endXY, slope, b, dx, dy)
		};

		return { x1, y1, x2: x2dash, y2: y2dash, text };
	};

	const lines = FAN_LINES_1
		.map(mapper)
		.concat(line1)
		.concat(FAN_LINES_2.map(mapper));

	return lines;
}

function correctAngle(reference, actual) {
	const angle = Math.abs(reference) > 45
		? (reference / Math.abs(reference) * 90) - actual
		: actual;

	return angle;
}

GannFan.propTypes = {
	interactiveCursorClass: PropTypes.string,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	fill: PropTypes.arrayOf(PropTypes.string).isRequired,
	opacity: PropTypes.number.isRequired,
	fillOpacity: PropTypes.number.isRequired,

	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	fontStroke: PropTypes.string.isRequired,

	onDragStart: PropTypes.func.isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,

	defaultClassName: PropTypes.string,

	tolerance: PropTypes.number.isRequired,
	selected: PropTypes.bool.isRequired,
};

GannFan.defaultProps = {
	onDragStart: noop,
	onDrag: noop,
	onDragComplete: noop,

	strokeWidth: 1,
	tolerance: 4,
	selected: false,
};

export default GannFan;
