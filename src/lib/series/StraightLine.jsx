"use strict";

import React from "react";

class StraightLine extends React.Component {
	constructor(props) {
		super(props);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.context.type !== "svg" && this.context.canvasContext !== undefined) this.drawOnCanvas();
	}
	drawOnCanvas() {
		var { canvasContext: ctx } = this.context;
		var { type, stroke, fill, className, opacity } = this.props;
		var { x1, y1, x2, y2 } = this.props;

		ctx.beginPath();

		var { fillStyle, strokeStyle, globalAlpha } = ctx;

		ctx.strokeStyle = stroke;
		ctx.globalAlpha = opacity;

		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		ctx.fillStyle = fillStyle;
		ctx.strokeStyle = strokeStyle;
		ctx.globalAlpha = globalAlpha;
	}
	render() {
		var { type, stroke, fill, className, opacity } = this.props;
		var { x1, y1, x2, y2 } = this.props;
		if (type !== "svg") return null;

		return (
			<line className={className}
				stroke={stroke} opacity={opacity}
				x1={x1} y1={y1}
				x2={x2} y2={y2} />
		);
	}
}

StraightLine.propTypes = {
	className: React.PropTypes.string,
	x1: React.PropTypes.number.isRequired,
	y1: React.PropTypes.number.isRequired,
	x2: React.PropTypes.number.isRequired,
	y2: React.PropTypes.number.isRequired,
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string,
	type: React.PropTypes.string.isRequired,
	opacity: React.PropTypes.number.isRequired,
};
StraightLine.defaultProps = {
	className: "line ",
	fill: "none",
	stroke: "black",
	opacity: 0.5,
};
StraightLine.contextTypes = {
	canvasContext: React.PropTypes.object,
};

module.exports = StraightLine;
