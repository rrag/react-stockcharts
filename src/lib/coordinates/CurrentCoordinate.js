"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { isNotDefined } from "../utils";
import { getMouseCanvas } from "../GenericComponent";

class CurrentCoordinate extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const circle = helper(this.props, moreProps);
		if (!circle) return null;

		ctx.fillStyle = circle.fill;
		ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
		ctx.fill();
	}
	renderSVG(moreProps) {
		const { className } = this.props;

		const circle = helper(this.props, moreProps);
		if (!circle) return null;

		return (
			<circle className={className} cx={circle.x} cy={circle.y} r={circle.r} fill={circle.fill} />
		);
	}
	render() {
		return <GenericChartComponent
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getMouseCanvas}
			drawOn={["mousemove", "pan"]}
		/>;
	}
}

CurrentCoordinate.propTypes = {
	yAccessor: PropTypes.func,
	r: PropTypes.number.isRequired,
	className: PropTypes.string,
};


CurrentCoordinate.defaultProps = {
	r: 3,
	className: "react-stockcharts-current-coordinate",
};

function helper(props, moreProps) {
	const { fill, yAccessor, r } = props;

	const { show, xScale, chartConfig: { yScale }, currentItem, xAccessor } = moreProps;

	// console.log(show);
	if (!show || isNotDefined(currentItem)) return null;

	const xValue = xAccessor(currentItem);
	const yValue = yAccessor(currentItem);

	if (isNotDefined(yValue)) return null;

	// console.log(chartConfig);
	const x = Math.round(xScale(xValue));
	const y = Math.round(yScale(yValue));

	return { x, y, r, fill };
}

export default CurrentCoordinate;
