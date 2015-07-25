"use strict";

import React from "react";
import d3 from "d3";

class AreaSeries extends React.Component {
	constructor(props) {
		super(props);
		this.getPath = this.getPath.bind(this);
		this.getArea = this.getArea.bind(this);
	}
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.context.type !== "svg") this.drawOnCanvas();
	}
	drawOnCanvas() {
		var { canvasContext: ctx, plotData, xScale, yScale, xAccessor, yAccessor } = this.context;
		var height = yScale.range()[0];
		var path = this.getPath();
		var begin = true;

		plotData.forEach((d) => {
			if (yAccessor(d) === undefined) {
				ctx.stroke();
				ctx.beginPath();
				begin = true;
			} else {
				if (begin) {
					ctx.beginPath();
					begin = false;
					let [x, y] = [xScale(xAccessor(d)), yScale(yAccessor(d))];
					ctx.moveTo(x, y);
				}
				ctx.lineTo(xScale(xAccessor(d)), yScale(yAccessor(d)));
			}
		});
		ctx.stroke();

		begin = true;
		plotData.forEach((d) => {
			if (yAccessor(d) === undefined) {
				ctx.stroke();
				ctx.beginPath();
				begin = true;
			} else {
				if (begin) {
					ctx.beginPath();
					begin = false;
					let [x, y] = [xScale(xAccessor(d)), yScale(yAccessor(d))];
					ctx.moveTo(x, height);
					ctx.lineTo(x, y);
				}
				ctx.lineTo(xScale(xAccessor(d)), yScale(yAccessor(d)));
			}
		});

		var last = plotData[plotData.length - 1];
		ctx.lineTo(xScale(xAccessor(last)), height);
		ctx.fill();
	}
	getPath() {
		var dataSeries = d3.svg.line()
			.defined((d) => this.context.yAccessor(d) !== undefined)
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(this.context.yAccessor(d)));

		return dataSeries(this.context.plotData);
	}
	getArea() {
		var height = this.context.yScale.range()[0];
		var areaSeries = d3.svg.area()
			.defined((d) => this.context.yAccessor(d) !== undefined)
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y0(height - 1)
			.y1((d) => this.context.yScale(this.context.yAccessor(d)));

		return areaSeries(this.context.plotData);
	}
	render() {
		if (this.context.type !== "svg") return null;
		return (
			<g>
				<path d={this.getPath()} className="line line-stroke" />
				<path d={this.getArea()} className="area" />
			</g>
		);
	}
}

AreaSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	canvasContext: React.PropTypes.object,
	type: React.PropTypes.string,
};

AreaSeries.defaultProps = { namespace: "ReStock.AreaSeries" };

module.exports = AreaSeries;
