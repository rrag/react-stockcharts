

import React, { Component } from "react";
import PropTypes from "prop-types";

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
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).macd;
	}
	yAccessorForSignal(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).signal;
	}
	yAccessorForDivergence(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).divergence;
	}
	yAccessorForDivergenceBase(xScale, yScale/* , d */) {
		return yScale(0);
	}
	render() {
		const { className, opacity, divergenceStroke, widthRatio, width } = this.props;
		const { stroke, fill } = this.props;

		const { clip } = this.props;
		const { zeroLineStroke, zeroLineOpacity } = this.props;

		return (
			<g className={className}>
				<BarSeries
					baseAt={this.yAccessorForDivergenceBase}
					className="macd-divergence"
					width={width}
					widthRatio={widthRatio}
					stroke={divergenceStroke}
					fill={fill.divergence}
					opacity={opacity}
					clip={clip}
					yAccessor={this.yAccessorForDivergence} />
				<LineSeries
					yAccessor={this.yAccessorForMACD}
					stroke={stroke.macd}
					fill="none" />
				<LineSeries
					yAccessor={this.yAccessorForSignal}
					stroke={stroke.signal}
					fill="none" />
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
	yAccessor: PropTypes.func.isRequired,
	opacity: PropTypes.number,
	divergenceStroke: PropTypes.bool,
	zeroLineStroke: PropTypes.string,
	zeroLineOpacity: PropTypes.number,
	clip: PropTypes.bool.isRequired,
	stroke: PropTypes.shape({
		macd: PropTypes.string.isRequired,
		signal: PropTypes.string.isRequired,
	}).isRequired,
	fill: PropTypes.shape({
		divergence: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
	}).isRequired,
	widthRatio: PropTypes.number,
	width: BarSeries.propTypes.width,
};

MACDSeries.defaultProps = {
	className: "react-stockcharts-macd-series",
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 0.6,
	divergenceStroke: false,
	clip: true,
	widthRatio: 0.5,
	width: BarSeries.defaultProps.width,
};

export default MACDSeries;
