"use strict";

import React from "react";
import d3 from "d3";

import Line from "./Line";
import Area from "./Area";

class AreaSeries extends React.Component {
	render() {
		let { xScale, yScale, xAccessor, yAccessor, plotData, type, stroke, fill } = this.context;

		if (stroke === undefined) stroke = this.props.stroke;
		if (fill === undefined) fill = this.props.fill;

		let { opacity } = this.props;
		return (
			<g>
				<Line
					className={this.props.className}
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={yAccessor}
					data={plotData}
					stroke={stroke} fill="none"
					type={type} />
				<Area
					className={this.props.className}
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={yAccessor}
					data={plotData}
					stroke="none" fill={fill} opacity={opacity}
					type={type} />
			</g>
		);
	}
}
AreaSeries.propTypes = {
	stroke: React.PropTypes.string.isRequired,
	fill: React.PropTypes.string.isRequired,
	opacity: React.PropTypes.number.isRequired,
	className: React.PropTypes.string,
};

AreaSeries.contextTypes = {
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	canvasContext: React.PropTypes.object,
	type: React.PropTypes.string,
};

AreaSeries.defaultProps = {
	namespace: "ReStock.AreaSeries",
	stroke: "black",
	opacity: 0.5,
	fill: "steelblue",
};

module.exports = AreaSeries;
