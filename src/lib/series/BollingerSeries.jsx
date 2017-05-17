"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import LineSeries from "./LineSeries";
import AreaOnlySeries from "./AreaOnlySeries";

class BollingerSeries extends Component {
	constructor(props) {
		super(props);
		this.yAccessorForTop = this.yAccessorForTop.bind(this);
		this.yAccessorForMiddle = this.yAccessorForMiddle.bind(this);
		this.yAccessorForBottom = this.yAccessorForBottom.bind(this);
		this.yAccessorForScalledBottom = this.yAccessorForScalledBottom.bind(this);
	}
	yAccessorForTop(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).top;
	}
	yAccessorForMiddle(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).middle;
	}
	yAccessorForBottom(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && yAccessor(d).bottom;
	}
	yAccessorForScalledBottom(scale, d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return scale(yAccessor(d) && yAccessor(d).bottom);
	}
	render() {
		var { calculator, areaClassName, className, opacity } = this.props;

		var stroke = calculator.stroke();
		var fill = calculator.fill();

		return (
			<g className={className}>
				<LineSeries yAccessor={this.yAccessorForTop}
					stroke={stroke.top} fill="none" />
				<LineSeries yAccessor={this.yAccessorForMiddle}
					stroke={stroke.middle} fill="none" />
				<LineSeries yAccessor={this.yAccessorForBottom}
					stroke={stroke.bottom} fill="none" />
				<AreaOnlySeries className={areaClassName}
					yAccessor={this.yAccessorForTop}
					base={this.yAccessorForScalledBottom}
					stroke="none" fill={fill}
					opacity={opacity} />
			</g>
		);
	}
}

BollingerSeries.propTypes = {
	calculator: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]).isRequired,
	className: PropTypes.string,
	areaClassName: PropTypes.string,
	opacity: PropTypes.number,
	type: PropTypes.string,
};

BollingerSeries.defaultProps = {
	className: "react-stockcharts-bollinger-band-series",
	areaClassName: "react-stockcharts-bollinger-band-series-area",
	opacity: 0.2
};

export default BollingerSeries;
