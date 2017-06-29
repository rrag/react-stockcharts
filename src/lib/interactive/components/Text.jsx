import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

class Text extends Component {
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
			xyProvider,
			fontFamily,
			fontSize,
			fill,
			children,
		} = this.props;
		const [x, y] = xyProvider(moreProps);

		ctx.font = `${ fontSize }px ${fontFamily}`;
		ctx.fillStyle = fill;

		ctx.beginPath();
		ctx.fillText(children, x, y);
	}
	renderSVG(moreProps) {
		const {
			xyProvider,
			fontFamily,
			fontSize,
			fill,
			children,
		} = this.props;
		const [x, y] = xyProvider(moreProps);

		return <text
			x={x}
			y={y}
			fontFamily={fontFamily}
			fontSize={fontSize}
			fill={fill}>{children}</text>;
	}
	render() {
		const { selected } = this.props;

		return <GenericChartComponent
			selected={selected}

			svgDraw={this.renderSVG}

			canvasToDraw={getMouseCanvas}
			canvasDraw={this.drawOnCanvas}

			drawOn={["mousemove", "pan", "drag"]}
		/>;
	}
}

Text.propTypes = {
	xyProvider: PropTypes.func.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	children: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,
};

Text.defaultProps = {
	selected: false,
};

export default Text;
