"use strict";

import React, { PropTypes, Component } from "react";

import wrap from "./wrap";

class ElderImpulseBackground extends Component {
	render() {
		var { className, indicator, xScale, yScale, xAccessor, plotData, type, opacity, histogramStroke } = this.props;
		var options = indicator.options();
		console.log(options);
		return (
			<g className={className}>
			</g>
		);
	}
}

ElderImpulseBackground.propTypes = {
	className: PropTypes.string,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	xAccessor: PropTypes.func,
	yAccessor: PropTypes.func,
	plotData: PropTypes.array,
	type: PropTypes.string,
	opacity: PropTypes.number,
	histogramStroke: PropTypes.bool,
	indicator: PropTypes.func.isRequired,
};

ElderImpulseBackground.defaultProps = {
	className: "react-stockcharts-elderimpulse-series",
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 1,
	histogramStroke: false,
};

export default wrap(ElderImpulseBackground);
