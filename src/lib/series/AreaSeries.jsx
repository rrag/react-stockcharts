"use strict";

import React, { PropTypes, Component } from "react";

import Line from "./Line";
import Area from "./Area";

import wrap from "./wrap";

class AreaSeries extends Component {
	render() {
		var { props } = this;
		var { className, xScale, yScale, xAccessor, yAccessor, plotData, type, stroke, strokeWidth, fill, baseAt } = props;

		var { opacity } = props;

		return (
			<g className={className}>
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={yAccessor}
					plotData={plotData}
					stroke={stroke} fill="none"
					strokeWidth={strokeWidth}
					type={type} />
				<Area
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={yAccessor}
					plotData={plotData}
					base={baseAt}
					stroke="none" fill={fill} opacity={opacity}
					type={type} />
			</g>
		);
	}
}

AreaSeries.propTypes = {
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number,
	fill: PropTypes.string.isRequired,
	opacity: PropTypes.number.isRequired,
	className: PropTypes.string,
};

AreaSeries.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-area"
};

AreaSeries.yAccessor = (d) => d.close;

export default wrap(AreaSeries);
