import React, { PropTypes, Component } from "react";

import GenericChartComponent from "../GenericChartComponent";
import { getInteractiveCanvas } from "../GenericComponent";

import { noop, hexToRGBA } from "../utils";

class ClickableCircle extends Component {
	constructor(props) {
		super(props);
		this.saveNode = this.saveNode.bind(this);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	saveNode(node) {
		this.node = node;
	}
	isHover(moreProps) {
		const { mouseXY, xScale, chartConfig: { yScale } } = moreProps;
		const { cx, cy, r } = this.props;
		const x = xScale(cx);
		const y = yScale(cy);

		const [mx, my] = mouseXY;
		const hover = (x - r) < mx && mx < (x + r)
			&& (y - r) < my && my < (y + r);

		// console.log("hover->", hover);
		return hover;
	}
	drawOnCanvas(ctx, moreProps) {
		const { stroke, strokeWidth, fill, opacity } = this.props;
		const { r } = this.props;

		const [x, y] = helper(this.props, moreProps);

		ctx.lineWidth = strokeWidth;
		ctx.fillStyle = hexToRGBA(fill, opacity);
		ctx.strokeStyle = stroke;

		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();

	}
	renderSVG(moreProps) {
		const { stroke, strokeWidth, fill, opacity } = this.props;
		const { r } = this.props;

		const [x, y] = helper(this.props, moreProps);

		return <circle cx={x} cy={y} r={r}
			strokeWidth={strokeWidth}
			stroke={stroke}
			fill={fill}
			opacity={opacity}
			/>;
	}
	render() {
		const { interactiveCursorClass } = this.props;
		const { show, onDrag, onDragComplete } = this.props;

		return show
			? <GenericChartComponent ref={this.saveNode}
				interactiveCursorClass={interactiveCursorClass}
				selected
				isHover={this.isHover}

				onDrag={onDrag}
				onDragComplete={onDragComplete}

				svgDraw={this.renderSVG}

				canvasDraw={this.drawOnCanvas}
				canvasToDraw={getInteractiveCanvas}

				drawOn={["pan", "mousemove", "drag"]}
				/>
			: null;
	}
}

function helper(props, moreProps) {
	const { cx, cy } = props;

	const { xScale, chartConfig: { yScale } } = moreProps;

	const x = xScale(cx);
	const y = yScale(cy);

	return [x, y];
}
ClickableCircle.propTypes = {
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	stroke: PropTypes.string.isRequired,
	fill: PropTypes.string.isRequired,
	r: PropTypes.number.isRequired,
	cx: PropTypes.number.isRequired,
	cy: PropTypes.number.isRequired,
	className: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired,
	opacity: PropTypes.number.isRequired,
	interactiveCursorClass: PropTypes.string,
};


ClickableCircle.defaultProps = {
	className: "react-stockcharts-interactive-line-edge",
	onDrag: noop,
	onDragComplete: noop,
	onMove: noop,
	show: false,
	opacity: 1,
};

export default ClickableCircle;
