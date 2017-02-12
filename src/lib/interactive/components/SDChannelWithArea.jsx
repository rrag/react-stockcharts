import React, { PropTypes, Component } from "react";
import { deviation } from "d3-array";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";
import { generateLine, isHovering } from "./StraightLine";

import { isDefined, getClosestItemIndexes, noop, hexToRGBA } from "../../utils";

function getXY(xValue, yValue, xScale, yScale) {
	return [xScale(xValue), yScale(yValue)];
}

class SDChannelWithArea extends Component {
	constructor(props) {
		super(props);

		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		const { tolerance, onHover } = this.props;

		if (isDefined(onHover)) {

			const { x1Value, x2Value, y1Value, y2Value } = this.props;
			const { mouseXY, xScale } = moreProps;
			const { chartConfig: { yScale } } = moreProps;

			const [mouseX] = mouseXY;

			const start = (x1Value < x2Value
				? getXY(x1Value, y1Value, xScale, yScale)
				: getXY(x2Value, y2Value, xScale, yScale));

			const end = x1Value > x2Value
				? getXY(x1Value, y1Value, xScale, yScale)
				: getXY(x2Value, y2Value, xScale, yScale);

			const isWithinLineBounds = (mouseX >= start[0] && mouseX <= end[0]);

			if (isWithinLineBounds) {
				const hovering = isHovering(start, end, mouseXY, tolerance);
				return hovering;
			}
		}
		return false;
	}
	drawOnCanvas(ctx, moreProps) {
		const { stroke, strokeWidth, opacity, fill } = this.props;
		const { x1, y1, x2, y2, dy } = helper(this.props, moreProps);

		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = hexToRGBA(stroke, opacity);
		ctx.fillStyle = hexToRGBA(fill, opacity);

		ctx.beginPath();
		ctx.moveTo(x1, y1 - dy);
		ctx.lineTo(x2, y2 - dy);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(x2, y2 + dy);
		ctx.lineTo(x1, y1 + dy);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(x1, y1 - dy);
		ctx.lineTo(x2, y2 - dy);
		ctx.lineTo(x2, y2 + dy);
		ctx.lineTo(x1, y1 + dy);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(x2, y2);
		ctx.lineTo(x1, y1);
		ctx.stroke();
	}
	renderSVG(moreProps) {
		throw new Error("svg not implemented", moreProps);
	}
	render() {
		const { selected, onClick, onClickOutside, interactiveCursorClass } = this.props;
		const { onHover, onBlur } = this.props;


		return <GenericChartComponent
			isHover={this.isHover}

			svgDraw={this.renderSVG}
			canvasToDraw={getMouseCanvas}
			canvasDraw={this.drawOnCanvas}

			interactiveCursorClass={interactiveCursorClass}
			selected={selected}

			onClick={onClick}
			onClickOutside={onClickOutside}
			onHover={onHover}
			onBlur={onBlur}

			drawOn={["mousemove", "mouseleave", "pan", "drag"]}
			/>;
	}
}

function helper(props, moreProps) {
	const { x1Value, x2Value, y1Value, y2Value } = props;

	const { xScale, chartConfig: { yScale }, plotData } = moreProps;
	const { xAccessor } = moreProps;

	const modLine = generateLine("LINE",
		[x1Value, y1Value],
		[x2Value, y2Value], xAccessor, plotData);

	const x1 = xScale(modLine.x1);
	const y1 = yScale(modLine.y1);
	const x2 = xScale(modLine.x2);
	const y2 = yScale(modLine.y2);

	const { left } = getClosestItemIndexes(plotData, x1Value, xAccessor);
	const { right } = getClosestItemIndexes(plotData, x2Value, xAccessor);

	const startIndex = Math.min(left, right);
	const endIndex = Math.max(left, right) + 1;

	const array = plotData.slice(startIndex, endIndex);
	const stdDev = deviation(array, d => d.close);

	const dy = yScale(modLine.y1 - stdDev) - y1;

	return {
		x1, y1, x2, y2, dy
	};
}

SDChannelWithArea.propTypes = {
	x1Value: PropTypes.any.isRequired,
	x2Value: PropTypes.any.isRequired,
	y1Value: PropTypes.any.isRequired,
	y2Value: PropTypes.any.isRequired,

	interactiveCursorClass: PropTypes.string,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	opacity: PropTypes.number.isRequired,

	onDragStart: PropTypes.func.isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
	onClickOutside: PropTypes.func.isRequired,
	onHover: PropTypes.func,
	onBlur: PropTypes.func,

	defaultClassName: PropTypes.string,

	tolerance: PropTypes.number.isRequired,
	selected: PropTypes.bool.isRequired,
};

SDChannelWithArea.defaultProps = {
	onDragStart: noop,
	onDrag: noop,
	onDragComplete: noop,

	onClick: noop,
	onClickOutside: noop,

	strokeWidth: 1,
	tolerance: 4,
	selected: false,
};

export default SDChannelWithArea;