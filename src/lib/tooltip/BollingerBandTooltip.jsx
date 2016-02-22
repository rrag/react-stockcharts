"use strict";

import React from "react";
import d3 from "d3";

import { first } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class BollingerBandTooltip extends React.Component {
	render() {
		var { onClick, forChart, forDataSeries, displayFormat, calculator } = this.props;

		var { chartConfig, currentItem, width, height } = this.context;
		var config = first(chartConfig.filter(each => each.id === forChart));

		var top, middle, bottom;
		top = middle = bottom = "n/a";
		var accessor = calculator.accessor();

		if (currentItem !== undefined
				&& accessor(currentItem) !== undefined) {
			var item = accessor(currentItem);
			top = displayFormat(item.top);
			middle = displayFormat(item.middle);
			bottom = displayFormat(item.bottom);
		}

		var { origin: originProp } = this.props;
		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);
		var [ox, oy] = config.origin;
		var tooltipLabel = d3.functor(calculator.tooltipLabel());

		return (
			<g transform={`translate(${ ox + x }, ${ oy + y })`}
					className={this.props.className} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel>{tooltipLabel()}</ToolTipTSpanLabel>
					<tspan>{`${ top }, ${ middle }, ${ bottom }`}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

BollingerBandTooltip.contextTypes = {
	chartConfig: React.PropTypes.array.isRequired,
	currentItem: React.PropTypes.object.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
};
BollingerBandTooltip.propTypes = {
	className: React.PropTypes.string,
	forChart: React.PropTypes.number.isRequired,
	displayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.array.isRequired,
	onClick: React.PropTypes.func,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	forDataSeries: React.PropTypes.number,
};

BollingerBandTooltip.defaultProps = {
	className: "react-stockcharts-bollingerband-tooltip",
	displayFormat: d3.format(".2f"),
	origin: [0, 10],
};

export default BollingerBandTooltip;
