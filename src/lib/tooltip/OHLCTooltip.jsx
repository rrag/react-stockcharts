"use strict";

import React, { PropTypes, Component } from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import GenericChartComponent from "../GenericChartComponent";

import { isDefined, functor } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class OHLCTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {
		const { className } = this.props;
		const { chartConfig: { width, height } } = moreProps;
		const { currentItem } = moreProps;

		const { onClick, xDisplayFormat, fontFamily, fontSize, accessor, volumeFormat, ohlcFormat } = this.props;

		let displayDate, open, high, low, close, volume;

		displayDate = open = high = low = close = volume = "n/a";

		if (isDefined(currentItem)
				&& isDefined(accessor(currentItem))
				&& isDefined(accessor(currentItem).close)) {
			const item = accessor(currentItem);
			volume = isDefined(item.volume)
				? volumeFormat(item.volume)
				: "n/a";

			displayDate = xDisplayFormat(item.date);
			open = ohlcFormat(item.open);
			high = ohlcFormat(item.high);
			low = ohlcFormat(item.low);
			close = ohlcFormat(item.close);
		}

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

		return (
			<g className={`react-stockcharts-toottip-hover ${className}`}
				transform={`translate(${ x }, ${ y })`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel key="label" x={0} dy="5">Date: </ToolTipTSpanLabel>
					<tspan key="value">{displayDate}</tspan>
					<ToolTipTSpanLabel key="label_O"> O: </ToolTipTSpanLabel><tspan key="value_O">{open}</tspan>
					<ToolTipTSpanLabel key="label_H"> H: </ToolTipTSpanLabel><tspan key="value_H">{high}</tspan>
					<ToolTipTSpanLabel key="label_L"> L: </ToolTipTSpanLabel><tspan key="value_L">{low}</tspan>
					<ToolTipTSpanLabel key="label_C"> C: </ToolTipTSpanLabel><tspan key="value_C">{close}</tspan>
					<ToolTipTSpanLabel key="label_Vol"> Vol: </ToolTipTSpanLabel><tspan key="value_Vol">{volume}</tspan>
				</ToolTipText>
			</g>
		);
	}
	render() {
		return <GenericChartComponent
			clip={false}
			svgDraw={this.renderSVG}
			drawOn={["mousemove"]}
			/>;
	}
}

OHLCTooltip.propTypes = {
	className: PropTypes.string,
	accessor: PropTypes.func.isRequired,
	xDisplayFormat: PropTypes.func.isRequired,
	ohlcFormat: PropTypes.func.isRequired,
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	onClick: PropTypes.func,
	volumeFormat: PropTypes.func,
};

OHLCTooltip.defaultProps = {
	accessor: (d) => { return { date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume }; },
	xDisplayFormat: timeFormat("%Y-%m-%d"),
	volumeFormat: format(".4s"),
	ohlcFormat: format(".2f"),
	origin: [0, 0],
};

export default OHLCTooltip;
