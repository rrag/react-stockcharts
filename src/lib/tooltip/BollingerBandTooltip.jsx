"use strict";

import React from "react";

import Utils from "../utils/utils";
import ChartDataUtil from "../utils/ChartDataUtil";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class BollingerBandTooltip extends React.Component {
	render() {
		var { onClick, forChart, forDataSeries } = this.props;

		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);
		var top, middle, bottom;
		top = middle = bottom = "n/a";

		var overlays = chartData.config.overlays
			.filter(eachOverlay => forDataSeries === undefined ? true : forDataSeries === eachOverlay.id)
			.filter(eachOverlay => eachOverlay.indicator !== undefined)
			.filter(eachOverlay => eachOverlay.indicator.isBollingerBand && eachOverlay.indicator.isBollingerBand());

		if (overlays.length > 1 || overlays.length === 0) {
			console.error(`Could not find Exactly one DataSeries with BollingerBand indicator for Chart id=${ forChart }, either use 
				single BollingerBand indicator per chart
				or use forDataSeries property to narrow down to single Series`);
		}
		var overlay = overlays[0];
		var options = overlay.indicator.options();

		var yAccessor = overlay.indicator.yAccessor();
		var value = yAccessor(item);
		var format = Utils.displayNumberFormat;

		if (value !== undefined) {
			top = format(value.top);
			middle = format(value.middle);
			bottom = format(value.bottom);
		}

		var { origin, height, width } = chartData.config;
		var relativeOrigin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		var absoluteOrigin = [origin[0] + relativeOrigin[0], origin[1] + relativeOrigin[1]];

		return (
			<g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`}
				className={this.props.className}
				onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel>
						{`BB (${ options.period }, ${ options.source }, ${ options.multiplier }, ${ options.movingAverageType }): `}
					</ToolTipTSpanLabel>
					<tspan>{`${ top }, ${ middle }, ${ bottom }`}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

BollingerBandTooltip.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
};

BollingerBandTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	displayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.array.isRequired,
	onClick: React.PropTypes.func,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	forDataSeries: React.PropTypes.number,
};

BollingerBandTooltip.defaultProps = {
	namespace: "ReStock.BollingerBandTooltip",
	className: "react-stockcharts-moving-average-tooltip",
	displayFormat: Utils.displayNumberFormat,
	origin: [0, 10],
	width: 65,
};

export default BollingerBandTooltip;
