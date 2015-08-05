"use strict";

import React from "react";

const debugFlag = false;

class PointAndFigureSeries extends React.Component {
	constructor(props) {
		super(props);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.getColumns = this.getColumns.bind(this);
	}
	componentDidUpdate(prevProps, prevState, prevContext) {
		// if (this.context.type !== "svg") this.drawOnCanvas();
	}
	drawOnCanvas() {
		var ctx = this.context.canvasContext;
		var { fillStyle, strokeStyle } = ctx;

		[].forEach(d => {
			ctx.beginPath();
			ctx.fillStyle = d.fill;
			ctx.strokeStyle = d.stroke;
			ctx.rect(d.x, d.y, d.width, d.height);
			ctx.closePath();
			ctx.fill();
		});

		ctx.fillStyle = fillStyle;
		ctx.strokeStyle = strokeStyle;
	}
	handleClick(idx) {
		console.log(this.context.plotData[idx]);
	}
	getColumns() {
		var { xScale, xAccessor, yScale, yAccessor, plotData } = this.context;
		var width = xScale(xAccessor(plotData[plotData.length - 1]))
			- xScale(xAccessor(plotData[0]));

		var columnWidth = (width / (plotData.length - 1));

		var anyBox, j = 0;
		while (anyBox === undefined) {
			if (plotData[j].close !== undefined) {
				anyBox = plotData[j].boxes[0];
			}
			j++;
		}

		var boxHeight = Math.abs(yScale(anyBox.open) - yScale(anyBox.close));

		var { stroke, fill, strokeWidth, className } = this.props;
		var columns = plotData
				.filter((d) => d.close !== undefined)
				.map((d, idx) => {
					var boxes = d.boxes.map((box, i) => ({
							strokeWidth: strokeWidth,
							className: d.direction > 0 ? "up" : "down",
							stroke:  d.direction > 0 ? stroke.up : stroke.down,
							fill: d.direction > 0 ? fill.up : fill.down,
							columnWidth: columnWidth,
							boxHeight: boxHeight,
							direction: d.direction,
							open: yScale(box.open),
							// y2: yScale(box.close),
						})
					);
					return {
						boxes: boxes,
						direction: d.direction,
						className: className,
						transform: `translate(${ (xScale(xAccessor(d)) - (columnWidth / 2)) }, 0)`,
					}
						/*if (d.direction > 0) {
							boxshape = (
								<g key={idx + "-" + i}>
									<line className="up" strokeWidth={strokeWidth} stroke={stroke.up} fill={fill.up}
										x1={0} y1={yScale(box.open)} x2={columnWidth} y2={yScale(box.close)} />
									<line className="up" strokeWidth={strokeWidth} stroke={stroke.up} fill={fill.up}
										x1={0} y1={yScale(box.close)} x2={columnWidth} y2={yScale(box.open)} />
								</g>
								);
						} else {
							boxshape = (
								<ellipse key={idx + "-" + i}
									className="down" strokeWidth={strokeWidth} stroke={stroke.down} fill={fill.down}
									cx={columnWidth / 2} cy={yScale((box.open + box.close) / 2)}
									rx={columnWidth / 2} ry={boxHeight / 2} />
								);
						}
						return boxshape;
					});

					var col = (<g key={idx} className={className}
									transform={"translate(" + (xScale(xAccessor(d)) - (columnWidth / 2)) + ", 0)"}>
									{boxes}
								</g>);
					return col;*/
				});
		return columns;
	}
	render() {
		// if (this.context.type !== "svg") return null;
		var columns = this.getColumns();
		var { stroke, fill, strokeWidth, className } = this.props;

		return (
			<g>
				{columns.map((col, idx) => (
					<g key={idx} className={col.className} transform={col.transform}>
						{col.boxes.map((box, i) => {
							if (col.direction > 0)
								return (
									<g key={`${ idx }-${ i }`}>
										<line className="up" strokeWidth={strokeWidth} stroke={stroke.up} fill={fill.up}
											x1={0} y1={box.open} x2={box.columnWidth} y2={box.open - box.boxHeight} />
										<line className="up" strokeWidth={strokeWidth} stroke={stroke.up} fill={fill.up}
											x1={0} y1={box.open - box.boxHeight} x2={box.columnWidth} y2={box.open} />
									</g>
								)
							return (
								<ellipse key={`${ idx }-${ i }`}
									className="down" strokeWidth={strokeWidth} stroke={stroke.down} fill={fill.down}
									cx={box.columnWidth / 2} cy={box.open + box.boxHeight / 2}
									rx={box.columnWidth / 2} ry={box.boxHeight / 2} />
							);
						})}
					</g>
				))}
			</g>
		);
	}
}

PointAndFigureSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	canvasContext: React.PropTypes.object,
	type: React.PropTypes.string,
};

PointAndFigureSeries.defaultProps = {
	className: "react-stockcharts-point-and-figure",
	namespace: "ReStock.PointAndFigureSeries",
	strokeWidth: 1,
	stroke: {
		up: "#6BA583",
		down: "red"
	},
	fill: {
		up: "none",
		down: "none"
	},
};

PointAndFigureSeries.yAccessor = (d) => ({open: d.open, high: d.high, low: d.low, close: d.close});

module.exports = PointAndFigureSeries;
