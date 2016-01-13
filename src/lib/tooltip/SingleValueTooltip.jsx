"use strict";

import React from "react";

import { getChartDataForChart, getCurrentItemForChart } from "../utils/ChartDataUtil";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class SingleValueTooltip extends React.Component {
	render() {
		var { fontFamily, fontSize, forSeries } = this.props;
		var { xDisplayFormat, yDisplayFormat, xLabel, yLabel, labelStroke, valueStroke } = this.props;

		var xDisplayValue = "n/a";
		var yDisplayValue = "n/a";

		var chartData = getChartDataForChart(this.props, this.context);
		var item = getCurrentItemForChart(this.props, this.context);

		/* var xAccessor;
		if (chartData.plot.scales.xScale.isPolyLinear()) {
			xAccessor = stockScaleXAccessr;
		} */

		var { overlays } = chartData.config;
		var { yAccessor, stroke, indicator } = overlays.filter(each => each.id === forSeries)[0];

		var yl = (typeof yLabel === "function")
			? yLabel(indicator)
			: yLabel;

		var xAccessor = this.props.xAccessor; /* || xAccessor || chartData.config.xAccessor */
		var finalyAccessor = this.props.yAccessor || yAccessor;

		if (item !== undefined && finalyAccessor(item) !== undefined) {
			xDisplayValue = xDisplayFormat ? xDisplayFormat(xAccessor(item)) : xDisplayValue;
			yDisplayValue = yDisplayFormat(finalyAccessor(item));
		}

		var { origin } = chartData.config;
		var relativeOrigin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		var absoluteOrigin = [origin[0] + relativeOrigin[0], origin[1] + relativeOrigin[1]];

		return (
			<g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					{ xLabel ? <ToolTipTSpanLabel x={0} dy="5" fill={labelStroke}>{xLabel + ": "}</ToolTipTSpanLabel> : null}
					{ xLabel ? <tspan fill={valueStroke || stroke} >{xDisplayValue}</tspan> : null}
					<ToolTipTSpanLabel fill={labelStroke}>{` ${ yl }: `}</ToolTipTSpanLabel>
					<tspan fill={valueStroke || stroke} >{yDisplayValue}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

SingleValueTooltip.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	dataTransform: React.PropTypes.array,
};

SingleValueTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	forSeries: React.PropTypes.number.isRequired,
	xDisplayFormat: React.PropTypes.func,
	yDisplayFormat: React.PropTypes.func.isRequired,
	xLabel: React.PropTypes.string,
	yLabel: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.func
	]).isRequired,
	labelStroke: React.PropTypes.string.isRequired,
	valueStroke: React.PropTypes.string,
	origin: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.func
	]).isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	onClick: React.PropTypes.func,
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
};

SingleValueTooltip.defaultProps = {
	origin: [0, 0],
	labelStroke: "#4682B4",
	yDisplayFormat: d => d,
	xAccessor: d => d.date,
};

export default SingleValueTooltip;
