"use strict";

import React from "react";
import d3 from "d3";

class Line extends React.Component {
	constructor(props) {
		super(props);
		this.getArea = this.getArea.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.props.type !== "svg") this.drawOnCanvas();
	}
	drawOnCanvas() {
		var { canvasContext: ctx } = this.context;
		var { data, xScale, yScale, xAccessor, yAccessor, fill, stroke, opacity } = this.props;
		var begin = true;
		var height = yScale.range()[0];

		var { strokeStyle, fillStyle } = ctx;

		ctx.fillStyle = fill;
		ctx.strokeStyle = stroke;
		ctx.globalAlpha = opacity;

		data.forEach((d) => {
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

		var last = data[data.length - 1];
		ctx.lineTo(xScale(xAccessor(last)), height);
		ctx.fill();
		ctx.fillStyle = fillStyle;
		ctx.strokeStyle = strokeStyle;
	}

	getArea() {
		var { data, xScale, yScale, xAccessor, yAccessor } = this.props;
		var height = yScale.range()[0];

		var areaSeries = d3.svg.area()
			.defined((d) => yAccessor(d) !== undefined)
			.x((d) => xScale(xAccessor(d)))
			.y0(height - 1)
			.y1((d) => yScale(yAccessor(d)));

		return areaSeries(data);
	}
	render() {
		var { type, stroke, fill, className, opacity } = this.props;
		if (type !== "svg") return null;

		className = className.concat((stroke !== undefined) ? "" : " line-stroke");
		return (
			<path d={this.getArea()} stroke={stroke} fill={fill} className={className} opacity={opacity} />
		);
	}
}

Line.propTypes = {
	className: React.PropTypes.string,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	data: React.PropTypes.array.isRequired,
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string,
	opacity: React.PropTypes.number,
	type: React.PropTypes.string.isRequired,
};
Line.defaultProps = {
	className: "line ",
	fill: "none",
	opacity: 1,
};
Line.contextTypes = {
	canvasContext: React.PropTypes.object,
};

module.exports = Line;
