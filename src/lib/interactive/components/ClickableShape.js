import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

import { isHovering2 } from "./StraightLine";
import { hexToRGBA } from "../../utils";

const xHalfLength = 4;

class ClickableShape extends Component {
	constructor(props) {
		super(props);
		this.saveNode = this.saveNode.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	saveNode(node) {
		this.node = node;
	}
	isHover(moreProps) {
		const { mouseXY } = moreProps;
		if (this.closeIcon) {
			const { x, y } = this.closeIcon;

			const start1 = [x - xHalfLength, y - xHalfLength];
			const end1 = [x + xHalfLength, y + xHalfLength];
			const start2 = [x - xHalfLength, y + xHalfLength];
			const end2 = [x + xHalfLength, y - xHalfLength];

			if (isHovering2(start1, end1, mouseXY, 3) || isHovering2(start2, end2, mouseXY, 3)) {
				return true;
			}
		}
		return false;
	}
	drawOnCanvas(ctx, moreProps) {
		const { stroke, strokeWidth, strokeOpacity, hovering } = this.props;

		const [x, y] = helper(this.props, moreProps, ctx);

		this.closeIcon = { x, y };
		ctx.beginPath();

		ctx.lineWidth = hovering ? strokeWidth + 1 : strokeWidth;
		ctx.strokeStyle = hexToRGBA(stroke, strokeOpacity);

		ctx.moveTo(x - xHalfLength, y - xHalfLength);
		ctx.lineTo(x + xHalfLength, y + xHalfLength);
		ctx.moveTo(x - xHalfLength, y + xHalfLength);
		ctx.lineTo(x + xHalfLength, y - xHalfLength);
		ctx.stroke();
	}
	renderSVG() {
		throw new Error("svg not implemented");
	}
	render() {
		const { interactiveCursorClass } = this.props;
		const { show } = this.props;
		const { onHover, onUnHover, onClick } = this.props;

		return show
			? <GenericChartComponent ref={this.saveNode}
				interactiveCursorClass={interactiveCursorClass}
				isHover={this.isHover}

				onClickWhenHover={onClick}

				svgDraw={this.renderSVG}

				canvasDraw={this.drawOnCanvas}
				canvasToDraw={getMouseCanvas}

				onHover={onHover}
				onUnHover={onUnHover}

				drawOn={["pan", "mousemove", "drag"]}
			/>
			: null;
	}
}

function helper(props, moreProps, ctx) {
	const { yValue, text } = props;
	const { fontFamily, fontStyle, fontWeight, fontSize } = props;
	ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

	const { chartConfig: { yScale } } = moreProps;

	const x = 20 + 10 + ctx.measureText(text).width + 10 + 7;
	//        ^ x of rect                              ^ right padding
	//              ^ left padding in rect                  ^center of x

	const y = yScale(yValue);

	return [x, y];

}

ClickableShape.propTypes = {
	stroke: PropTypes.string.isRequired,
	strokeOpacity: PropTypes.number.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	hovering: PropTypes.bool,
	interactiveCursorClass: PropTypes.string,
	show: PropTypes.bool,
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,
	onClick: PropTypes.func,
};


ClickableShape.defaultProps = {
	show: false,
	fillOpacity: 1,
	strokeOpacity: 1,
	strokeWidth: 1,
};

export default ClickableShape;
