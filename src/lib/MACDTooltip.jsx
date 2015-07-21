"use strict";

import React from "react";

import Utils from "./utils/utils";
import ChartDataUtil from "./utils/ChartDataUtil";

class MACDTooltip extends React.Component {
	render() {
		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var options = chartData.config.indicatorOptions;

		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);
		var macd = item[`chart_${this.props.forChart}`];
		var format = chartData.config.mouseCoordinates.format;

		var MACDLine = (macd && macd.MACDLine && format(macd.MACDLine)) || "n/a";
		var signalLine = (macd && macd.signalLine && format(macd.signalLine)) || "n/a";
		var histogram = (macd && macd.histogram && format(macd.histogram)) || "n/a";

		var origin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		return (
			<g transform={"translate(" + origin[0] + ", " + origin[1] + ")"}>
				<text x={0} y={0} className="legend">
					<tspan className="tooltip-label">MACD (</tspan>
						<tspan stroke={options.stroke.MACDLine} strokeWidth={0.5}>{options.slow}</tspan>
						<tspan className="tooltip-label">, </tspan>
						<tspan stroke={options.stroke.MACDLine} strokeWidth={0.5}>{options.fast}</tspan>
					<tspan className="tooltip-label">): </tspan><tspan>{MACDLine}</tspan>
					<tspan className="tooltip-label"> Signal (</tspan>
						<tspan stroke={options.stroke.signalLine} strokeWidth={0.5}>{options.signal}</tspan>
						<tspan className="tooltip-label">): </tspan><tspan>{signalLine}</tspan>
					<tspan className="tooltip-label"> Histogram: </tspan><tspan>{histogram}</tspan>
				</text>
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
	accessor: React.PropTypes.func.isRequired,
	xDisplayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.oneOfType([
				React.PropTypes.array
				, React.PropTypes.func
			]).isRequired,
};

MACDTooltip.defaultProps = {
	namespace: "ReStock.MACDTooltip",
	accessor: (d) => { return {date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume}; },
	xDisplayFormat: Utils.displayDateFormat,
	origin: [0, 0]
};

module.exports = MACDTooltip;
