import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

import { isDefined, noop, hexToRGBA } from "../../utils";

class InteractiveText extends Component {
	constructor(props) {
		super(props);

		this.calculateTextWidth = true;

		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		const { onHover } = this.props;

		if (
			isDefined(onHover)
			&& isDefined(this.textWidth)
			&& !this.calculateTextWidth
		) {
			const { rect } = helper(this.props, moreProps, this.textWidth);
			const { mouseXY: [x, y] } = moreProps;

			if (
				x >= rect.x
				&& y >= rect.y
				&& x <= rect.x + rect.width
				&& y <= rect.y + rect.height
			) {
				return true;
			}
		}
		return false;
	}
	componentWillReceiveProps(nextProps) {
		this.calculateTextWidth = (
			nextProps.text !== this.props.text
			|| nextProps.fontStyle !== this.props.fontStyle
			|| nextProps.fontWeight !== this.props.fontWeight
			|| nextProps.fontSize !== this.props.fontSize
			|| nextProps.fontFamily !== this.props.fontFamily
		);
	}
	drawOnCanvas(ctx, moreProps) {
		const {
			bgFill,
			bgOpacity,
			textFill,
			fontFamily,
			fontSize,
			fontStyle,
			fontWeight,
			text,
		} = this.props;

		if (this.calculateTextWidth) {
			ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
			const { width } = ctx.measureText(text);
			this.textWidth = width;
			this.calculateTextWidth = false;
		}

		const { selected } = this.props;

		const { x, y, rect } = helper(this.props, moreProps, this.textWidth);

		ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);

		ctx.beginPath();
		ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

		if (selected) {
			ctx.strokeStyle = textFill;
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
		}

		ctx.fillStyle = textFill;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

		ctx.beginPath();
		ctx.fillText(text, x, y);
	}
	renderSVG() {
		throw new Error("svg not implemented");
	}
	render() {
		const { selected, interactiveCursorClass } = this.props;
		const { onHover, onUnHover } = this.props;
		const { onDragStart, onDrag, onDragComplete } = this.props;

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

function helper(props, moreProps, textWidth) {
	const { position, fontSize } = props;

	const { xScale, chartConfig: { yScale } } = moreProps;

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
	fontWeight: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]).isRequired,
	fontStyle: PropTypes.string.isRequired,

	text: PropTypes.string.isRequired,

	onDragStart: PropTypes.func.isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
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

	type: "SD", // standard dev
	fontWeight: "normal", // standard dev

	strokeWidth: 1,
	tolerance: 4,
	selected: false,
};

export default InteractiveText;