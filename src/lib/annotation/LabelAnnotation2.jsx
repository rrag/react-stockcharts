"use strict";

import React, { PropTypes, Component } from "react";

import wrap from "../series/wrap";
import { isDefined, hexToRGBA } from "../utils";

class LabelAnnotation extends Component {
	render() {
		var { className, textAnchor, fontFamily, fontSize, opacity, rotate } = this.props;
		var { x, y, xAccessor, xScale, yScale, datum } = this.props;

		var { xPos, yPos, fill, text } = helper(this.props, xAccessor, xScale, yScale);

		return <text className={className}
					x={xPos} y={yPos}
					fontFamily={fontFamily} fontSize={fontSize}
					fill={fill}
					opacity={opacity}
					transform={`rotate(${rotate}, ${xPos}, ${yPos})`}
					textAnchor={textAnchor}>{text}</text>;
	}
}

function helper(props, xAccessor, xScale, yScale) {
	var { x, y, datum, fill, text } = props;

	var xFunc = d3.functor(x);
	var yFunc = d3.functor(y);

	var [xPos, yPos] = [xFunc({ xScale, xAccessor, datum }), yFunc({ yScale, datum })];

	return {
		xPos,
		yPos,
		text: d3.functor(text)(datum),
		fill: d3.functor(fill)(datum),
	};
}

LabelAnnotation.propTypes = {
	className: PropTypes.string,
	text: PropTypes.string,
};

/*
LabelAnnotation.contextTypes = {
	xScale: PropTypes.func,
	chartConfig: PropTypes.object,
	chartCanvasType: PropTypes.string,
	getCanvasContexts: PropTypes.func,
};
*/
LabelAnnotation.defaultProps = {
	textAnchor: "middle",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fill: "#000000",
	opacity: 1,
	rotate: 0,
	x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)),
};

export function drawOnCanvas(props, ctx) {
	var { text, fill, textAnchor, fontFamily, fontSize, opacity, datum, xAccessor, xScale, yScale, rotate } = props;

	var { xPos, yPos, fill, text } = helper(props, xAccessor, xScale, yScale);

	var radians = (rotate / 180) * Math.PI;
	ctx.save();
	ctx.translate(xPos, yPos);
	ctx.rotate(radians);

	ctx.font = `${ fontSize }px ${ fontFamily }`;
	ctx.fillStyle = hexToRGBA(fill, opacity);
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	ctx.beginPath();
	ctx.fillText(text, 0, 0);
	ctx.restore();
}

LabelAnnotation.drawOnCanvas = drawOnCanvas;

export default LabelAnnotation;