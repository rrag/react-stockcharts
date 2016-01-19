"use strict";

import React from "react";
import get from "lodash.get";

import wrap from "./wrap";

class ElderImpulseBackground extends React.Component {
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
	className: React.PropTypes.string,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
	plotData: React.PropTypes.array,
	type: React.PropTypes.string,
	opacity: React.PropTypes.number,
	histogramStroke: React.PropTypes.bool,
	indicator: React.PropTypes.func.isRequired,
};

ElderImpulseBackground.defaultProps = {
	className: "react-stockcharts-elderimpulse-series",
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 1,
	histogramStroke: false,
};

export default wrap(ElderImpulseBackground);
