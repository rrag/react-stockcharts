"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

class SvgPathAnnotation extends Component {
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
		var { className, stroke, opacity } = this.props;
		var { xAccessor, xScale, yScale, path } = this.props;

		var { x, y, fill, tooltip } = helper(this.props, xAccessor, xScale, yScale);

		return (<g className={className} onClick={this.handleClick}>
			<title>{tooltip}</title>
			<path d={path({ x, y })} stroke={stroke} fill={fill} opacity={opacity} />
		</g>);
	}
}

function helper(props, xAccessor, xScale, yScale) {
	var { x, y, datum, fill, tooltip, plotData } = props;

	var xFunc = d3.functor(x);
	var yFunc = d3.functor(y);

	var [xPos, yPos] = [xFunc({ xScale, xAccessor, datum, plotData }), yFunc({ yScale, datum, plotData })];

	return {
		x: xPos,
		y: yPos,
		fill: d3.functor(fill)(datum),
		tooltip: d3.functor(tooltip)(datum),
	};
}

SvgPathAnnotation.propTypes = {
	className: PropTypes.string,
	path: PropTypes.func.isRequired,
	onClick: PropTypes.func,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	datum: PropTypes.object,
	stroke: PropTypes.string,
	fill: PropTypes.string,
	opacity: PropTypes.number,
};

SvgPathAnnotation.defaultProps = {
	className: "react-stockcharts-svgpathannotation",
	opacity: 1,
	x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)),
};

export default SvgPathAnnotation;