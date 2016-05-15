"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

import { first } from "../utils";

class SingleMAToolTip extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e) {
		var { onClick, forChart, options } = this.props;
		onClick({ chartId: forChart, ...options }, e);
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
	origin: PropTypes.array.isRequired,
	color: PropTypes.string.isRequired,
	displayName: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	forChart: PropTypes.number.isRequired,
	options: PropTypes.object.isRequired,
};

class MovingAverageTooltip extends Component {
	render() {
		var { chartConfig, currentItem, height } = this.context;

		var { className, onClick, forChart, width, fontFamily, fontSize, origin: originProp, calculators, displayFormat } = this.props;

		var config = first(chartConfig.filter(each => each.id === forChart));

		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);
		var [ox, oy] = config.origin;

		return (
			<g transform={`translate(${ ox + x }, ${ oy + y })`} className={className}>
				{calculators
					.map((each, idx) => {
						var yValue = currentItem && each.accessor()(currentItem);
						var options = {
							maType: each.type(),
							period: each.windowSize(),
							source: each.source(),
							echo: each.echo()
						};
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
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object,
	height: PropTypes.number.isRequired,
};

MovingAverageTooltip.propTypes = {
	className: PropTypes.string,
	forChart: PropTypes.number.isRequired,
	displayFormat: PropTypes.func.isRequired,
	origin: PropTypes.array.isRequired,
	onClick: PropTypes.func,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	width: PropTypes.number,
	calculators: PropTypes.array.isRequired,
	forDataSeries: PropTypes.arrayOf(PropTypes.number),
};

MovingAverageTooltip.defaultProps = {
	className: "react-stockcharts-moving-average-tooltip",
	displayFormat: d3.format(".2f"),
	origin: [0, 10],
	width: 65,
};

export default MovingAverageTooltip;
