"use strict";

import React from "react";

import Utils from "../utils/utils";
import ChartDataUtil from "../utils/ChartDataUtil";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";


class SingleMAToolTip extends React.Component {
	render() {
		var { onClick, forChart, forDataSeries, overlay } = this.props;

		var translate = "translate(" + this.props.origin[0] + ", " + this.props.origin[1] + ")";
		return (
			<g transform={translate}>
				<line x1={0} y1={2} x2={0} y2={28} stroke={this.props.color} strokeWidth="4px"/>
				<ToolTipText x={5} y={11}
					fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel>{this.props.displayName}</ToolTipTSpanLabel>
					<tspan x="5" dy="15">{this.props.value}</tspan>
				</ToolTipText>
				<rect x={0} y={0} width={55} height={30}
					onClick={onClick.bind(null, overlay)}
					fill="none" stroke="none" />
			</g>
		);
	}
}

SingleMAToolTip.propTypes = {
	origin: React.PropTypes.array.isRequired,
	color: React.PropTypes.string.isRequired,
	displayName: React.PropTypes.string.isRequired,
	value: React.PropTypes.string.isRequired,
	onClick: React.PropTypes.func,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
};

class MovingAverageTooltip extends React.Component {
	render() {
		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);
		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);
		var { onClick, forChart, forDataSeries } = this.props;

		var { origin, height, width } = chartData.config;
		var relativeOrigin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		var absoluteOrigin = [origin[0] + relativeOrigin[0], origin[1] + relativeOrigin[1]];

		return (
			<g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`} className={this.props.className}>
				{chartData.config.overlays
					.filter(eachOverlay => eachOverlay.indicator !== undefined)
					.filter(eachOverlay => eachOverlay.indicator.isMovingAverage && eachOverlay.indicator.isMovingAverage())
					.filter(eachOverlay => forDataSeries === undefined ? true : forDataSeries.indexOf(eachOverlay.id) > -1)
					.map((eachOverlay, idx) => {
						var yValue = eachOverlay.yAccessor(item);
						var yDisplayValue = yValue ? this.props.displayFormat(yValue) : "n/a";
						return <SingleMAToolTip
							key={idx}
							origin={[this.props.width * idx, 0]}
							color={eachOverlay.stroke}
							displayName={eachOverlay.indicator.tooltipLabel()}
							value={yDisplayValue}
							overlay={eachOverlay}
							forChart={forChart} forDataSeries={eachOverlay.id} onClick={onClick}
							fontFamily={this.props.fontFamily} fontSize={this.props.fontSize} />;
					})}
			</g>
		);
	}
}

MovingAverageTooltip.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
};

MovingAverageTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	displayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.array.isRequired,
	onClick: React.PropTypes.func,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	forDataSeries: React.PropTypes.arrayOf(React.PropTypes.number),
};

MovingAverageTooltip.defaultProps = {
	namespace: "ReStock.MovingAverageTooltip",
	className: "react-stockcharts-moving-average-tooltip",
	displayFormat: Utils.displayNumberFormat,
	origin: [0, 10],
	width: 65,
};

module.exports = MovingAverageTooltip;
