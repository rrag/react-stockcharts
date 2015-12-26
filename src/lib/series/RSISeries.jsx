"use strict";

import React from "react";
import Line from "./Line";
import StraightLine from "./StraightLine";
import wrap from "./wrap";

class RSISeries extends React.Component {
	render() {
		let { className, indicator, xScale, yScale, xAccessor, yAccessor, plotData, stroke, type } = this.props;
		var options = indicator.options();
		return (
			<g className={className}>
				<Line
					className={className}
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={yAccessor}
					plotData={plotData}
					stroke={stroke.line} fill="none"
					type={type} />
				{RSISeries.getHorizontalLine(this.props, options.overSold, stroke.top)}
				{RSISeries.getHorizontalLine(this.props, 50, stroke.middle)}
				{RSISeries.getHorizontalLine(this.props, options.overBought, stroke.bottom)}
			</g>
		);
	}
}

RSISeries.getHorizontalLine = (props, yValue, stroke) => {
	/* eslint-disable react/prop-types */
	let { xScale, yScale, xAccessor, yAccessor, plotData, type } = props;
	/* eslint-enable react/prop-types */

	return <StraightLine
		stroke={stroke} opacity={0.3} type={type}
		xScale={xScale} yScale={yScale}
		xAccessor={xAccessor} yAccessor={yAccessor}
		plotData={plotData}
		yValue={yValue} />;
};

RSISeries.propTypes = {
	className: React.PropTypes.string,

	indicator: React.PropTypes.func,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
	plotData: React.PropTypes.array,
	stroke: React.PropTypes.object,
	type: React.PropTypes.string,
};

RSISeries.defaultProps = {
	className: "react-stockcharts-rsi-series",
	stroke: {
		line: "#000000",
		top: "brown",
		middle: "black",
		bottom: "brown"
	}
};

export default wrap(RSISeries);
