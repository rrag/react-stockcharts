import React, { PropTypes, Component } from "react";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";

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
		var { mouseXY, xScale, chartConfig: { yScale } } = moreProps;
		var { cx, cy, r } = this.props;
		var x = xScale(cx);
		var y = yScale(cy);

		var [mx, my] = mouseXY;
		const hover = (x - r) < mx && mx < (x + r)
			&& (y - r) < my && my < (y + r);

		// console.log("hover->", hover);
		return hover;
	}
	drawOnCanvas(ctx, moreProps) {
		var { stroke, strokeWidth, fill, opacity } = this.props;
		var { r } = this.props;

		const [x, y] = helper(this.props, moreProps);

		ctx.lineWidth = strokeWidth;
		ctx.fillStyle = hexToRGBA(fill, opacity);
		ctx.strokeStyle = stroke;

		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.fill();

	}
	renderSVG(moreProps) {
		var { stroke, strokeWidth, fill, opacity } = this.props;
		var { r } = this.props;

		const [x, y] = helper(this.props, moreProps);

		return <circle cx={x} cy={y} r={r}
			strokeWidth={strokeWidth}
			stroke={stroke}
			fill={fill}
			opacity={opacity}
			/>;
	}
	render() {
		var { show, onDrag, onDragComplete } = this.props;

		return show
			? <GenericChartComponent ref={this.saveNode}
				selected
				onDrag={onDrag}
				onDragComplete={onDragComplete}
				canvasToDraw={getAxisCanvas}
				svgDraw={this.renderSVG}
				canvasDraw={this.drawOnCanvas}
				isHover={this.isHover}
				drawOnPan
				/>
			: null;
	}
}

function helper(props, moreProps) {
	var { cx, cy } = props;

	var { xScale, chartConfig: { yScale } } = moreProps;

	var x = xScale(cx);
	var y = yScale(cy);

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
