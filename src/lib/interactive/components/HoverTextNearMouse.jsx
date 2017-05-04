import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";
import { hexToRGBA } from "../../utils";

const PADDING = 10;

class HoverTextNearMouse extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover() {
		return false;
	}
	drawOnCanvas(ctx, moreProps) {
		const {
			show,
			fontFamily,
			fontSize,
			fill,
			bgFill,
			bgOpacity,
			bgWidth,
			bgHeight,
			children,
		} = this.props;

		const { mouseXY, height, width, show: mouseInsideCanvas } = moreProps;
		// console.log(moreProps)

		if (show && mouseInsideCanvas) {
			const [x, y] = mouseXY;

			const cx = x < width / 2
				? x + PADDING
				: x - bgWidth - PADDING;
			const cy = y < height / 2
				? y + PADDING
				: y - bgHeight - PADDING;

			ctx.strokeStyle = bgFill;
			ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);
			ctx.beginPath();
			ctx.rect(cx, cy, bgWidth, bgHeight);
			ctx.fill();
			ctx.stroke();

			ctx.font = `${ fontSize }px ${fontFamily}`;
			ctx.fillStyle = fill;
			ctx.beginPath();

			ctx.fillText(children, cx + PADDING / 2, cy + fontSize);
		}
	}
	renderSVG(moreProps) {
		throw new Error("svg not implemented", moreProps);
	}
	render() {

		return <GenericChartComponent foo

			svgDraw={this.renderSVG}

			canvasToDraw={getMouseCanvas}
			canvasDraw={this.drawOnCanvas}

			drawOn={["mousemove"]}
			/>;
	}
}

HoverTextNearMouse.propTypes = {
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	children: PropTypes.string.isRequired,
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	bgWidth: PropTypes.number.isRequired,
	bgHeight: PropTypes.number.isRequired,
	show: PropTypes.bool.isRequired,
};

HoverTextNearMouse.defaultProps = {
	selected: false,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fill: "#000000",
	bgFill: "#FA9325",
	bgOpacity: 0.5,
};

export default HoverTextNearMouse;
