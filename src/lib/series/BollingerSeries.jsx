"use strict";

import React, { PropTypes, Component } from "react";

import Line from "./Line";
import Area from "./Area";

import wrap from "./wrap";

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
		var { xScale, yScale, xAccessor, plotData, type } = this.props;
		var { calculator, areaClassName, className, opacity } = this.props;

		var stroke = calculator.stroke();
		var fill = calculator.fill();

		return (
			<g className={className}>
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForTop}
					plotData={plotData}
					stroke={stroke.top} fill="none"
					type={type} />
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForMiddle}
					plotData={plotData}
					stroke={stroke.middle} fill="none"
					type={type} />
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForBottom}
					plotData={plotData}
					stroke={stroke.bottom} fill="none"
					type={type} />
				<Area
					className={areaClassName}
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForTop}
					base={this.yAccessorForScalledBottom}
					plotData={plotData}
					stroke="none" fill={fill} opacity={opacity}
					type={type} />
			</g>
		);
	}
}

BollingerSeries.propTypes = {
	xAccessor: PropTypes.func,
	calculator: PropTypes.func.isRequired,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
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

export default wrap(BollingerSeries);
