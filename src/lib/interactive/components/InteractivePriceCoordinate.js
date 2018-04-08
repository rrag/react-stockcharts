import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";
import { isDefined, noop, hexToRGBA, getStrokeDasharrayCanvas } from "../../utils";

class InteractivePriceCoordinate extends Component {
	constructor(props) {
		super(props);

		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		const { onHover, selected } = this.props;

		if (isDefined(onHover)) {
			const { x1, x2, y, rect } = helper(this.props, moreProps);
			const { mouseXY: [mouseX, mouseY] } = moreProps;

			if (
				selected
				&& mouseX >= rect.x
				&& mouseX <= rect.x + rect.width
				&& mouseY >= rect.y
				&& mouseY <= rect.y + rect.height
			) {
				return true;
			}
			if (
				x1 <= mouseX
				&& x2 >= mouseX
				&& Math.abs(mouseY - y) < 4
			) {
				return true;
			}
		}
		return false;
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
		} = this.props;

		const { selected, hovering } = this.props;

		const { x1, x2, y, rect } = helper(this.props, moreProps);

		ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);
		ctx.strokeStyle = textFill;

		ctx.beginPath();
		if (selected || hovering) {
			ctx.lineWidth = 2;
			ctx.setLineDash(getStrokeDasharrayCanvas("LongDash"));
			ctx.moveTo(x1, y);
			ctx.lineTo(rect.x, y);

			ctx.moveTo(rect.x + rect.width, y);
			ctx.lineTo(x2, y);
			ctx.stroke();

			ctx.setLineDash([]);
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

			ctx.fillStyle = textFill;
			ctx.textBaseline = "middle";
			ctx.textAlign = "start";
			ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
			ctx.beginPath();
			ctx.fillText("Alert", rect.x + 10, y);
		} else {
			ctx.setLineDash(getStrokeDasharrayCanvas("ShortDash"));
			ctx.moveTo(x1, y);
			ctx.lineTo(x2, y);
			ctx.stroke();
		}
	}
	renderSVG() {
		throw new Error("svg not implemented");
	}
	render() {
		const { selected, interactiveCursorClass } = this.props;
		const { onHover, onUnHover } = this.props;
		const { onDragStart, onDrag, onDragComplete } = this.props;

		return (
			<GenericChartComponent
				isHover={this.isHover}

				svgDraw={this.renderSVG}
				canvasToDraw={getMouseCanvas}
				canvasDraw={this.drawOnCanvas}

				interactiveCursorClass={interactiveCursorClass}
				selected={selected}
				enableDragOnHover

				onDragStart={onDragStart}
				onDrag={onDrag}
				onDragComplete={onDragComplete}
				onHover={onHover}
				onUnHover={onUnHover}

				drawOn={["mousemove", "mouseleave", "pan", "drag"]}
			/>
		);
	}
}

function helper(props, moreProps) {
	const { yValue } = props;

	const { chartConfig: { width, yScale } } = moreProps;

	const y = Math.round(yScale(yValue));
	const height = 24;
	const rect = {
		x: 20,
		y: y - height / 2,
		width: 80,
		height,
	};
	return {
		x1: 0,
		x2: width,
		y,
		rect,
	};
}

InteractivePriceCoordinate.propTypes = {
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
	hovering: PropTypes.bool.isRequired,
};

InteractivePriceCoordinate.defaultProps = {
	onDragStart: noop,
	onDrag: noop,
	onDragComplete: noop,

	type: "SD", // standard dev
	fontWeight: "normal", // standard dev

	strokeWidth: 1,
	tolerance: 4,
	selected: false,
	hovering: false,
};

export default InteractivePriceCoordinate;