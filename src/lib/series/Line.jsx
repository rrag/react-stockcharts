"use strict";

import React from "react";
import d3 from "d3";

class Line extends React.Component {
	constructor(props) {
		super(props);
		this.getPath = this.getPath.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.props.type !== "svg") this.drawOnCanvas();
	}
	drawOnCanvas() {
		var { canvasContext: ctx } = this.context;
		var { data, xScale, yScale, xAccessor, yAccessor, stroke } = this.props;

		var path = this.getPath();
		ctx.beginPath();

		var { strokeStyle } = ctx;
		// console.log(stroke);
		ctx.strokeStyle = stroke;
		var begin = true;
		data.forEach((d) => {
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
		ctx.strokeStyle = strokeStyle;
	}

	getPath() {
		var { data, xScale, yScale, xAccessor, yAccessor } = this.props;

		var dataSeries = d3.svg.line()
			.defined((d) =>(yAccessor(d) !== undefined))
			.x((d) => xScale(xAccessor(d)))
			.y((d) => yScale(yAccessor(d)));
		return dataSeries(data);
	}
	render() {
		var { type, stroke, fill, className } = this.props;
		if (type !== "svg") return null;

		className = className.concat((stroke) ? "" : " line-stroke");
		return (
			<path d={this.getPath()} stroke={stroke} fill={fill} className={className}/>
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
	type: React.PropTypes.string.isRequired,
};
Line.defaultProps = {
	className: "line ",
	fill: "none",
	stroke: "black"
};
Line.contextTypes = {
	canvasContext: React.PropTypes.object,
};

module.exports = Line;
