

import React, { Component } from "react";
import PropTypes from "prop-types";

import LineSeries from "./LineSeries";
import StraightLine from "./StraightLine";

class StochasticSeries extends Component {
	constructor(props) {
		super(props);
		this.yAccessorForD = this.yAccessorForD.bind(this);
		this.yAccessorForK = this.yAccessorForK.bind(this);
	}
	yAccessorForD(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).D;
	}
	yAccessorForK(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).K;
	}
	render() {
		const { className, stroke, refLineOpacity } = this.props;
		const { overSold, middle, overBought } = this.props;
		return (
			<g className={className}>
				<LineSeries yAccessor={this.yAccessorForD}
					stroke={stroke.dLine}
					fill="none" />
				<LineSeries yAccessor={this.yAccessorForK}
					stroke={stroke.kLine}
					fill="none" />
				<StraightLine
					stroke={stroke.top}
					opacity={refLineOpacity}
					yValue={overSold} />
				<StraightLine
					stroke={stroke.middle}
					opacity={refLineOpacity}
					yValue={middle} />
				<StraightLine
					stroke={stroke.bottom}
					opacity={refLineOpacity}
					yValue={overBought} />
			</g>
		);
	}
}

StochasticSeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.shape({
		top: PropTypes.string.isRequired,
		middle: PropTypes.string.isRequired,
		bottom: PropTypes.string.isRequired,
		dLine: PropTypes.string.isRequired,
		kLine: PropTypes.string.isRequired,
	}).isRequired,
	overSold: PropTypes.number.isRequired,
	middle: PropTypes.number.isRequired,
	overBought: PropTypes.number.isRequired,
	refLineOpacity: PropTypes.number.isRequired,
};

StochasticSeries.defaultProps = {
	className: "react-stockcharts-stochastic-series",
	stroke: {
		top: "#964B00",
		middle: "#000000",
		bottom: "#964B00",
		dLine: "#EA2BFF",
		kLine: "#74D400",
	},
	overSold: 80,
	middle: 50,
	overBought: 20,
	refLineOpacity: 0.3,
};

export default StochasticSeries;
