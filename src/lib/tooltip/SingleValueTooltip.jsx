"use strict";

import React from "react";

import Utils from "../utils/utils";
import ChartDataUtil from "../utils/ChartDataUtil";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";
import objectAssign from "object-assign";

var stockScaleXAccessr = (d) => d.date;

class SingleValueTooltip extends React.Component {
	render() {
		var { onClick, fontFamily, fontSize, forChart, forSeries } = this.props;
		var { xDisplayFormat, yDisplayFormat, xLabel, yLabel, labelStroke, valueStroke } = this.props;

		var xDisplayValue = "n/a";
		var yDisplayValue = "n/a";

		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);

		var xAccessor;
		if (chartData.plot.scales.xScale.isPolyLinear()) {
			xAccessor = stockScaleXAccessr;
		}

		var { overlays } = chartData.config;
		var { yAccessor, stroke, fill } = overlays.filter(each => each.id === forSeries)[0];


		xAccessor = this.props.xAccessor || xAccessor || chartData.config.xAccessor;
		yAccessor = this.props.yAccessor || yAccessor;

		if (item !== undefined && yAccessor(item) !== undefined) {
			xDisplayValue = xDisplayFormat ? xDisplayFormat(xAccessor(item)) : xDisplayValue;
			yDisplayValue = yDisplayFormat(yAccessor(item));
		}

		var { origin, height, width } = chartData.config;
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
					<ToolTipTSpanLabel fill={labelStroke}>{` ${ yLabel }: `}</ToolTipTSpanLabel>
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
	yLabel: React.PropTypes.string.isRequired,
	labelStroke: React.PropTypes.string.isRequired,
	valueStroke: React.PropTypes.string,
	origin: React.PropTypes.oneOfType([
				React.PropTypes.array
				, React.PropTypes.func
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
	yDisplayFormat: (d) => d,
};

export default SingleValueTooltip;
