"use strict";

import React from "react";
import d3 from "d3";

class LineSeries extends React.Component {
	constructor(props) {
		super(props);
		this.getPath = this.getPath.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.context.type !== "svg") this.drawOnCanvas();
	}
	drawOnCanvas() {
		var { canvasContext: ctx, plotData, xScale, yScale, xAccessor, yAccessor } = this.context;
		var path = this.getPath();
		ctx.beginPath();
		var begin = true;
		plotData.forEach((d) => {
			if (yAccessor(d) === undefined) {
				ctx.stroke();
				ctx.beginPath();
				begin = true;
			} else {
				if (begin) {
					begin = false;
					let [x, y] = [xScale(xAccessor(d)), yScale(yAccessor(d))];
					ctx.moveTo(x, y);
				}
				ctx.lineTo(xScale(xAccessor(d)), yScale(yAccessor(d)));
			}
		});
		ctx.stroke();
		/*
		var wickData = this.getWickData();
		wickData.forEach(d => {
			ctx.beginPath();
			ctx.moveTo(d.x1, d.y1);
			ctx.lineTo(d.x2, d.y2);
			ctx.stroke();
		})
		var candleData = this.getCandleData();
		candleData.forEach(d => {
			if (d.width < 0) {
				// <line className={d.className} key={idx} x1={d.x} y1={d.y} x2={d.x} y2={d.y + d.height}/>
				ctx.beginPath();
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(d.x, d.y + d.height);
				ctx.stroke();
			} else if (d.height === 0) {
				// <line key={idx} x1={d.x} y1={d.y} x2={d.x + d.width} y2={d.y + d.height} />
				ctx.beginPath();
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(d.x + d.width, d.y + d.height);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.rect(d.x, d.y, d.width, d.height);
				ctx.closePath();
				ctx.fill();
			}
		});*/
	}
	getPath() {
		var dataSeries = d3.svg.line()
			.defined((d) =>(this.context.yAccessor(d) !== undefined))
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(this.context.yAccessor(d)));
		return dataSeries(this.context.plotData);
	}
	render() {
		if (this.context.type !== "svg") return null;
		var className = this.props.className.concat((this.context.stroke !== undefined) ? "" : " line-stroke");
		return (
			<path d={this.getPath()} stroke={this.context.stroke} fill="none" className={className}/>
		);
	}
}

LineSeries.propTypes = {
	className: React.PropTypes.string,
};
LineSeries.defaultProps = {
	namespace: "ReStock.LineSeries",
	className: "line "
};
LineSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	stroke: React.PropTypes.string,
	canvasContext: React.PropTypes.object,
	type: React.PropTypes.string,
};

module.exports = LineSeries;
