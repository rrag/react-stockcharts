"use strict";

import React from "react";

import HistogramSeries from "./HistogramSeries";
import Line from "./Line";
import StraightLine from "./StraightLine";

import wrap from "./wrap";

class MACDSeries extends React.Component {
	constructor(props) {
		super(props);
		this.yAccessorForMACDLine = this.yAccessorForMACDLine.bind(this);
		this.yAccessorForSignalLine = this.yAccessorForSignalLine.bind(this);
	}
	yAccessorForMACDLine(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).MACDLine;
	}
	yAccessorForSignalLine(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).signalLine;
	}
	render() {
		var { className, indicator, xScale, yScale, xAccessor, yAccessor, plotData, type, opacity, histogramStroke } = this.props;
		var options = indicator.options();

		return (
			<g className={className}>
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForMACDLine}
					plotData={plotData}
					stroke={options.stroke.MACDLine} fill="none"
					type={type} />
				<Line
					xScale={xScale} yScale={yScale}
					xAccessor={xAccessor} yAccessor={this.yAccessorForSignalLine}
					plotData={plotData}
					stroke={options.stroke.signalLine} fill="none"
					type={type} />
				<HistogramSeries
					baseAt={(xScale, yScale/* , d */) => yScale(0)}
					className="macd-histogram"
					stroke={histogramStroke} fill={options.fill.histogram} opacity={opacity}
					yAccessor={(d) => yAccessor(d) && yAccessor(d).histogram} />
				{MACDSeries.getHorizontalLine(this.props)}
			</g>
		);
	}
}

MACDSeries.getHorizontalLine = (props) => {

	/* eslint-disable react/prop-types */
	var { xScale, yScale, xAccessor, yAccessor, plotData, type, zeroLineStroke, zeroLineOpacity } = props;
	/* eslint-enable react/prop-types */

	return <StraightLine
		stroke={zeroLineStroke} opacity={zeroLineOpacity} type={type}
		xScale={xScale} yScale={yScale}
		xAccessor={xAccessor} yAccessor={yAccessor}
		plotData={plotData}
		yValue={0} />;
};

MACDSeries.childContextTypes = {
	yAccessor: React.PropTypes.func.isRequired,
};

MACDSeries.propTypes = {
	className: React.PropTypes.string,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
	plotData: React.PropTypes.array,
	type: React.PropTypes.string,
	opacity: React.PropTypes.number,
	histogramStroke: React.PropTypes.bool,
	indicator: React.PropTypes.func.isRequired,
};

MACDSeries.defaultProps = {
	className: "react-stockcharts-macd-series",
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 0.6,
	histogramStroke: false,
};

export default wrap(MACDSeries);
