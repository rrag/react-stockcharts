import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

import { isDefined, noop, hexToRGBA } from "../../utils";

class LabelArrow extends Component {
	constructor(props) {
		super(props);

		this.calculateTextWidth = true;

		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		const { onHover, type } = this.props;

		if (isDefined(onHover)) {
			const { rect } = helper(this.props, moreProps, type);
			const {
				mouseXY: [x, y],
			} = moreProps;
			if (
				x >= rect.x &&
                y >= rect.y &&
                x <= rect.x + rect.width &&
                y <= rect.y + rect.height
			) {
				return true;
			}
		}
		return false;
	}
	drawOnCanvas(ctx, moreProps) {
		// const {
		//     bgFill,
		//     bgOpacity,
		//     bgStrokeWidth,
		//     bgStroke,
		//     textFill,
		//     fontFamily,
		//     fontSize,
		//     fontStyle,
		//     fontWeight,
		//     text,
		// } = this.props;
		// if (this.calculateTextWidth) {
		//     ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
		//     const { width } = ctx.measureText(text);
		//     this.textWidth = width;
		//     this.calculateTextWidth = false;
		// }
		// const { selected } = this.props;
		// const { x, y, rect } = helper(this.props, moreProps, this.textWidth);
		// ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);
		// ctx.beginPath();
		// ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		// if (selected) {
		//     ctx.strokeStyle = bgStroke;
		//     ctx.lineWidth = bgStrokeWidth;
		//     ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
		// }
		// ctx.fillStyle = textFill;
		// ctx.textBaseline = "middle";
		// ctx.textAlign = "center";
		// ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
		// ctx.beginPath();
		// ctx.fillText(text, x, y);
	}
	renderSVG(moreProps) {
		const { id, type, fill } = this.props;
		const { x, y } = helper(this.props, moreProps, this.textWidth);

		const position =
            type === "OPEN"
            	? `M ${x} ${y + 50} ${x},${y}`
            	: `M ${x} ${y - 50} ${x},${y}`;
		return (
			<g>
				<defs>
					<marker
						id={`red-arrowhead-${id}`}
						viewBox="0 0 10 10"
						refX="7"
						refY="5"
						markerUnits="strokeWidth"
						markerWidth="4"
						markerHeight="3"
						orient="auto"
					>
						<path
							d="M 0 0 L 10 5 L 0 10 z"
							stroke="none"
							fill={fill}
						></path>
					</marker>
				</defs>

				<path
					d={position} // DOWN
					stroke={fill}
					strokeWidth="8"
					fill={fill}
					markerEnd={`url(#red-arrowhead-${id})`}
				></path>
			</g>
		);
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
				interactiveCursorClass={interactiveCursorClass}
				selected={selected}
				onDragStart={onDragStart}
				onDrag={onDrag}
				onDragComplete={onDragComplete}
				onHover={onHover}
				onUnHover={onUnHover}
				drawOn={["mousemove", "pan", "drag"]}
			/>
		);
	}
}

function helper(props, moreProps, type) {
	const { position, width } = props;

	const {
		xScale,
		chartConfig: { yScale },
	} = moreProps;

	const [xValue, yValue] = position;
	const x = xScale(xValue);
	const y = yScale(yValue);

	let rect = {};

	switch (type) {
		case "OPEN": {
			rect = {
				x: x - width / 2,
				y: y,
				width: width,
				height: 50,
			};
			break;
		}
		case "CLOSE": {
			rect = {
				x: x - width / 2,
				y: y - 50,
				width: width,
				height: 50,
			};
			break;
		}
	}

	return {
		x,
		y,
		rect,
	};
}

LabelArrow.propTypes = {
	onDragStart: PropTypes.func.isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,

	defaultClassName: PropTypes.string,
	interactiveCursorClass: PropTypes.string,

	selected: PropTypes.bool.isRequired,
	type: PropTypes.oneOf(["OPEN", "CLOSE"]).isRequired,
};

LabelArrow.defaultProps = {
	onDragStart: noop,
	onDrag: noop,
	onDragComplete: noop,
	type: "OPEN",

	width: 40,
	fontWeight: "normal", // standard dev

	selected: false,
};

export default LabelArrow;
