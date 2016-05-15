"use strict";

import d3 from "d3";
import React, { PropTypes, Component } from "react";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";
import { first, isDefined, identity, noop } from "../utils";

class SingleValueTooltip extends Component {
	render() {

		var { forChart, onClick, fontFamily, fontSize, labelStroke, valueStroke } = this.props;
		var { xDisplayFormat, yDisplayFormat, xLabel, yLabel, xAccessor, yAccessor } = this.props;

		var { chartConfig, currentItem, width, height } = this.context;

		var config = first(chartConfig.filter(each => each.id === forChart));

		var xDisplayValue = isDefined(currentItem) && isDefined(xAccessor(currentItem)) ? xDisplayFormat(xAccessor(currentItem)) : "n/a";
		var yDisplayValue = isDefined(currentItem) && isDefined(yAccessor(currentItem)) ? yDisplayFormat(yAccessor(currentItem)) : "n/a";

		var { origin: originProp } = this.props;
		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);
		var [ox, oy] = config.origin;

		return (
			<g transform={`translate(${ ox + x }, ${ oy + y })`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					{ xLabel ? <ToolTipTSpanLabel x={0} dy="5" fill={labelStroke}>{`${xLabel}: `}</ToolTipTSpanLabel> : null}
					{ xLabel ? <tspan fill={valueStroke}>{`${xDisplayValue} `}</tspan> : null}
					<ToolTipTSpanLabel fill={labelStroke}>{`${yLabel}: `}</ToolTipTSpanLabel>
					<tspan fill={valueStroke} >{yDisplayValue}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

SingleValueTooltip.contextTypes = {
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};

SingleValueTooltip.propTypes = {
	forChart: PropTypes.number.isRequired,
	xDisplayFormat: PropTypes.func,
	yDisplayFormat: PropTypes.func.isRequired,
	xLabel: PropTypes.string,
	yLabel: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func
	]).isRequired,
	labelStroke: PropTypes.string.isRequired,
	valueStroke: PropTypes.string,
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	onClick: PropTypes.func,
	xAccessor: PropTypes.func,
	yAccessor: PropTypes.func,
};

SingleValueTooltip.defaultProps = {
	origin: [0, 0],
	labelStroke: "#4682B4",
	valueStroke: "#000000",
	yDisplayFormat: d3.format(".2f"),
	xAccessor: noop,
	yAccessor: identity,
};

export default SingleValueTooltip;
