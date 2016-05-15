"use strict";

import d3 from "d3";
import React, { PropTypes, Component } from "react";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

import { first } from "../utils";

class MACDTooltip extends Component {
	render() {

		var { forChart, onClick, fontFamily, fontSize, calculator, displayFormat } = this.props;
		var { chartConfig, currentItem, width, height } = this.context;

		var yAccessor = calculator.accessor();
		var config = first(chartConfig.filter(each => each.id === forChart));

		var macdValue = currentItem && yAccessor(currentItem);

		var macd = (macdValue && macdValue.macd && displayFormat(macdValue.macd)) || "n/a";
		var signal = (macdValue && macdValue.signal && displayFormat(macdValue.signal)) || "n/a";
		var divergence = (macdValue && macdValue.divergence && displayFormat(macdValue.divergence)) || "n/a";

		var { origin: originProp } = this.props;
		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);
		var [ox, oy] = config.origin;

		return (
			<g transform={`translate(${ ox + x }, ${ oy + y })`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel>MACD (</ToolTipTSpanLabel>
						<tspan fill={calculator.stroke().macd}>{calculator.slow()}</tspan>
						<ToolTipTSpanLabel>, </ToolTipTSpanLabel>
						<tspan fill={calculator.stroke().macd}>{calculator.fast()}</tspan>
					<ToolTipTSpanLabel>): </ToolTipTSpanLabel><tspan fill={calculator.stroke().macd}>{macd}</tspan>
					<ToolTipTSpanLabel> Signal (</ToolTipTSpanLabel>
						<tspan fill={calculator.stroke().signal}>{calculator.signal()}</tspan>
						<ToolTipTSpanLabel>): </ToolTipTSpanLabel><tspan fill={calculator.stroke().signal}>{signal}</tspan>
					<ToolTipTSpanLabel> Divergence: </ToolTipTSpanLabel><tspan fill={calculator.fill().divergence}>{divergence}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

MACDTooltip.contextTypes = {
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};

MACDTooltip.propTypes = {
	forChart: PropTypes.number.isRequired,
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	calculator: PropTypes.func.isRequired,
	displayFormat: PropTypes.func.isRequired,
	onClick: PropTypes.func,
};

MACDTooltip.defaultProps = {
	origin: [0, 0],
	displayFormat: d3.format(".2f"),
};

export default MACDTooltip;
// export default MACDTooltip;
