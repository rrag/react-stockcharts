"use strict";

import React from "react";

import AxisTicks from "./AxisTicks";
import AxisLine from "./AxisLine";

class Axis extends React.Component {
	render() {
		var domain = this.props.showDomain
			? <AxisLine {...this.props} />
			: null;
		var ticks = this.props.showTicks
			? <AxisTicks {...this.props} />
			: null;
		return (
			<g className={this.props.className} >
				{ticks}
				{domain}
			</g>
		);
	}
}

Axis.propTypes = {
	className: React.PropTypes.string.isRequired,
	orient: React.PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
	innerTickSize: React.PropTypes.number,
	outerTickSize: React.PropTypes.number,
	tickFormat: React.PropTypes.func,
	tickPadding: React.PropTypes.number,
	tickSize: React.PropTypes.number,
	ticks: React.PropTypes.array,
	tickValues: React.PropTypes.array,
	scale: React.PropTypes.func.isRequired,
	showDomain: React.PropTypes.bool.isRequired,
	showTicks: React.PropTypes.bool.isRequired,
};

Axis.defaultProps = {
	className: "react-stockcharts-axis",
	showDomain: true,
	showTicks: true,
};

module.exports = Axis;

