"use strict";

import React from "react";

import Utils from "../utils/utils";
import ChartDataUtil from "../utils/ChartDataUtil";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class StochasticTooltip extends React.Component {
	render() {
		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var { forChart, forDataSeries } = this.props;
		var overlays = chartData.config.overlays
			.filter(eachOverlay => forDataSeries === undefined ? true : forDataSeries === eachOverlay.id)
			.filter(eachOverlay => eachOverlay.indicator !== undefined)
			.filter(eachOverlay => eachOverlay.indicator.isStochastic && eachOverlay.indicator.isStochastic());

		if (overlays.length > 1 || overlays.length === 0) {
			console.error(`Could not find Exactly one DataSeries with Stochastic indicator for Chart id=${ forChart }, either use 
				single Stochastic indicator per chart
				or use forDataSeries property to narrow down to single Series`);
		}
		var overlay = overlays[0];
		var options = overlay.indicator.options();

		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);
		var stochastic = overlay.yAccessor(item);
		var format = chartData.config.mouseCoordinates.format;

		var K = (stochastic && stochastic.K && format(stochastic.K)) || "n/a";
		var D = (stochastic && stochastic.D && format(stochastic.D)) || "n/a";

		var { origin, height, width } = chartData.config;
		var relativeOrigin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		var absoluteOrigin = [origin[0] + relativeOrigin[0], origin[1] + relativeOrigin[1]];
		var label = this.props.children || "Stochastic";

		return (
			<g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`}>
				<ToolTipText x={0} y={0} fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel>{`${ label } %K(`}</ToolTipTSpanLabel>
					<tspan fill={options.stroke.K}>{`${ options.period }, ${ options.K }`}</tspan>
					<ToolTipTSpanLabel>): </ToolTipTSpanLabel>
					<tspan fill={options.stroke.K}>{K}</tspan>
					<ToolTipTSpanLabel> %D (</ToolTipTSpanLabel>
					<tspan fill={options.stroke.D}>{options.D}</tspan>
					<ToolTipTSpanLabel>): </ToolTipTSpanLabel>
					<tspan fill={options.stroke.D}>{D}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

StochasticTooltip.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
};

StochasticTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	xDisplayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.oneOfType([
				React.PropTypes.array
				, React.PropTypes.func
			]).isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	forDataSeries: React.PropTypes.number,
};

StochasticTooltip.defaultProps = {
	namespace: "ReStock.StochasticTooltip",
	xDisplayFormat: Utils.displayDateFormat,
	origin: [0, 0]
};

module.exports = StochasticTooltip;
// export default StochasticTooltip;
