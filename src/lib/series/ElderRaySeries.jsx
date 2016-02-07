"use strict";

import React from "react";

import HistogramSeries from "./HistogramSeries";
import StackedHistogramSeries from "./StackedHistogramSeries";
import StraightLine from "./StraightLine";

import wrap from "./wrap";

class ElderRaySeries extends React.Component {
	constructor(props) {
		super(props);
		this.yAccessorTop = this.yAccessorTop.bind(this);
		this.yAccessorBullTop = this.yAccessorBullTop.bind(this);
		this.yAccessorBearTop = this.yAccessorBearTop.bind(this);
		this.yAccessorBullBottom = this.yAccessorBullBottom.bind(this);
		this.yAccessorBearBottom = this.yAccessorBearBottom.bind(this);
		this.yAccessorForHistogramBase = this.yAccessorForHistogramBase.bind(this);
	}
	yAccessorTop(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && Math.max(yAccessor(d).bullPower, 0);
	}
	yAccessorBullTop(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && (yAccessor(d).bullPower > 0 ? yAccessor(d).bullPower : undefined);
	}
	yAccessorBearTop(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && (yAccessor(d).bearPower > 0 ? yAccessor(d).bearPower : undefined);
	}
	yAccessorBullBottom(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && (yAccessor(d).bullPower < 0 ? 0 : undefined);
	}
	yAccessorBearBottom(d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		return yAccessor(d) && (yAccessor(d).bullPower < 0
				|| yAccessor(d).bullPower * yAccessor(d).bearPower < 0
			? Math.min(0, yAccessor(d).bullPower) : undefined)
	}
	yAccessorForHistogramBase(xScale, yScale, d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		var y = yAccessor(d) ? yAccessor(d).bearPower : 0
		return yScale(Math.min(y, 0));
	}
	fillForEachBar(d, yAccessorNumber) {
		return yAccessorNumber % 2 === 0 ? "#6BA583" : "#FF0000";
	}
	render() {
		var { className, calculator, xScale, yScale, xAccessor, plotData, type, opacity, histogramStroke } = this.props;

		return (
			<g className={className}>
				<StackedHistogramSeries
					xScale={xScale} yScale={yScale}
					baseAt={this.yAccessorForHistogramBase}
					className="elderray-histogram"
					stroke={false} fill={this.fillForEachBar}
					opacity={opacity}
					plotData={plotData}
					yAccessor={[this.yAccessorBullTop, this.yAccessorBearTop, this.yAccessorBullBottom, this.yAccessorBearBottom]} />
				<StraightLine yValue={0} />
			</g>
		);
	}
}

/*
*/

ElderRaySeries.propTypes = {
	className: React.PropTypes.string,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	xAccessor: React.PropTypes.func,
	calculator: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array,
	type: React.PropTypes.string,
	opacity: React.PropTypes.number,
	histogramStroke: React.PropTypes.bool,
};

ElderRaySeries.defaultProps = {
	className: "react-stockcharts-elderray-series",
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 1,
	histogramStroke: false,
};

export default wrap(ElderRaySeries);
