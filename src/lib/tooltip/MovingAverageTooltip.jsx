"use strict";

import React from "react";
import d3 from "d3";
import objectAssign from "object-assign";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

import { first } from "../utils";
import { getChartDataForChart, getCurrentItemForChart } from "../utils/ChartDataUtil";

class SingleMAToolTip extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e) {
		var { onClick, forChart, options } = this.props;
		onClick(objectAssign({ chartId: forChart }, options), e);
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
	options: React.PropTypes.object.isRequired,
};

class MovingAverageTooltip extends React.Component {
	render() {
		var { chartConfig, currentItem, width, height } = this.context;

		// var chartData = getChartDataForChart(this.props, this.context);
		// var item = getCurrentItemForChart(this.props, this.context);
		var { className, onClick, forChart, width, fontFamily, fontSize, origin: originProp, calculators, displayFormat } = this.props;

		var config = first(chartConfig.filter(each => each.id === forChart));

		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);
		var [ox, oy] = config.origin;

		return (
			<g transform={`translate(${ ox + x }, ${ oy + y })`} className={className}>
				{calculators
					.map((each, idx) => {
						var yValue = each.accessor()(currentItem);
						var options = {
							maType: each.type(),
							period: each.windowSize(),
							source: each.source(),
							echo: each.echo()
						}
						var yDisplayValue = yValue ? displayFormat(yValue) : "n/a";
						return <SingleMAToolTip
							key={idx}
							origin={[width * idx, 0]}
							color={each.stroke()}
							displayName={each.tooltipLabel()}
							value={yDisplayValue}
							options={options}
							forChart={forChart} onClick={onClick}
							fontFamily={fontFamily} fontSize={fontSize} />;
					})}
			</g>
		);
	}
}

MovingAverageTooltip.contextTypes = {
	chartConfig: React.PropTypes.array.isRequired,
	currentItem: React.PropTypes.object.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
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
	calculators: React.PropTypes.array.isRequired,
	forDataSeries: React.PropTypes.arrayOf(React.PropTypes.number),
};

MovingAverageTooltip.defaultProps = {
	namespace: "ReStock.MovingAverageTooltip",
	className: "react-stockcharts-moving-average-tooltip",
	displayFormat: d3.format(".2f"),
	origin: [0, 10],
	width: 65,
};

export default MovingAverageTooltip;
