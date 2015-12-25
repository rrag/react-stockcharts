"use strict";

import React from "react";
import d3 from "d3";

import { displayDateFormat, displayNumberFormat } from "../utils/utils";
import { getCurrentItemForChart, getChartDataForChart } from "../utils/ChartDataUtil";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

/*
var billion = 1 * 1000 * 1000 * 1000;
var million = 1 * 1000 * 1000;
var thousand = 1 * 1000;
*/

class OHLCTooltip extends React.Component {
	render() {
		var { onClick, xDisplayFormat, fontFamily, fontSize, accessor, volumeFormat } = this.props;

		var displayDate, open, high, low, close, volume;

		displayDate = open = high = low = close = volume = "n/a";

		var item = getCurrentItemForChart(this.props, this.context);
		var chartData = getChartDataForChart(this.props, this.context);

		if (item !== undefined && accessor(item).close !== undefined) {
			item = accessor(item);
			volume = volumeFormat(item.volume);
			/* volume = (item.volume / billion > 1)
				? (item.volume / billion).toFixed(2) + "b"
				: (item.volume / million > 1)
					? (item.volume / million).toFixed(2) + "m"
					: (item.volume / thousand > 1)
						? (item.volume / thousand).toFixed(2) + "k"
						: item.volume; */

			displayDate = xDisplayFormat(item.date);
			open = displayNumberFormat(item.open);
			high = displayNumberFormat(item.high);
			low = displayNumberFormat(item.low);
			close = displayNumberFormat(item.close);
		}

		var { origin } = chartData.config;
		var relativeOrigin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		var absoluteOrigin = [origin[0] + relativeOrigin[0], origin[1] + relativeOrigin[1]];

		return (
			<g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`}
				onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel key="label" x={0} dy="5">Date: </ToolTipTSpanLabel>
					<tspan key="value">{displayDate}</tspan>
					<ToolTipTSpanLabel key="label_O"> O: </ToolTipTSpanLabel><tspan key="value_O">{open}</tspan>
					<ToolTipTSpanLabel key="label_H"> H: </ToolTipTSpanLabel><tspan key="value_H">{high}</tspan>
					<ToolTipTSpanLabel key="label_L"> L: </ToolTipTSpanLabel><tspan key="value_L">{low}</tspan>
					<ToolTipTSpanLabel key="label_C"> C: </ToolTipTSpanLabel><tspan key="value_C">{close}</tspan>
					<ToolTipTSpanLabel key="label_Vol"> Vol: </ToolTipTSpanLabel><tspan key="value_Vol">{volume}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

OHLCTooltip.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
};

OHLCTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	accessor: React.PropTypes.func.isRequired,
	xDisplayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.func
	]).isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	onClick: React.PropTypes.func,
	volumeFormat: React.PropTypes.func,
};

OHLCTooltip.defaultProps = {
	namespace: "ReStock.OHLCTooltip",
	accessor: (d) => { return { date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume }; },
	xDisplayFormat: displayDateFormat,
	volumeFormat: d3.format(".4s"),
	origin: [0, 0],
};

export default OHLCTooltip;
