"use strict";

import React, { PropTypes, Component } from "react";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";
import { first, last, hexToRGBA } from "../utils";

class SARSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		var { mouseXY, currentItem, chartConfig: { yScale } } = moreProps;
		var { yAccessor } = this.props;
		var y = mouseXY[1];
		var currentY = yScale(yAccessor(currentItem));
		return y <  currentY + 5 && y > currentY - 5;
	}
	drawOnCanvas(ctx, moreProps) {
		var { yAccessor, fill, opacity } = this.props;
		var { xAccessor, plotData, xScale, chartConfig: { yScale }, hovering } = moreProps;

		var width = xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData)));

		var d = (width / plotData.length) * 0.5 / 2;
		var rx = Math.max(0.5,  d / 2) + (hovering ? 2 : 0);
		var ry = Math.min(2, Math.max(0.5,  d)) + (hovering ? 0 : 0);

		plotData.forEach(each => {
			var centerX = xScale(xAccessor(each));
			var centerY = yScale(yAccessor(each));
			var color = yAccessor(each) > each.close
				? fill.falling
				: fill.rising;

			ctx.fillStyle = hexToRGBA(color, opacity);
			ctx.strokeStyle = color;

			ctx.beginPath();
			ctx.ellipse(centerX, centerY, rx, ry, 0, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		});
	}
	renderSVG(moreProps) {
		var { className, yAccessor } = this.props;
		var { xAccessor, plotData, xScale, chartConfig: { yScale } } = moreProps;
		// console.log(moreProps);

		return <g className={className}>
			{plotData.map((each, idx) => {
				return <circle key={idx} cx={xScale(xAccessor(each))}
					cy={yScale(yAccessor(each))} r={3} fill="green" />;
			})}
		</g>;
	}

	render() {
		var { highlightOnHover } = this.props;
		var hoverProps = highlightOnHover
			? { isHover: this.isHover }
			: {};

		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			{...hoverProps}
			onClick={this.props.onClick}
			onDoubleClick={this.props.onDoubleClick}
			onContextMenu={this.props.onContextMenu}
			drawOnPan
			/>;
	}
}

SARSeries.propTypes = {
	className: PropTypes.string,
	fill: PropTypes.object.isRequired,
	yAccessor: PropTypes.func.isRequired,
	opacity: PropTypes.number.isRequired,
	onClick: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onContextMenu: PropTypes.func,
	highlightOnHover: PropTypes.bool,
};

SARSeries.defaultProps = {
	className: "react-stockcharts-sar",
	fill: {
		falling: "#4682B4",
		rising: "#15EC2E",
	},
	highlightOnHover: true,
	opacity: 0.2,
	onClick: function(e) { console.log("Click", e); },
	onDoubleClick: function(e) { console.log("Double Click", e); },
	onContextMenu: function(e) { console.log("Right Click", e); },
};

export default SARSeries;
