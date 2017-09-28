"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { functor } from "../utils";

class LabelAnnotation extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e) {
		const { onClick } = this.props;

		if (onClick) {
			const { xScale, yScale, datum } = this.props;
			onClick({ xScale, yScale, datum }, e);
		}
	}
	render() {
		const { className, textAnchor, fontFamily, fontSize, opacity, rotate } = this.props;
		const { xAccessor, xScale, yScale } = this.props;

		const { xPos, yPos, fill, text, tooltip } = helper(this.props, xAccessor, xScale, yScale);

		return (<g className={className}>
			<title>{tooltip}</title>
			<text x={xPos} y={yPos}
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
	const { x, y, datum, fill, text, tooltip, plotData } = props;

	const xFunc = functor(x);
	const yFunc = functor(y);

	const [xPos, yPos] = [xFunc({ xScale, xAccessor, datum, plotData }), yFunc({ yScale, datum, plotData })];

	return {
		xPos,
		yPos,
		text: functor(text)(datum),
		fill: functor(fill)(datum),
		tooltip: functor(tooltip)(datum),
	};
}

LabelAnnotation.propTypes = {
	className: PropTypes.string,
	text: PropTypes.string,
	textAnchor: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	opacity: PropTypes.number,
	rotate: PropTypes.number,
	onClick: PropTypes.func,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	datum: PropTypes.object,
	x: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func
	]),
	y: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func
	])
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

LabelAnnotation.defaultProps = {
	...defaultProps,
	className: "react-stockcharts-labelannotation",
};

export default LabelAnnotation;
