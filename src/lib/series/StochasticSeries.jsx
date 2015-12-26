"use strict";

import React from "react";

import wrap from "./wrap";

import Line from "./Line";
import StraightLine from "./StraightLine";

class StochasticSeries extends React.Component {
	constructor(props) {
		super(props);
		this.yAccessorForD = this.yAccessorForD.bind(this);
		this.yAccessorForK = this.yAccessorForK.bind(this);
	}
	yAccessorForD(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).D;
	}
	yAccessorForK(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).K;
	}
	render() {
		var { props } = this;
		var { className, indicator, xScale, yScale, xAccessor, plotData, stroke, type } = props;
		var options = indicator.options();

		return (
			<g className={className}>
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForD}
					plotData={plotData}
					stroke={options.stroke.D} fill="none"
					type={type} />
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForK}
					plotData={plotData}
					stroke={options.stroke.K} fill="none"
					type={type} />
				{StochasticSeries.getHorizontalLine(props, options.overSold, stroke.top)}
				{StochasticSeries.getHorizontalLine(props, 50, stroke.middle)}
				{StochasticSeries.getHorizontalLine(props, options.overBought, stroke.bottom)}
			</g>
		);
	}
}

StochasticSeries.getHorizontalLine = (props, yValue, stroke) => {

	/* eslint-disable react/prop-types */
	var { xScale, yScale, xAccessor, yAccessor, plotData, type } = props;
	/* eslint-enable react/prop-types */

	return <StraightLine
		stroke={stroke} opacity={0.3} type={type}
		xScale={xScale} yScale={yScale}
		xAccessor={xAccessor} yAccessor={yAccessor}
		plotData={plotData}
		yValue={yValue} />;
};

StochasticSeries.propTypes = {
	className: React.PropTypes.string,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
	plotData: React.PropTypes.array,
	stroke: React.PropTypes.object,
	type: React.PropTypes.string,
};

StochasticSeries.defaultProps = {
	className: "react-stockcharts-stochastic-series",
	stroke: {
		top: "brown",
		middle: "black",
		bottom: "brown"
	}
};

export default wrap(StochasticSeries);
