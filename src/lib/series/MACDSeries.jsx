"use strict";

import React, { PropTypes, Component } from "react";

import BarSeries from "./BarSeries";
import LineSeries from "./LineSeries";
import StraightLine from "./StraightLine";

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
		var { className, type, opacity, divergenceStroke, calculator } = this.props;
		var stroke = calculator.stroke();
		var fill = calculator.fill();
		return (
			<g className={className}>
				<LineSeries
					yAccessor={this.yAccessorForMACD}
					stroke={stroke.macd} fill="none"
					type={type} />
				<LineSeries
					yAccessor={this.yAccessorForSignal}
					stroke={stroke.signal} fill="none"
					type={type} />
				<BarSeries
					baseAt={this.yAccessorForDivergenceBase}
					className="macd-divergence"
					stroke={divergenceStroke} fill={fill.divergence} opacity={opacity}
					yAccessor={this.yAccessorForDivergence} />
				{getHorizontalLine(this.props)}
			</g>
		);
	}
}

function getHorizontalLine(props) {

	/* eslint-disable react/prop-types */
	var { yAccessor, zeroLineStroke, zeroLineOpacity } = props;
	/* eslint-enable react/prop-types */

	return <StraightLine
		stroke={zeroLineStroke} opacity={zeroLineOpacity}
		yAccessor={yAccessor}
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

export default MACDSeries;
