"use strict";

import React, { PropTypes, Component } from "react";

import wrap from "../series/wrap";
import { isDefined, hexToRGBA } from "../utils";

class LabelAnnotation extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e) {
		var { onClick } = this.props;

		if (onClick) {
			var { xScale, yScale, datum } = this.props;
			onClick({ xScale, yScale, datum }, e);
		}
	}
	render() {
		var { className, textAnchor, fontFamily, fontSize, opacity, rotate } = this.props;
		var { x, y, xAccessor, xScale, yScale, datum } = this.props;

		var { xPos, yPos, fill, text, tooltip } = helper(this.props, xAccessor, xScale, yScale);

		return (<g>
			<title>{tooltip}</title>
			<text className={className}
					x={xPos} y={yPos}
					fontFamily={fontFamily} fontSize={fontSize}
					fill={fill}
					opacity={opacity}
					transform={`rotate(${rotate}, ${xPos}, ${yPos})`}
					onClick={this.handleClick}
					textAnchor={textAnchor}>{text}</text>
		</g>);
	}
}

export function helper(props, xAccessor, xScale, yScale) {
	var { x, y, datum, fill, text, tooltip, plotData } = props;

	var xFunc = d3.functor(x);
	var yFunc = d3.functor(y);

	var [xPos, yPos] = [xFunc({ xScale, xAccessor, datum, plotData }), yFunc({ yScale, datum, plotData })];

	return {
		xPos,
		yPos,
		text: d3.functor(text)(datum),
		fill: d3.functor(fill)(datum),
		tooltip: d3.functor(tooltip)(datum),
	};
}

LabelAnnotation.propTypes = {
	className: PropTypes.string,
	text: PropTypes.string,
};

export const defaultProps = {
	textAnchor: "middle",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fill: "#000000",
	opacity: 1,
	rotate: 0,
	x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)),
};

LabelAnnotation.defaultProps = defaultProps;

export default LabelAnnotation;