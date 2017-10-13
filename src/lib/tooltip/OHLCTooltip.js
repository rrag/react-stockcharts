"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import displayValuesFor from "./displayValuesFor";
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
		const { className, textFill, labelFill } = this.props;
		const { onClick, fontFamily, fontSize } = this.props;
		const { displayValuesFor } = this.props;
		const { xDisplayFormat, accessor, volumeFormat, ohlcFormat } = this.props;

		const { chartConfig: { width, height } } = moreProps;
		const { displayXAccessor } = moreProps;

		const currentItem = displayValuesFor(this.props, moreProps);

		let displayDate, open, high, low, close, volume;
		displayDate = open = high = low = close = volume = "n/a";

		const {
			openAccessor = (d) => (accessor(d) || {}).open,
			highAccessor = (d) => (accessor(d) || {}).high,
			lowAccessor = (d) => (accessor(d) || {}).low,
			closeAccessor = (d) => (accessor(d) || {}).close,
			volumeAccessor = (d) => (accessor(d) || {}).volume,
		} = this.props;

		if (isDefined(currentItem)) {
			displayDate = xDisplayFormat(displayXAccessor(currentItem));
			open = ohlcFormat(openAccessor(currentItem));
			high = ohlcFormat(highAccessor(currentItem));
			low = ohlcFormat(lowAccessor(currentItem));
			close = ohlcFormat(closeAccessor(currentItem));
			volume = isDefined(volumeAccessor(currentItem))
				? volumeFormat(volumeAccessor(currentItem))
				: "n/a";
		}

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

		return (
			<g className={`react-stockcharts-tooltip-hover ${className}`}
				transform={`translate(${ x }, ${ y })`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel fill={labelFill} key="label" x={0} dy="5">Date: </ToolTipTSpanLabel>
					<tspan key="value" fill={textFill}>{displayDate}</tspan>
					<ToolTipTSpanLabel fill={labelFill} key="label_O"> O: </ToolTipTSpanLabel><tspan key="value_O" fill={textFill}>{open}</tspan>
					<ToolTipTSpanLabel fill={labelFill} key="label_H"> H: </ToolTipTSpanLabel><tspan key="value_H" fill={textFill}>{high}</tspan>
					<ToolTipTSpanLabel fill={labelFill} key="label_L"> L: </ToolTipTSpanLabel><tspan key="value_L" fill={textFill}>{low}</tspan>
					<ToolTipTSpanLabel fill={labelFill} key="label_C"> C: </ToolTipTSpanLabel><tspan key="value_C" fill={textFill}>{close}</tspan>
					<ToolTipTSpanLabel fill={labelFill} key="label_Vol"> Vol: </ToolTipTSpanLabel><tspan key="value_Vol" fill={textFill}>{volume}</tspan>
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
	accessor: PropTypes.func,
	openAccessor: PropTypes.func,
	highAccessor: PropTypes.func,
	lowAccessor: PropTypes.func,
	closeAccessor: PropTypes.func,
	volumeAccessor: PropTypes.func,
	xDisplayFormat: PropTypes.func,
	ohlcFormat: PropTypes.func,
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]),
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	onClick: PropTypes.func,
	displayValuesFor: PropTypes.func,
	volumeFormat: PropTypes.func,
	textFill: PropTypes.string,
	labelFill: PropTypes.string,
};

OHLCTooltip.defaultProps = {
	accessor: (d) => { return { date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume }; },
	xDisplayFormat: timeFormat("%Y-%m-%d"),
	volumeFormat: format(".4s"),
	ohlcFormat: format(".2f"),
	displayValuesFor: displayValuesFor,
	origin: [0, 0],
};

export default OHLCTooltip;
