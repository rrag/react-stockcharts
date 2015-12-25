"use strict";

import React from "react";

import Line from "./Line";
import Area from "./Area";

import wrap from "./wrap";

class BollingerSeries extends React.Component {
	render() {

		var { props } = this;
		var { xScale, yScale, xAccessor, yAccessor, plotData, type } = props;
		var { stroke, className, fill, opacity } = props;

		/* eslint-disable react/jsx-no-bind */
		return (
			<g className="bollinger-band-series">
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={(d) => yAccessor(d) && yAccessor(d).top}
					plotData={plotData}
					stroke={stroke.top} fill="none"
					type={type} />
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={(d) => yAccessor(d) && yAccessor(d).middle}
					plotData={plotData}
					stroke={stroke.middle} fill="none"
					type={type} />
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={(d) => yAccessor(d) && yAccessor(d).bottom}
					plotData={plotData}
					stroke={stroke.bottom} fill="none"
					type={type} />
				<Area
					className={className}
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={(d) => yAccessor(d) && yAccessor(d).top}
					base={(scale, d) => scale(yAccessor(d) && yAccessor(d).bottom)}
					plotData={plotData}
					stroke="none" fill={fill} opacity={opacity}
					type={type} />
			</g>
		);
		/* eslint-enable react/jsx-no-bind */
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
