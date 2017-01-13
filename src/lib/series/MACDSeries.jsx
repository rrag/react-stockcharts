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
		var { clip } = this.props;
		var { zeroLineStroke, zeroLineOpacity } = this.props;

		return (
			<g className={className}>
				<BarSeries
					baseAt={this.yAccessorForDivergenceBase}
					className="macd-divergence"
					widthRatio={0.5}
					stroke={divergenceStroke}
					fill={fill.divergence}
					opacity={opacity}
					clip={clip}
					yAccessor={this.yAccessorForDivergence} />
				<LineSeries
					yAccessor={this.yAccessorForMACD}
					stroke={stroke.macd}
					fill="none"
					type={type} />
				<LineSeries
					yAccessor={this.yAccessorForSignal}
					stroke={stroke.signal}
					fill="none"
					type={type} />
				<StraightLine
					stroke={zeroLineStroke}
					opacity={zeroLineOpacity}
					yValue={0} />
			</g>
		);
	}
}

MACDSeries.propTypes = {
	className: PropTypes.string,
	calculator: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]).isRequired,
	type: PropTypes.string,
	opacity: PropTypes.number,
	divergenceStroke: PropTypes.bool,
	zeroLineStroke: PropTypes.string,
	zeroLineOpacity: PropTypes.number,
	clip: PropTypes.bool.isRequired,
};

MACDSeries.defaultProps = {
	className: "react-stockcharts-macd-series",
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 0.6,
	divergenceStroke: false,
	clip: true,
};

export default MACDSeries;
