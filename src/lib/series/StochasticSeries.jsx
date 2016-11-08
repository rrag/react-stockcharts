"use strict";

import React, { PropTypes, Component } from "react";

import LineSeries from "./LineSeries";
import StraightLine from "./StraightLine";

class StochasticSeries extends Component {
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
		var { className, calculator, stroke, type } = this.props;
		var seriesStroke = calculator.stroke();
		return (
			<g className={className}>
				<LineSeries yAccessor={this.yAccessorForD}
					stroke={seriesStroke.D} fill="none"
					type={type} />
				<LineSeries yAccessor={this.yAccessorForK}
					stroke={seriesStroke.K} fill="none"
					type={type} />
				{getHorizontalLine(this.props, calculator.overSold(), stroke.top)}
				{getHorizontalLine(this.props, calculator.middle(), stroke.middle)}
				{getHorizontalLine(this.props, calculator.overBought(), stroke.bottom)}
			</g>
		);
	}
}

function getHorizontalLine(props, yValue, stroke) {

	/* eslint-disable react/prop-types */
	var { yAccessor } = props;
	/* eslint-enable react/prop-types */

	return <StraightLine
		stroke={stroke} opacity={0.3}
		yAccessor={yAccessor}
		yValue={yValue} />;
}

StochasticSeries.propTypes = {
	className: PropTypes.string,
	calculator: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]).isRequired,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	xAccessor: PropTypes.func,
	plotData: PropTypes.array,
	stroke: PropTypes.object,
	type: PropTypes.string,
};

StochasticSeries.defaultProps = {
	className: "react-stockcharts-stochastic-series",
	stroke: {
		top: "#964B00",
		middle: "#000000",
		bottom: "#964B00"
	}
};

export default StochasticSeries;
