"use strict";

import React from "react";

import Utils from "../utils/utils";
import ChartDataUtil from "../utils/ChartDataUtil";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class BollingerBandTooltip extends React.Component {
	render() {
		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);
		if (item[`chart_${this.props.forChart}`] === undefined) return null;
		var { forOverlay } = this.props;
		var overlays = chartData.config.overlays
			.filter(eachOverlay => forOverlay === undefined ? true : forOverlay === eachOverlay.id)
			.filter(eachOverlay => eachOverlay.indicator.isBollingerBand && eachOverlay.indicator.isBollingerBand());
		if (overlays.length !== 1) return null;
		var overlay = overlays[0];
		var options = overlay.indicator.options();
		var yAccessor = overlay.indicator.yAccessor();
		var value = yAccessor(item);
		var format = Utils.displayNumberFormat;
		var [top, middle, bottom] = [format(value.top), format(value.middle), format(value.bottom)];
		return (
			<g transform={"translate(" + this.props.origin[0] + ", " + this.props.origin[1] + ")"} className={this.props.className}>
				<ToolTipText x={0} y={0}
					fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel>
						{`BB (${ options.period }, ${ options.pluck }, ${ options.multiplier }, ${ options.maType }): `}
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
	forOverlay: React.PropTypes.number.isRequired,
};

BollingerBandTooltip.defaultProps = {
	namespace: "ReStock.BollingerBandTooltip",
	className: "react-stockcharts-moving-average-tooltip",
	displayFormat: Utils.displayNumberFormat,
	origin: [0, 10],
	width: 65,
};

module.exports = BollingerBandTooltip;
