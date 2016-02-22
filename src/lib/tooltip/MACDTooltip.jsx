"use strict";

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

		var macd = yAccessor(currentItem)

		var MACDLine = (macd && macd.MACDLine && displayFormat(macd.MACDLine)) || "n/a";
		var signalLine = (macd && macd.signalLine && displayFormat(macd.signalLine)) || "n/a";
		var histogram = (macd && macd.histogram && displayFormat(macd.histogram)) || "n/a";

		var { origin: originProp } = this.props;
		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);
		var [ox, oy] = config.origin;

		return (
			<g transform={`translate(${ ox + x }, ${ oy + y })`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel>MACD (</ToolTipTSpanLabel>
						<tspan fill={calculator.stroke().MACDLine}>{calculator.slow()}</tspan>
						<ToolTipTSpanLabel>, </ToolTipTSpanLabel>
						<tspan fill={calculator.stroke().MACDLine}>{calculator.fast()}</tspan>
					<ToolTipTSpanLabel>): </ToolTipTSpanLabel><tspan fill={calculator.stroke().MACDLine}>{MACDLine}</tspan>
					<ToolTipTSpanLabel> Signal (</ToolTipTSpanLabel>
						<tspan fill={calculator.stroke().signalLine}>{calculator.signal()}</tspan>
						<ToolTipTSpanLabel>): </ToolTipTSpanLabel><tspan fill={calculator.stroke().signalLine}>{signalLine}</tspan>
					<ToolTipTSpanLabel> Histogram: </ToolTipTSpanLabel><tspan fill={calculator.fill().histogram}>{histogram}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

MACDTooltip.contextTypes = {
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object.isRequired,
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
	onClick: PropTypes.func,
};

MACDTooltip.defaultProps = {
	origin: [0, 0],
	displayFormat: d3.format(".2f"),
};

export default MACDTooltip;
// export default MACDTooltip;
