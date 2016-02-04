"use strict";

import React from "react";

import { first } from "../utils/utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class RSITooltip extends React.Component {
	render() {


		var { forChart, onClick, fontFamily, fontSize, calculator, displayFormat } = this.props;
		var { chartConfig, currentItem, width, height } = this.context;

		var yAccessor = calculator.accessor();
		var config = first(chartConfig.filter(each => each.id === forChart));
		var rsi = yAccessor(currentItem);

		var value = (rsi !== undefined && displayFormat(rsi)) || "n/a";

		var { origin: originProp } = this.props;
		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);
		var [ox, oy] = config.origin;

		return (
			<g transform={`translate(${ ox + x }, ${ oy + y })`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel>{calculator.tooltipLabel()}</ToolTipTSpanLabel>
					<tspan>{value}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

RSITooltip.contextTypes = {
	chartConfig: React.PropTypes.array.isRequired,
	currentItem: React.PropTypes.object.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
};

RSITooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	origin: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.func
	]).isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	onClick: React.PropTypes.func,
	calculator: React.PropTypes.func.isRequired,
};

RSITooltip.defaultProps = {
	namespace: "ReStock.RSITooltip",
	displayFormat: d3.format(".2f"),
	origin: [0, 0]
};

export default RSITooltip;