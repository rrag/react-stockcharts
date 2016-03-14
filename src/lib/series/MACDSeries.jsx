"use strict";

import React, { PropTypes, Component } from "react";

import BarSeries from "./BarSeries";
import Line from "./Line";
import StraightLine from "./StraightLine";

import wrap from "./wrap";

class MACDSeries extends Component {
	constructor(props) {
		super(props);
		this.yAccessorForMACD = this.yAccessorForMACD.bind(this);
		this.yAccessorForSignal = this.yAccessorForSignal.bind(this);
		this.yAccessorForDivergence = this.yAccessorForDivergence.bind(this);
		this.yAccessorForDivergenceBase = this.yAccessorForDivergenceBase.bind(this);
	}
	yAccessorForMACD(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).macd;
	}
	yAccessorForSignal(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).signal;
	}
	yAccessorForDivergence(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).divergence;
	}
	yAccessorForDivergenceBase(xScale, yScale/* , d */) {
		return yScale(0);
	}
	render() {
		var { className, xScale, yScale, xAccessor, plotData, type, opacity, divergenceStroke, calculator } = this.props;
		var stroke = calculator.stroke();
		var fill = calculator.fill();
		// console.log(this.props.yAccessor)
		return (
			<g className={className}>
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForMACD}
					plotData={plotData}
					stroke={stroke.macd} fill="none"
					type={type} />
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForSignal}
					plotData={plotData}
					stroke={stroke.signal} fill="none"
					type={type} />
				<BarSeries
					baseAt={this.yAccessorForDivergenceBase}
					className="macd-divergence"
					stroke={divergenceStroke} fill={fill.divergence} opacity={opacity}
					yAccessor={this.yAccessorForDivergence} />
				{MACDSeries.getHorizontalLine(this.props)}
			</g>
		);
	}
}

MACDSeries.getHorizontalLine = (props) => {

	/* eslint-disable react/prop-types */
	var { xScale, yScale, xAccessor, yAccessor, plotData, type, zeroLineStroke, zeroLineOpacity } = props;
	/* eslint-enable react/prop-types */

	return <StraightLine
		stroke={zeroLineStroke} opacity={zeroLineOpacity} type={type}
		xScale={xScale} yScale={yScale}
		xAccessor={xAccessor} yAccessor={yAccessor}
		plotData={plotData}
		yValue={0} />;
};

MACDSeries.propTypes = {
	className: PropTypes.string,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	xAccessor: PropTypes.func,
	calculator: PropTypes.func.isRequired,
	plotData: PropTypes.array,
	type: PropTypes.string,
	opacity: PropTypes.number,
	divergenceStroke: PropTypes.bool,
};

MACDSeries.defaultProps = {
	className: "react-stockcharts-macd-series",
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 0.6,
	divergenceStroke: false,
};

export default wrap(MACDSeries);
