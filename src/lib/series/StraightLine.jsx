"use strict";

import React, { PropTypes, Component } from "react";

import { hexToRGBA } from "../utils";
import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";

class StraightLine extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { stroke, className, opacity, yValue } = this.props;
		var { xAccessor } = this.context;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		var first = xAccessor(plotData[0]);
		var last = xAccessor(plotData[plotData.length - 1]);

		ctx.beginPath();

		ctx.strokeStyle = hexToRGBA(stroke, opacity);

		ctx.moveTo(xScale(first), yScale(yValue));
		ctx.lineTo(xScale(last), yScale(yValue));
		ctx.stroke();
	}
	render() {
		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnPan
			/>;
	}
	renderSVG(moreProps) {
		var { xAccessor } = this.context;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		var { stroke, className, opacity, yValue } = this.props;

		var first = xAccessor(plotData[0]);
		var last = xAccessor(plotData[plotData.length - 1]);

		return (
			<line className={className}
				stroke={stroke} opacity={opacity}
				x1={xScale(first)} y1={yScale(yValue)}
				x2={xScale(last)} y2={yScale(yValue)} />
		);
	}
}

StraightLine.propTypes = {
	className: PropTypes.string,
	stroke: PropTypes.string,
	opacity: PropTypes.number.isRequired,
	yValue: PropTypes.number.isRequired,
};
StraightLine.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
};

StraightLine.defaultProps = {
	className: "line ",
	stroke: "#000000",
	opacity: 0.5,
};

export default StraightLine;
