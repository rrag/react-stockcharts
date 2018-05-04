

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";


const propTypes = {
	xPosition: PropTypes.func,
	drawCoordinate: PropTypes.func,
	displayFormat: PropTypes.func.isRequired,
	at: PropTypes.oneOf(["bottom", "top"]),
	orient: PropTypes.oneOf(["bottom", "top"]),
	text: PropTypes.shape({
		fontStyle: PropTypes.string,
		fontWeight: PropTypes.string,
		fontFamily: PropTypes.string,
		fontSize: PropTypes.number,
		fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
	}),
	bg: PropTypes.shape({
		fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
		stroke: PropTypes.string,
		strokeWidth: PropTypes.number,
		padding: PropTypes.shape({
			left: PropTypes.number,
			right: PropTypes.number,
			top: PropTypes.number,
			bottom: PropTypes.number
		}),
	}),
	dx: PropTypes.number,
	dy: PropTypes.number
};

const defaultProps = {
	xPosition,
	drawCoordinate,
	at: "bottom",
	orient: "bottom",

	text: {
		fontStyle: "",
		fontWeight: "",
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 13,
		fill: "rgb(35, 35, 35)"
	},
	bg: {
		fill: "rgb(255, 255, 255)",
		stroke: "rgb(35, 35, 35)",
		strokeWidth: 1,
		padding: {
			left: 7,
			right: 7,
			top: 4,
			bottom: 4
		}
	},
	dx: 7,
	dy: 7
};

class MouseCoordinateXV2 extends Component {
	constructor(props) {
		super(props);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const { show, currentItem } = moreProps;
		const { drawCoordinate } = this.props;

		if (show && currentItem != null) {
			const shape = getXCoordinateInfo(ctx, this.props, moreProps);
			drawCoordinate(ctx, shape, this.props, moreProps);
		}
	}
	render() {
		return (
			<GenericChartComponent
				clip={false}
				canvasDraw={this.drawOnCanvas}
				canvasToDraw={getMouseCanvas}
				drawOn={["mousemove", "pan", "drag"]}
			/>
		);
	}
}

MouseCoordinateXV2.defaultProps = defaultProps;
MouseCoordinateXV2.propTypes = propTypes;


function xPosition(props, moreProps) {
	const { currentItem, xAccessor } = moreProps;
	return xAccessor(currentItem);
}
function getXCoordinateInfo(ctx, props, moreProps) {
	const { xPosition } = props;
	const xValue = xPosition(props, moreProps);
	const { at, displayFormat } = props;
	const { text } = props;
	const { xScale, chartConfig: { height } } = moreProps;
	ctx.font = `${text.fontStyle} ${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;

	const t = displayFormat(xValue);
	const textWidth = ctx.measureText(t).width;

	const y = at === "bottom" ? height : 0;
	const x = Math.round(xScale(xValue));

	return {
		x,
		y,
		textWidth,
		text: t
	};
}

function drawCoordinate(
	ctx,
	shape,
	props,
	moreProps
) {
	const { x, y, textWidth, text } = shape;
	const { orient, dx, dy } = props;

	const {
		bg: { padding, fill, stroke, strokeWidth },
		text: { fontSize, fill: textFill }
	} = props;

	ctx.textAlign = "center";

	const sign = orient === "top" ? -1 : 1;
	const halfWidth = Math.round(textWidth / 2 + padding.right);
	const height = Math.round(fontSize + padding.top + padding.bottom);

	ctx.strokeStyle = typeof stroke === "function" ? stroke(moreProps, ctx) : stroke;
	ctx.fillStyle = typeof fill === "function" ? fill(moreProps, ctx) : fill;
	ctx.lineWidth = typeof strokeWidth === "function" ? strokeWidth(moreProps) : strokeWidth;

	ctx.beginPath();

	ctx.moveTo(x, y);
	ctx.lineTo(x + dx, y + sign * dy);
	ctx.lineTo(x + halfWidth, y + sign * dy);
	ctx.lineTo(x + halfWidth, y + sign * (dy + height));
	ctx.lineTo(x - halfWidth, y + sign * (dy + height));
	ctx.lineTo(x - halfWidth, y + sign * dy);
	ctx.lineTo(x - dx, y + sign * dy);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = typeof textFill === "function" ? textFill(moreProps, ctx) : textFill;

	ctx.textBaseline = orient === "top" ? "alphabetic" : "hanging";
	const pad = orient === "top" ? padding.bottom : padding.top;

	ctx.fillText(text, x, y + sign * (dy + pad + 2));
}

export default MouseCoordinateXV2;