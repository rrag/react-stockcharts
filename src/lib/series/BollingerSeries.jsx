"use strict";

import React from "react";

import Line from "./Line";
import Area from "./Area";

import wrap from "./wrap";

class BollingerSeries extends React.Component {
	constructor(props) {
		super(props);
		this.yAccessorForTop = this.yAccessorForTop.bind(this);
		this.yAccessorForMiddle = this.yAccessorForMiddle.bind(this);
		this.yAccessorForBottom = this.yAccessorForBottom.bind(this);
		this.yAccessorForScalledBottom = this.yAccessorForScalledBottom.bind(this);
	}
	yAccessorForTop(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).top;
	}
	yAccessorForMiddle(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).middle;
	}
	yAccessorForBottom(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).bottom;
	}
	yAccessorForScalledBottom(scale, d) {
		var { yAccessor } = this.props;
		return scale(yAccessor(d) && yAccessor(d).bottom);
	}
	render() {
		var { props } = this;
		var { xScale, yScale, xAccessor, yAccessor, plotData, type } = props;
		var { stroke, className, fill, opacity } = props;

		return (
			<g className="bollinger-band-series">
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
					className={className}
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

BollingerSeries.defaultProps = {
	stroke: {
		top: "brown",
		middle: "black",
		bottom: "brown",
	},
	fill: "#4682B4",
	opacity: 0.2
};

export default wrap(BollingerSeries);
