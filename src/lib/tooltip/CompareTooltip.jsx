"use strict";

import React from "react";
import Utils from "../utils/utils";
import ChartDataUtil from "../utils/ChartDataUtil";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class CompareTooltip extends React.Component {
	render() {
		var displayValue = "n/a";

		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);

		var thisSeries = chartData.config.compareSeries.filter(each => each.id === this.props.forCompareSeries)[0];

		if (item !== undefined && thisSeries.yAccessor(item) !== undefined) {
			displayValue = thisSeries.yAccessor(item);
		}

		var { origin, height, width } = chartData.config;
		var relativeOrigin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		var absoluteOrigin = [origin[0] + relativeOrigin[0], origin[1] + relativeOrigin[1]];

		return (
			<g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`}>
				<ToolTipText x={0} y={0}
					fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel key="label" x={0} dy="5" fill={thisSeries.stroke}>{thisSeries.displayLabel + ": "}</ToolTipTSpanLabel>
					<tspan key="value" fill={thisSeries.stroke} >{displayValue}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

CompareTooltip.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
};
 
CompareTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	forCompareSeries: React.PropTypes.number.isRequired,
	xDisplayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.array.isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
};


CompareTooltip.defaultProps = {
	namespace: "ReStock.CompareTooltip",
	xDisplayFormat: Utils.displayDateFormat,
	origin: [0, 0]
};

module.exports = CompareTooltip;
