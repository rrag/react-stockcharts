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
		var className = "";
		if (this.props.className) className = this.props.defaultClassName.concat(this.props.className);
		return (
			<g className={className}
				transform={this.props.transform}>
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
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number.isRequired,
};


Axis.defaultProps = {
	defaultClassName: "react-stockcharts-axis ",
	showDomain: true,
	showTicks: true,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
};

export default Axis;
