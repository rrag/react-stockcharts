"use strict";

import React from "react";

import Utils from "./utils/utils";
import ChartDataUtil from "./utils/ChartDataUtil";

var billion = 1 * 1000 * 1000 * 1000;
var million = 1 * 1000 * 1000;
var thousand = 1 * 1000;

class MACDTooltip extends React.Component {
	render() {
		var displayDate, fromDate, toDate, open, high, low, close, volume;

		displayDate = fromDate = toDate = open = high = low = close = volume = "n/a";

		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);

		if (item !== undefined && item.close !== undefined) {
			volume = (item.volume / billion > 1)
				? (item.volume / billion).toFixed(2) + "b"
				: (item.volume / million > 1)
					? (item.volume / million).toFixed(2) + "m"
					: (item.volume / thousand > 1)
						? (item.volume / thousand).toFixed(2) + "k"
						: item.volume;

			displayDate = this.props.xDisplayFormat(item.date);
			open = Utils.displayNumberFormat(item.open);
			high = Utils.displayNumberFormat(item.high);
			low = Utils.displayNumberFormat(item.low);
			close = Utils.displayNumberFormat(item.close);
		}
		var origin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		return (
			<g transform={"translate(" + origin[0] + ", " + origin[1] + ")"}>
				<text x={0} y={0} className="legend">
					<tspan key="label" x={0} dy="5" className="tooltip-label">Date: </tspan>
					<tspan key="value">{displayDate}</tspan>
					<tspan key="label_O" className="tooltip-label"> O: </tspan><tspan key="value_O">{open}</tspan>
					<tspan key="label_H" className="tooltip-label"> H: </tspan><tspan key="value_H">{high}</tspan>
					<tspan key="label_L" className="tooltip-label"> L: </tspan><tspan key="value_L">{low}</tspan>
					<tspan key="label_C" className="tooltip-label"> C: </tspan><tspan key="value_C">{close}</tspan>
					<tspan key="label_Vol" className="tooltip-label"> Vol: </tspan><tspan key="value_Vol">{volume}</tspan>
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
