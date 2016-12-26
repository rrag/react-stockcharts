"use strict";

import React, { PropTypes, Component } from "react";

import OverlayBarSeries from "./OverlayBarSeries";
import StraightLine from "./StraightLine";

class ElderRaySeries extends Component {
	constructor(props) {
		super(props);
		this.fillForEachBar = this.fillForEachBar.bind(this);
		this.yAccessorTop = this.yAccessorTop.bind(this);
		this.yAccessorBullTop = this.yAccessorBullTop.bind(this);
		this.yAccessorBearTop = this.yAccessorBearTop.bind(this);
		this.yAccessorBullBottom = this.yAccessorBullBottom.bind(this);
		this.yAccessorBearBottom = this.yAccessorBearBottom.bind(this);
		this.yAccessorForBarBase = this.yAccessorForBarBase.bind(this);
	}
	yAccessorTop(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && Math.max(yAccessor(d).bullPower, 0);
	}
	yAccessorBullTop(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && (yAccessor(d).bullPower > 0 ? yAccessor(d).bullPower : undefined);
	}
	yAccessorBearTop(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && (yAccessor(d).bearPower > 0 ? yAccessor(d).bearPower : undefined);
	}
	yAccessorBullBottom(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && (yAccessor(d).bullPower < 0 ? 0 : undefined);
	}
	yAccessorBearBottom(d) {
		var { yAccessor } = this.props;
		return yAccessor(d) && (yAccessor(d).bullPower < 0
				|| yAccessor(d).bullPower * yAccessor(d).bearPower < 0 // bullPower is +ve and bearPower is -ve
			? Math.min(0, yAccessor(d).bullPower) : undefined);
	}
	yAccessorForBarBase(xScale, yScale, d) {
		var { yAccessor } = this.props;
		var y = yAccessor(d) && Math.min(yAccessor(d).bearPower, 0);
		return yScale(y);
	}
	fillForEachBar(d, yAccessorNumber) {
		var { bullPowerFill, bearPowerFill } = this.props;
		return yAccessorNumber % 2 === 0 ? bullPowerFill : bearPowerFill;
	}
	render() {
		var { className, opacity, stroke,
			straightLineStroke,
			straightLineOpacity,
			widthRatio
		} = this.props;

		return (
			<g className={className}>
				<OverlayBarSeries
					baseAt={this.yAccessorForBarBase}
					className="react-stockcharts-elderray-bar"
					stroke={stroke}
					fill={this.fillForEachBar}
					opacity={opacity}
					widthRatio={widthRatio}
					yAccessor={[this.yAccessorBullTop, this.yAccessorBearTop, this.yAccessorBullBottom, this.yAccessorBearBottom]} />
				<StraightLine
					className="react-stockcharts-elderray-straight-line"
					yValue={0}
					stroke={straightLineStroke}
					opacity={straightLineOpacity} />
			</g>
		);
	}
}

ElderRaySeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func,
	opacity: PropTypes.number,
	stroke: PropTypes.bool,
	bullPowerFill: PropTypes.string,
	bearPowerFill: PropTypes.string,
	straightLineStroke: PropTypes.string,
	straightLineOpacity: PropTypes.number,
	widthRatio: PropTypes.number,
};

ElderRaySeries.defaultProps = {
	className: "react-stockcharts-elderray-series",
	straightLineStroke: "#000000",
	straightLineOpacity: 0.3,
	opacity: 0.5,
	stroke: true,
	bullPowerFill: "#6BA583",
	bearPowerFill: "#FF0000",
	widthRatio: 0.8,
};

export default ElderRaySeries;
