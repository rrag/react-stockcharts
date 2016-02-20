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
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).D;
	}
	yAccessorForK(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).K;
	}
	render() {
		var { className, calculator, xScale, yScale, xAccessor, plotData, stroke, type } = this.props;
		var seriesStroke = calculator.stroke();
		return (
			<g className={className}>
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForD}
					plotData={plotData}
					stroke={seriesStroke.D} fill="none"
					type={type} />
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForK}
					plotData={plotData}
					stroke={seriesStroke.K} fill="none"
					type={type} />
				{StochasticSeries.getHorizontalLine(this.props, calculator.overSold(), stroke.top)}
				{StochasticSeries.getHorizontalLine(this.props, calculator.middle(), stroke.middle)}
				{StochasticSeries.getHorizontalLine(this.props, calculator.overBought(), stroke.bottom)}
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
	calculator: React.PropTypes.func.isRequired,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	xAccessor: React.PropTypes.func,
	plotData: React.PropTypes.array,
	stroke: React.PropTypes.object,
	type: React.PropTypes.string,
};

StochasticSeries.defaultProps = {
	className: "react-stockcharts-stochastic-series",
	stroke: {
		top: "#964B00",
		middle: "#000000",
		bottom: "#964B00"
	}
};

export default wrap(StochasticSeries);
