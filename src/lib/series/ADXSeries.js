

import React, { Component } from "react";
import PropTypes from "prop-types";

import LineSeries from "./LineSeries";
import StraightLine from "./StraightLine";

class ADXSeries extends Component {
	constructor(props) {
		super(props);
		this.yAccessorForPD = this.yAccessorForPD.bind(this);
		this.yAccessorForMD = this.yAccessorForMD.bind(this);
		this.yAccessorForADX = this.yAccessorForADX.bind(this);
	}
	yAccessorForPD(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).plusDI;
	}
	yAccessorForMD(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).minusDI;
	}
	yAccessorForADX(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).adxValue;
	}
	render() {
		const { className, stroke, refLineOpacity } = this.props;
		const { overSold, middle, overBought } = this.props;
		return (
			<g className={className}>
				<LineSeries yAccessor={this.yAccessorForPD}
					stroke={stroke.dLine}
					fill="none" />
				<LineSeries yAccessor={this.yAccessorForMD}
					stroke={stroke.kLine}
					fill="none" />
				<LineSeries yAccessor={this.yAccessorForADX}
					stroke={stroke.ALine}
					fill="none" />
			</g>
		);
	}
}

ADXSeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.shape({
		dLine: PropTypes.string.isRequired,
		kLine: PropTypes.string.isRequired,
		ALine: PropTypes.string.isRequired,
	}).isRequired,
	overSold: PropTypes.number.isRequired,
	middle: PropTypes.number.isRequired,
	overBought: PropTypes.number.isRequired,
	refLineOpacity: PropTypes.number.isRequired,
};

ADXSeries.defaultProps = {
	className: "react-stockcharts-stochastic-series",
	stroke: {
		dLine: "#EA2BFF",
		kLine: "#74D400",
		ALine: "#ff0000",
	},
	overSold: 100,
	middle: 50,
	overBought: 20,
	refLineOpacity: 0.3,
};

export default ADXSeries;
