"use strict";

import React from "react";
import d3 from "d3";

class XAxis extends React.Component {
	constructor(props) {
		super(props);
		this.updateAxis = this.updateAxis.bind(this);
	}
	componentDidMount() {
		this.updateAxis();
	}
	componentDidUpdate() {
		this.updateAxis();
	}
	updateAxis() {
		var axis = d3.svg.axis()
			.scale(this.context.xScale)
			.orient(this.props.orient);

		if (this.props.orient) axis.orient(this.props.orient);
		if (this.props.innerTickSize) axis.innerTickSize(this.props.innerTickSize);
		if (this.props.outerTickSize) axis.outerTickSize(this.props.outerTickSize);
		if (this.props.tickFormat) {
			if (this.context.xScale.isPolyLinear && this.context.xScale.isPolyLinear()) {
				console.warn("Cannot set tickFormat on a poly linear scale, ignoring tickFormat on XAxis");
			} else {
				axis.tickFormat(this.props.tickFormat);
			}
		}
		if (this.props.tickPadding) axis.tickPadding(this.props.tickPadding);
		if (this.props.tickSize) axis.tickSize(this.props.tickSize);
		if (this.props.ticks) axis.ticks(this.props.ticks);
		if (this.props.tickValues) axis.tickValues(this.props.tickValues);
		if (this.props.noTicks) {
			axis.tickSize(0);
			axis.tickValues([]);
		}
		d3.select(React.findDOMNode(this)).call(axis);
	}
	render() {
		var axisAt = this.props.axisAt
			, range = this.context.yScale.range();
		if (this.props.axisAt === "top") axisAt = Math.min(range[0], range[1]);
		if (this.props.axisAt === "bottom") axisAt = Math.max(range[0], range[1]);
		if (this.props.axisAt === "middle") axisAt = (range[0] + range[1]) / 2;

		return (
			<g className="x axis" transform={"translate(0, " + axisAt + ")"}></g>
		);
	}
}

XAxis.propTypes = {
	axisAt: React.PropTypes.oneOfType([
				React.PropTypes.oneOf(["top", "bottom", "middle"])
				, React.PropTypes.number
			]).isRequired,
	orient: React.PropTypes.oneOf(["top", "bottom"]).isRequired,
	innerTickSize: React.PropTypes.number,
	outerTickSize: React.PropTypes.number,
	tickFormat: React.PropTypes.func,
	tickPadding: React.PropTypes.number,
	tickSize: React.PropTypes.number,
	ticks: React.PropTypes.number,
	tickValues: React.PropTypes.array
};
XAxis.defaultProps = {
	namespace: "ReStock.XAxis",
	showGrid: false
};
XAxis.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired
};


module.exports = XAxis;
