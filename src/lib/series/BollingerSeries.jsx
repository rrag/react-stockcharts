"use strict";

import React from "react";
import d3 from "d3";

import HistogramSeries from "./HistogramSeries";
import Line from "./Line";
import Area from "./Area";

class BollingerSeries extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		// if (this.context.type !== "svg") return null;
		let { xScale, yScale, xAccessor, yAccessor, plotData, type } = this.context;
		let { stroke, className, fill, opacity } = this.props;

		var areaSeries = d3.svg.area()
			.defined((d) => yAccessor(d) !== undefined)
			.x((d) => xScale(xAccessor(d)))
			.y0((d) => yScale(yAccessor(d).bottom))
			.y1((d) => yScale(yAccessor(d).top));

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
	}
}

BollingerSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	type: React.PropTypes.string,
};

/* BollingerSeries.childContextTypes = {
	yAccessor: React.PropTypes.func.isRequired,
};
*/
BollingerSeries.defaultProps = {
	namespace: "ReStock.BollingerSeries",
	stroke: {
		top: "brown",
		middle: "black",
		bottom: "brown",
	},
	fill: "steelblue",
	opacity: 0.2
};

module.exports = BollingerSeries;
