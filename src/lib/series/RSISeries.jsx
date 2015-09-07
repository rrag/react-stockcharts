"use strict";

import React from "react";
import d3 from "d3";
import Line from "./Line";
import StraightLine from "./StraightLine";

class RSISeries extends React.Component {
	constructor(props) {
		super(props);
		this.getHorizontalLine = this.getHorizontalLine.bind(this);
	}
	getHorizontalLine(yValue, stroke) {
		let { xScale, yScale, xAccessor, yAccessor, plotData, type } = this.context;

		var first = xAccessor(plotData[0]);
		var last = xAccessor(plotData[plotData.length - 1]);

		return <StraightLine
			stroke={stroke} opacity={0.3} type={type}
			x1={xScale(first)}
			y1={yScale(yValue)}
			x2={xScale(last)}
			y2={yScale(yValue)} />;
	}
	render() {
		let { indicator, xScale, yScale, xAccessor, yAccessor, plotData, stroke, type } = this.context;
		var options = indicator.options();
		return (
			<g className={this.props.className}>
				<Line
					className={this.props.className}
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={yAccessor}
					data={plotData}
					stroke={stroke} fill="none"
					type={type} />
				{this.getHorizontalLine(options.overSold, "brown")}
				{this.getHorizontalLine(50, "black")}
				{this.getHorizontalLine(options.overBought, "brown")}
			</g>
		);
	}
}

RSISeries.propTypes = {
	className: React.PropTypes.string,
};

RSISeries.defaultProps = {
	namespace: "ReStock.RSISeries",
	className: "react-stockcharts-rsi-series"
};

RSISeries.contextTypes = {
	indicator: React.PropTypes.func.isRequired,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	stroke: React.PropTypes.string,
	type: React.PropTypes.string,
};

module.exports = RSISeries;
