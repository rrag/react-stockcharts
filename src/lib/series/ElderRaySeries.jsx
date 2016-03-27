"use strict";

import React, { PropTypes, Component } from "react";

import OverlayBarSeries from "./OverlayBarSeries";
import StraightLine from "./StraightLine";

import wrap from "./wrap";

class ElderRaySeries extends Component {
	constructor(props) {
		super(props);
		this.yAccessorTop = this.yAccessorTop.bind(this);
		this.yAccessorBullTop = this.yAccessorBullTop.bind(this);
		this.yAccessorBearTop = this.yAccessorBearTop.bind(this);
		this.yAccessorBullBottom = this.yAccessorBullBottom.bind(this);
		this.yAccessorBearBottom = this.yAccessorBearBottom.bind(this);
		this.yAccessorForBarBase = this.yAccessorForBarBase.bind(this);
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
				|| yAccessor(d).bullPower * yAccessor(d).bearPower < 0 // bullPower is +ve and bearPower is -ve
			? Math.min(0, yAccessor(d).bullPower) : undefined);
	}
	yAccessorForBarBase(xScale, yScale, d) {
		var { calculator } = this.props;
		var yAccessor = calculator.accessor();
		var y = yAccessor(d) && Math.min(yAccessor(d).bearPower, 0);
		return yScale(y);
	}
	fillForEachBar(d, yAccessorNumber) {
		return yAccessorNumber % 2 === 0 ? "#6BA583" : "#FF0000";
	}
	render() {
		var { className, xScale, yScale, plotData, opacity } = this.props;

		return (
			<g className={className}>
				<OverlayBarSeries
					xScale={xScale} yScale={yScale}
					baseAt={this.yAccessorForBarBase}
					className="elderray-bar"
					stroke={false} fill={this.fillForEachBar}
					opacity={opacity}
					plotData={plotData}
					yAccessor={[this.yAccessorBullTop, this.yAccessorBearTop, this.yAccessorBullBottom, this.yAccessorBearBottom]} />
				<StraightLine yValue={0} />
			</g>
		);
	}
}

ElderRaySeries.propTypes = {
	className: PropTypes.string,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	xAccessor: PropTypes.func,
	calculator: PropTypes.func.isRequired,
	plotData: PropTypes.array,
	type: PropTypes.string,
	opacity: PropTypes.number,
	divergenceStroke: PropTypes.bool,
};

ElderRaySeries.defaultProps = {
	className: "react-stockcharts-elderray-series",
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 1,
	divergenceStroke: false,
};

export default wrap(ElderRaySeries);
