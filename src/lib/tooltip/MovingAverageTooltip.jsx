"use strict";

import React from "react";
import objectAssign from "object-assign";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

import { displayNumberFormat } from "../utils/utils";
import { getChartDataForChart, getCurrentItemForChart } from "../utils/ChartDataUtil";

class SingleMAToolTip extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e) {
		var { onClick, forChart, forDataSeries, options } = this.props;
		onClick(objectAssign({ chartId: forChart, dataSeriesId: forDataSeries }, options), e);
	}
	render() {
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
					onClick={this.handleClick}
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
	forChart: React.PropTypes.number.isRequired,
	forDataSeries: React.PropTypes.number.isRequired,
	options: React.PropTypes.object.isRequired,
};

class MovingAverageTooltip extends React.Component {
	render() {
		var chartData = getChartDataForChart(this.props, this.context);
		var item = getCurrentItemForChart(this.props, this.context);
		var { className, onClick, forChart, forDataSeries, width, fontFamily, fontSize } = this.props;

		var { origin } = chartData.config;
		var relativeOrigin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		var absoluteOrigin = [origin[0] + relativeOrigin[0], origin[1] + relativeOrigin[1]];

		return (
			<g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`} className={className}>
				{chartData.config.overlays
					.filter(eachOverlay => eachOverlay.indicator !== undefined)
					.filter(eachOverlay => eachOverlay.indicator.isMovingAverage && eachOverlay.indicator.isMovingAverage())
					.filter(eachOverlay => forDataSeries === undefined ? true : forDataSeries.indexOf(eachOverlay.id) > -1)
					.map((eachOverlay, idx) => {
						var yValue = eachOverlay.yAccessor(item);
						var yDisplayValue = yValue ? this.props.displayFormat(yValue) : "n/a";
						return <SingleMAToolTip
							key={idx}
							origin={[width * idx, 0]}
							color={eachOverlay.stroke}
							displayName={eachOverlay.indicator.tooltipLabel()}
							value={yDisplayValue}
							options={eachOverlay.indicator.options()}
							forChart={forChart} forDataSeries={eachOverlay.id} onClick={onClick}
							fontFamily={fontFamily} fontSize={fontSize} />;
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
	className: React.PropTypes.string,
	forChart: React.PropTypes.number.isRequired,
	displayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.array.isRequired,
	onClick: React.PropTypes.func,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	width: React.PropTypes.number,
	forDataSeries: React.PropTypes.arrayOf(React.PropTypes.number),
};

MovingAverageTooltip.defaultProps = {
	namespace: "ReStock.MovingAverageTooltip",
	className: "react-stockcharts-moving-average-tooltip",
	displayFormat: displayNumberFormat,
	origin: [0, 10],
	width: 65,
};

export default MovingAverageTooltip;
