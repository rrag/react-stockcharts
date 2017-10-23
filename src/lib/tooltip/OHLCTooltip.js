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
		const { displayValuesFor } = this.props;
		const {
			xDisplayFormat,
			accessor,
			volumeFormat,
			ohlcFormat,
			percentFormat
		} = this.props;

		const { chartConfig: { width, height } } = moreProps;
		const { displayXAccessor } = moreProps;

		const currentItem = displayValuesFor(this.props, moreProps);

		let displayDate, open, high, low, close, volume, percent;
		displayDate = open = high = low = close = volume = percent = "n/a";

		if (isDefined(currentItem) && isDefined(accessor(currentItem))) {
			const item = accessor(currentItem);
			volume = isDefined(item.volume) ? volumeFormat(item.volume) : "n/a";

			displayDate = xDisplayFormat(displayXAccessor(item));
			open = ohlcFormat(item.open);
			high = ohlcFormat(item.high);
			low = ohlcFormat(item.low);
			close = ohlcFormat(item.close);
			percent = percentFormat((item.close - item.open) / item.open);
		}

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

		const itemsToDisplay = {
			displayDate,
			open,
			high,
			low,
			close,
			percent,
			volume,
			x,
			y
		};
		return this.props.children(this.props, moreProps, itemsToDisplay);
	}
	render() {
		return (
			<GenericChartComponent
				clip={false}
				svgDraw={this.renderSVG}
				drawOn={["mousemove"]}
			/>
		);
	}
}

OHLCTooltip.propTypes = {
	className: PropTypes.string,
	accessor: PropTypes.func,
	xDisplayFormat: PropTypes.func,
	children: PropTypes.func,
	volumeFormat: PropTypes.func,
	percentFormat: PropTypes.func,
	ohlcFormat: PropTypes.func,
	origin: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	onClick: PropTypes.func,
	displayValuesFor: PropTypes.func,
	textFill: PropTypes.string,
	labelFill: PropTypes.string
};

OHLCTooltip.defaultProps = {
	accessor: d => {
		return {
			date: d.date,
			open: d.open,
			high: d.high,
			low: d.low,
			close: d.close,
			volume: d.volume
		};
	},
	xDisplayFormat: timeFormat("%Y-%m-%d"),
	volumeFormat: format(".4s"),
	percentFormat: format(".2%"),
	ohlcFormat: format(".2f"),
	displayValuesFor: displayValuesFor,
	origin: [0, 0],
	children: defaultDisplay
};

function defaultDisplay(props, moreProps, itemsToDisplay) {

	/* eslint-disable */
	const {
		className,
		textFill,
		labelFill,
		onClick,
		fontFamily,
		fontSize
	} = props;
	/* eslint-enable */

	const {
		displayDate,
		open,
		high,
		low,
		close,
		volume,
		x,
		y
	} = itemsToDisplay;
	return (
		<g
			className={`react-stockcharts-tooltip-hover ${className}`}
			transform={`translate(${x}, ${y})`}
			onClick={onClick}
		>
			<ToolTipText
				x={0}
				y={0}
				fontFamily={fontFamily}
				fontSize={fontSize}
			>
				<ToolTipTSpanLabel
					fill={labelFill}
					key="label"
					x={0}
					dy="5">Date: </ToolTipTSpanLabel>
				<tspan key="value" fill={textFill}>{displayDate}</tspan>
				<ToolTipTSpanLabel fill={labelFill} key="label_O"> O: </ToolTipTSpanLabel>
				<tspan key="value_O" fill={textFill}>{open}</tspan>
				<ToolTipTSpanLabel fill={labelFill} key="label_H"> H: </ToolTipTSpanLabel>
				<tspan key="value_H" fill={textFill}>{high}</tspan>
				<ToolTipTSpanLabel fill={labelFill} key="label_L"> L: </ToolTipTSpanLabel>
				<tspan key="value_L" fill={textFill}>{low}</tspan>
				<ToolTipTSpanLabel fill={labelFill} key="label_C"> C:</ToolTipTSpanLabel>
				<tspan key="value_C" fill={textFill}>{close}</tspan>
				<ToolTipTSpanLabel fill={labelFill} key="label_Vol"> Vol: </ToolTipTSpanLabel>
				<tspan key="value_Vol" fill={textFill}>{volume}</tspan>
			</ToolTipText>
		</g>
	);
}

export default OHLCTooltip;
