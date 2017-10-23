"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import LineSeries from "./LineSeries";
import StraightLine from "./StraightLine";

class RSISeries extends Component {
	render() {
		const { className, stroke, opacity } = this.props;
		const { yAccessor } = this.props;
		const { overSold, middle, overBought } = this.props;

		return (
			<g className={className}>
				<LineSeries
					className={className}
					yAccessor={yAccessor}
					stroke={stroke.line} fill="none" />
				<StraightLine
					stroke={stroke.top} opacity={opacity.top}
					yValue={overSold} />
				<StraightLine
					stroke={stroke.middle} opacity={opacity.middle}
					yValue={middle} />
				<StraightLine
					stroke={stroke.bottom} opacity={opacity.bottom}
					yValue={overBought} />
			</g>
		);
	}
}

RSISeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.shape({
		line: PropTypes.string.isRequired,
		top: PropTypes.string.isRequired,
		middle: PropTypes.string.isRequired,
		bottom: PropTypes.string.isRequired,
	}).isRequired,
	opacity: PropTypes.shape({
		top: PropTypes.number.isRequired,
		middle: PropTypes.number.isRequired,
		bottom: PropTypes.number.isRequired,
	}).isRequired,
	overSold: PropTypes.number.isRequired,
	middle: PropTypes.number.isRequired,
	overBought: PropTypes.number.isRequired,
};

RSISeries.defaultProps = {
	className: "react-stockcharts-rsi-series",
	stroke: {
		line: "#000000",
		top: "#964B00",
		middle: "#000000",
		bottom: "#964B00"
	},
	opacity: {
		top: 0.3,
		middle: 0.3,
		bottom: 0.3
	},
	overSold: 70,
	middle: 50,
	overBought: 30,
};

export default RSISeries;
