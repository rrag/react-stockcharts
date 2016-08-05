"use strict";

import React, { PropTypes, Component } from "react";
import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";

import { isDefined, isNotDefined } from "../utils";

class PointAndFigureSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var { xAccessor } = this.context;
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;

		var columns = getColumns(xScale, xAccessor, yScale, plotData);

		drawOnCanvas(ctx, this.props, columns);
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

		var { stroke, fill, strokeWidth, className } = this.props;

		var columns = getColumns(xScale, xAccessor, yScale, plotData);

		return (
			<g className={className}>
				{columns.map((col, idx) => (
					<g key={idx} className={col.className} transform={`translate(${ col.offset[0] }, ${ col.offset[1] })`}>
						{col.boxes.map((box, i) => {
							if (col.direction > 0) {
								return (
									<g key={`${ idx }-${ i }`}>
										<line className="up" strokeWidth={strokeWidth} stroke={stroke.up} fill={fill.up}
											x1={0} y1={box.open} x2={box.columnWidth} y2={box.close} />
										<line className="up" strokeWidth={strokeWidth} stroke={stroke.up} fill={fill.up}
											x1={0} y1={box.close} x2={box.columnWidth} y2={box.open} />
									</g>
								);
							}
							return (
								<ellipse key={`${ idx }-${ i }`}
									className="down" strokeWidth={strokeWidth} stroke={stroke.down} fill={fill.down}
									cx={box.columnWidth / 2} cy={(box.open + box.close) / 2}
									rx={box.columnWidth / 2} ry={box.boxHeight / 2} />
							);
						})}
					</g>
				))}
			</g>
		);
	}
}

PointAndFigureSeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	stroke: PropTypes.object.isRequired,
	fill: PropTypes.object.isRequired,
};

PointAndFigureSeries.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
};

PointAndFigureSeries.defaultProps = {
	className: "react-stockcharts-point-and-figure",
	strokeWidth: 1,
	stroke: {
		up: "#6BA583",
		down: "#FF0000"
	},
	fill: {
		up: "none",
		down: "none"
	},
};

function drawOnCanvas(ctx, props, columns) {
	var { stroke, fill, strokeWidth } = props;

	ctx.lineWidth = strokeWidth;

	columns.forEach(col => {
		let [offsetX, offsetY] = col.offset;
		col.boxes.forEach(box => {
			if (col.direction > 0) {
				ctx.fillStyle = fill.up;
				ctx.strokeStyle = stroke.up;

				ctx.beginPath();

				ctx.moveTo(offsetX, offsetY + box.open);
				ctx.lineTo(offsetX + box.columnWidth, offsetY + box.close);
				ctx.moveTo(offsetX, offsetY + box.close);
				ctx.lineTo(offsetX + box.columnWidth, offsetY + box.open);

				ctx.stroke();
			} else {
				ctx.fillStyle = fill.down;
				ctx.strokeStyle = stroke.down;

				ctx.beginPath();

				let [x, y] = [offsetX + box.columnWidth / 2, offsetY + box.open + box.boxHeight / 2];
				let [rx, ry] = [box.columnWidth / 2, box.boxHeight / 2];

				ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
				ctx.stroke();
			}
		});
	});

	ctx.stroke();
}

function getColumns(xScale, xAccessor, yScale, plotData) {

	var width = xScale(xAccessor(plotData[plotData.length - 1]))
		- xScale(xAccessor(plotData[0]));

	var columnWidth = (width / (plotData.length - 1));

	var anyBox, j = 0;
	while (isNotDefined(anyBox)) {
		if (isDefined(plotData[j].close)) {
			anyBox = plotData[j].boxes[0];
		}
		j++;
	}

	var boxHeight = Math.abs(yScale(anyBox.open) - yScale(anyBox.close));

	var columns = plotData
			.filter(d => isDefined(d.close))
			.map(d => {
				var boxes = d.boxes.map((box) => ({
					columnWidth: columnWidth,
					boxHeight: boxHeight,
					open: yScale(box.open),
					close: yScale(box.close),
				}));

				var xOffset = (xScale(xAccessor(d)) - (columnWidth / 2));
				return {
					boxes: boxes,
					direction: d.direction,
					offset: [xOffset, 0],
				};
			});
	return columns;
}

export default PointAndFigureSeries;
