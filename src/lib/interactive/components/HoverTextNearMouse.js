import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";
import { isDefined, hexToRGBA } from "../../utils";

const PADDING = 10;

class HoverTextNearMouse extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const {
			fontFamily,
			fontSize,
			fill,
			bgFill,
			bgOpacity,
		} = this.props;

		// console.log(moreProps)
		const textMetaData = helper(this.props, moreProps);

		if (isDefined(textMetaData)) {
			const { rect, text } = textMetaData;

			ctx.strokeStyle = bgFill;
			ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);
			ctx.beginPath();
			ctx.rect(rect.x, rect.y, rect.width, rect.height);
			ctx.fill();
			ctx.stroke();

			ctx.font = `${ fontSize }px ${fontFamily}`;
			ctx.fillStyle = fill;
			ctx.beginPath();

			ctx.fillText(text.text, text.x, text.y);
		}
	}
	renderSVG(moreProps) {
		const {
			fontFamily,
			fontSize,
			fill,
			bgFill,
			bgOpacity,
		} = this.props;

		// console.log(moreProps)
		const textMetaData = helper(this.props, moreProps);

		if (isDefined(textMetaData)) {
			const { rect, text } = textMetaData;

			return (
				<g>
					<rect
						fill={bgFill}
						fillOpacity={bgOpacity}
						stroke={bgFill}
						{...rect}
					/>
					<text
						fontSize={fontSize}
						fontFamily={fontFamily}
						textAnchor="start"
						fill={fill}
						x={text.x}
						y={text.y}>{text.text}</text>
				</g>
			);
		}
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
	text: PropTypes.string.isRequired,
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	bgWidth: PropTypes.number.isRequired,
	bgHeight: PropTypes.number.isRequired,
	show: PropTypes.bool.isRequired,
};

HoverTextNearMouse.defaultProps = {
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fill: "#000000",
	bgFill: "#FA9325",
	bgOpacity: 0.5,
};

function helper(props, moreProps) {
	const {
		show,
		fontSize,
		bgWidth,
		bgHeight,
	} = props;

	const { mouseXY, height, width, show: mouseInsideCanvas } = moreProps;

	if (show && mouseInsideCanvas) {
		const [x, y] = mouseXY;

		const cx = x < width / 2
			? x + PADDING
			: x - bgWidth - PADDING;
		const cy = y < height / 2
			? y + PADDING
			: y - bgHeight - PADDING;

		const rect = {
			x: cx,
			y: cy,
			width: bgWidth,
			height: bgHeight,
		};
		const text = {
			text: props.text,
			x: cx + PADDING / 2,
			y: cy + fontSize
		};

		return {
			rect,
			text
		};
	}
}

export default HoverTextNearMouse;
