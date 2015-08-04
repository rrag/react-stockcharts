"use strict";

import React from "react";

const debugFlag = false;

class PointAndFigureSeries extends React.Component {
	handleClick(idx) {
		console.log(this.context.plotData[idx]);
	}
	render() {
		var width = this.context.xScale(this.context.xAccessor(this.context.plotData[this.context.plotData.length - 1]))
			- this.context.xScale(this.context.xAccessor(this.context.plotData[0]));

		var columnWidth = (width / (this.context.plotData.length - 1));

		var anyBox, j = 0;
		while (anyBox === undefined) {
			if (this.context.plotData[j].close !== undefined) {
				anyBox = this.context.plotData[j].boxes[0];
			}
			j++;
		}

		var boxHeight = Math.abs(this.context.yScale(anyBox.open) - this.context.yScale(anyBox.close));

		var { stroke, fill, strokeWidth } = this.props;
		var columns = this.context.plotData
				.filter((d) => d.close !== undefined)
				.map((d, idx) => {
					var boxes = d.boxes.map((box, i) => {
						var boxshape;
						if (d.direction > 0) {
							boxshape = (
								<g key={idx + "-" + i}>
									<line className="up" strokeWidth={strokeWidth} stroke={stroke.up} fill={fill.up}
										x1={0} y1={this.context.yScale(box.open)} x2={columnWidth} y2={this.context.yScale(box.close)} />
									<line className="up" strokeWidth={strokeWidth} stroke={stroke.up} fill={fill.up}
										x1={0} y1={this.context.yScale(box.close)} x2={columnWidth} y2={this.context.yScale(box.open)} />
								</g>
								);
						} else {
							boxshape = (
								<ellipse key={idx + "-" + i}
									className="down" strokeWidth={strokeWidth} stroke={stroke.down} fill={fill.down}
									cx={columnWidth / 2} cy={this.context.yScale((box.open + box.close) / 2)}
									rx={columnWidth / 2} ry={boxHeight / 2} />
								);
						}
						return boxshape;
					});
					var debug = debugFlag
						? <rect x={0} y={0} height={980} width={columnWidth} style={{ opacity: 0.1 }} onClick={this.handleClick.bind(this, idx)}/>
						: null;
					var col = (<g key={idx} className={this.props.className}
									transform={"translate(" + (this.context.xScale(this.context.xAccessor(d)) - (columnWidth / 2)) + ", 0)"}>
									{boxes}
									{debug}
								</g>);
					return col;
				});

		return (
			<g>
				{columns}
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
