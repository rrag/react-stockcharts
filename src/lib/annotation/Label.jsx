"use strict";

import React, { PropTypes, Component } from "react";

import wrap from "../series/wrap";
import { isDefined, hexToRGBA } from "../utils";

class Label extends Component {
	render() {
		var { className, textAnchor, fontFamily, fontSize, opacity, rotate } = this.props;
		var { x, y, xAccessor, xScale, yScale, datum } = this.props;

		var { xPos, yPos, fill, text } = helper(this.props, xAccessor, xScale, yScale)

		return <text className={className}
					x={xPos} y={yPos}
					fontFamily={fontFamily} fontSize={fontSize}
					fill={fill}
					opacity={opacity}
					transform={`rotate(${rotate}, ${xPos}, ${yPos})`}
					textAnchor={textAnchor}>{text}</text>
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
	}
}

Label.propTypes = {
	className: PropTypes.string,
	text: PropTypes.string,
};

/*
Label.contextTypes = {
	xScale: PropTypes.func,
	chartConfig: PropTypes.object,
	chartCanvasType: PropTypes.string,
	getCanvasContexts: PropTypes.func,
};
*/
Label.defaultProps = {
	textAnchor: "middle",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fill: "#000000",
	opacity: 1,
	rotate: 0,
	x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)),
};

Label.drawOnCanvas = (props, ctx, xScale, yScale) => {

	var { text, fill, textAnchor, fontFamily, fontSize, opacity, datum, xAccessor } = props;

	var { xPos, yPos, fill, text } = helper(props, xAccessor, xScale, yScale)

	ctx.font = `${ fontSize }px ${ fontFamily }`;
	ctx.fillStyle = hexToRGBA(fill, opacity);;
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	ctx.beginPath();
	ctx.fillText(text, xPos, yPos);
}

export default Label;