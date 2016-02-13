"use strict";

import React from "react";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";
import { first, isDefined } from "../utils/utils";
import identity from "../utils/identity";
import noop from "../utils/noop";

class SingleValueTooltip extends React.Component {
	render() {

		var { forChart, onClick, fontFamily, fontSize, labelStroke, valueStroke, displayFormat } = this.props;
		var { xDisplayFormat, yDisplayFormat, xLabel, yLabel, xAccessor, yAccessor } = this.props;

		var { chartConfig, currentItem, width, height } = this.context;

		var config = first(chartConfig.filter(each => each.id === forChart));

		var xDisplayValue = isDefined(xAccessor(currentItem)) ? xDisplayFormat(xAccessor(currentItem)) : "n/a";
		var yDisplayValue = isDefined(yAccessor(currentItem)) ? yDisplayFormat(yAccessor(currentItem)) : "n/a";

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
	chartConfig: React.PropTypes.array.isRequired,
	currentItem: React.PropTypes.object.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
};

SingleValueTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	xDisplayFormat: React.PropTypes.func,
	yDisplayFormat: React.PropTypes.func.isRequired,
	xLabel: React.PropTypes.string,
	yLabel: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.func
	]).isRequired,
	labelStroke: React.PropTypes.string.isRequired,
	valueStroke: React.PropTypes.string,
	origin: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.func
	]).isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	onClick: React.PropTypes.func,
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
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
