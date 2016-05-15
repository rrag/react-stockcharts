"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import { first, isDefined } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class BollingerBandTooltip extends Component {
	render() {
		var { onClick, forChart, displayFormat, calculator } = this.props;

		var { chartConfig, currentItem, width, height } = this.context;
		var config = first(chartConfig.filter(each => each.id === forChart));

		var top, middle, bottom;
		top = middle = bottom = "n/a";
		var accessor = calculator.accessor();

		if (isDefined(currentItem)
				&& isDefined(accessor(currentItem))) {
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
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};
BollingerBandTooltip.propTypes = {
	className: PropTypes.string,
	forChart: PropTypes.number.isRequired,
	calculator: PropTypes.func.isRequired,
	displayFormat: PropTypes.func.isRequired,
	origin: PropTypes.array.isRequired,
	onClick: PropTypes.func,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	forDataSeries: PropTypes.number,
};

BollingerBandTooltip.defaultProps = {
	className: "react-stockcharts-bollingerband-tooltip",
	displayFormat: d3.format(".2f"),
	origin: [0, 10],
};

export default BollingerBandTooltip;
