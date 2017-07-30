import React, { Component } from "react";
import PropTypes from "prop-types";
import { sum, deviation } from "d3-array";
import { path as d3Path } from "d3-path";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";
import { isHovering } from "./StraightLine";

import { isDefined, getClosestItemIndexes, noop, zipper, hexToRGBA } from "../../utils";

class InteractiveText extends Component {
	constructor(props) {
		super(props);

		this.calculateTextWidth = true;

		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		const { tolerance, onHover } = this.props;

		if (isDefined(onHover)) {
			const { mouseXY } = moreProps;

			const { x1, y1, x2, y2 } = helper(this.props, moreProps);

			const hovering = isHovering([x1, y1], [x2, y2], mouseXY, tolerance);
			return hovering;
		}
		return false;
	}
	componentWillReceiveProps(nextProps) {
		this.calculateTextWidth = (nextProps.text !== this.props.text)
	}
	drawOnCanvas(ctx, moreProps) {
		const {
			bgFill,
			bgOpacity,
			textFill,
			fontFamily,
			fontSize,
			text,
		} = this.props;

		if (this.calculateTextWidth) {
			ctx.font = `${ fontSize }px ${fontFamily}`;
			const { width } = ctx.measureText(text);
			this.textWidth = width;
			this.calculateTextWidth = false;
		}

		const { selected } = this.props;

		const { x, y, rect } = helper(this.props, moreProps, this.textWidth);

		ctx.fillStyle = textFill;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		ctx.beginPath();
		ctx.fillText(text, x, y);

		if (true) {
			ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);
			ctx.beginPath();
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		}
	}
	renderSVG(moreProps) {
		const { stroke, strokeWidth, opacity, fill } = this.props;
		const { x1, y1, x2, y2, dy } = helper(this.props, moreProps);
		const line = {
			strokeWidth,
			stroke,
			strokeOpacity: opacity,
		};
		const ctx = d3Path();
		ctx.moveTo(x1, y1 - dy);
		ctx.lineTo(x2, y2 - dy);
		ctx.lineTo(x2, y2 + dy);
		ctx.lineTo(x1, y1 + dy);
		ctx.closePath();
		return (
			<g>
				<line
					{...line}
					x1={x1}
					y1={y1 - dy}
					x2={x2}
					y2={y2 - dy}
				/>
				<line
					{...line}
					x1={x1}
					y1={y1 + dy}
					x2={x2}
					y2={y2 + dy}
				/>
				<path
					d={ctx.toString()}
					fill={fill}
					opacity={opacity}
				/>
				<line
					{...line}
					x1={x1}
					y1={y1}
					x2={x2}
					y2={y2}
				/>
			</g>
		);
	}
	render() {
		const { selected, interactiveCursorClass } = this.props;
		const { onHover, onUnHover, onClickWhenHovering, onClickOutside } = this.props;

		return <GenericChartComponent
			isHover={this.isHover}

			svgDraw={this.renderSVG}
			canvasToDraw={getMouseCanvas}
			canvasDraw={this.drawOnCanvas}

			interactiveCursorClass={interactiveCursorClass}
			selected={selected}

			onClickWhenHovering={onClickWhenHovering}
			onClickOutside={onClickOutside}
			onHover={onHover}
			onUnHover={onUnHover}

			drawOn={["mousemove", "mouseleave", "pan", "drag"]}
		/>;
	}
}

function helper(props, moreProps, textWidth) {
	const { position, text, fontSize } = props;

	const { xScale, chartConfig: { yScale }, fullData } = moreProps;
	const { xAccessor } = moreProps;

	/*
	http://www.metastock.com/Customer/Resources/TAAZ/?p=65
	y = a + bx
	n = length of array
	b = (n * sum(x*y) - sum(xs) * sum(ys)) / (n * sum(xSquareds) - (sum(xs) ^ 2))
	a = (sum of closes)
	*/
	const [xValue, yValue] = position;
	const x = xScale(xValue);
	const y = yScale(yValue);

	const rect = {
		x: x - textWidth / 2 - fontSize,
		y: y - fontSize,
		width: textWidth + fontSize * 2,
		height: fontSize * 2,
	};

	return {
		x, y, rect
	};
}

InteractiveText.propTypes = {
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	textFill: PropTypes.string.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	text: PropTypes.string.isRequired,

	onDragStart: PropTypes.func.isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onClickWhenHovering: PropTypes.func.isRequired,
	onClickOutside: PropTypes.func.isRequired,
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,

	defaultClassName: PropTypes.string,
	interactiveCursorClass: PropTypes.string,

	tolerance: PropTypes.number.isRequired,
	selected: PropTypes.bool.isRequired,
};

InteractiveText.defaultProps = {
	onDragStart: noop,
	onDrag: noop,
	onDragComplete: noop,

	onClickWhenHovering: noop,
	onClickOutside: noop,

	type: "SD", // standard dev

	strokeWidth: 1,
	tolerance: 4,
	selected: false,
};

export default InteractiveText;