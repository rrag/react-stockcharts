"use strict";

import React from "react";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

import { displayDateFormat } from "../utils/utils";
import { getChartDataForChart, getCurrentItemForChart } from "../utils/ChartDataUtil";


class MACDTooltip extends React.Component {
	render() {
		var { onClick, forChart, forDataSeries } = this.props;

		var chartData = getChartDataForChart(this.props, this.context);
		var overlays = chartData.config.overlays
			.filter(eachOverlay => forDataSeries === undefined ? true : forDataSeries === eachOverlay.id)
			.filter(eachOverlay => eachOverlay.indicator !== undefined)
			.filter(eachOverlay => eachOverlay.indicator.isMACD && eachOverlay.indicator.isMACD());

		if (overlays.length > 1 || overlays.length === 0) {
			console.error(`Could not find Exactly one DataSeries with MACD indicator for Chart id=${ forChart }, either use
				single MACD indicator per chart
				or use forDataSeries property to narrow down to single Series`);
		}
		var overlay = overlays[0];
		var options = overlay.indicator.options();

		var item = getCurrentItemForChart(this.props, this.context);
		var macd = overlay.yAccessor(item);
		var format = chartData.config.mouseCoordinates.format;

		var MACDLine = (macd && macd.MACDLine && format(macd.MACDLine)) || "n/a";
		var signalLine = (macd && macd.signalLine && format(macd.signalLine)) || "n/a";
		var histogram = (macd && macd.histogram && format(macd.histogram)) || "n/a";

		var { origin } = chartData.config;
		var relativeOrigin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		var absoluteOrigin = [origin[0] + relativeOrigin[0], origin[1] + relativeOrigin[1]];

		return (
			<g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`}
				onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel>MACD (</ToolTipTSpanLabel>
						<tspan fill={options.stroke.MACDLine}>{options.slow}</tspan>
						<ToolTipTSpanLabel>, </ToolTipTSpanLabel>
						<tspan fill={options.stroke.MACDLine}>{options.fast}</tspan>
					<ToolTipTSpanLabel>): </ToolTipTSpanLabel><tspan fill={options.stroke.MACDLine}>{MACDLine}</tspan>
					<ToolTipTSpanLabel> Signal (</ToolTipTSpanLabel>
						<tspan fill={options.stroke.signalLine}>{options.signal}</tspan>
						<ToolTipTSpanLabel>): </ToolTipTSpanLabel><tspan fill={options.stroke.signalLine}>{signalLine}</tspan>
					<ToolTipTSpanLabel> Histogram: </ToolTipTSpanLabel><tspan fill={options.fill.histogram}>{histogram}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

MACDTooltip.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
};

MACDTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	xDisplayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.func
	]).isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	forDataSeries: React.PropTypes.number,
	onClick: React.PropTypes.func,
};

MACDTooltip.defaultProps = {
	namespace: "ReStock.MACDTooltip",
	xDisplayFormat: displayDateFormat,
	origin: [0, 0]
};

export default MACDTooltip;
// export default MACDTooltip;
