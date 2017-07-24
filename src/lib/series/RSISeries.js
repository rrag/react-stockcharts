"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import LineSeries from "./LineSeries";
import StraightLine from "./StraightLine";

class RSISeries extends Component {
	render() {
		const { className, stroke } = this.props;
		const { yAccessor } = this.props;
		const { overSold, middle, overBought } = this.props;

		return (
			<g className={className}>
				<LineSeries
					className={className}
					yAccessor={yAccessor}
					stroke={stroke.line} fill="none" />
				<StraightLine
					stroke={stroke.top} opacity={0.3}
					yValue={overSold} />
				<StraightLine
					stroke={stroke.middle} opacity={0.3}
					yValue={middle} />
				<StraightLine
					stroke={stroke.bottom} opacity={0.3}
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
	overSold: 70,
	middle: 50,
	overBought: 30,
};

export default RSISeries;
