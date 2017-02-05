"use strict";

import React, { PropTypes, Component } from "react";
import { format } from "d3-format";

import GenericChartComponent from "../GenericChartComponent";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";
import { isDefined, identity, noop, functor } from "../utils";

class SingleValueTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {

		const { onClick, fontFamily, fontSize, labelStroke, valueStroke, className } = this.props;
		const { xDisplayFormat, yDisplayFormat, xLabel, yLabel, xAccessor, yAccessor } = this.props;

		const { chartConfig: { width, height } } = moreProps;
		const { currentItem } = moreProps;

		const xDisplayValue = isDefined(currentItem) && isDefined(xAccessor(currentItem)) ? xDisplayFormat(xAccessor(currentItem)) : "n/a";
		const yDisplayValue = isDefined(currentItem) && isDefined(yAccessor(currentItem)) ? yDisplayFormat(yAccessor(currentItem)) : "n/a";

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

		return (
			<g className={className} transform={`translate(${ x }, ${ y })`} onClick={onClick}>
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
	render() {
		return <GenericChartComponent
			clip={false}
			svgDraw={this.renderSVG}
			drawOn={["mousemove"]}
			/>;
	}
}

SingleValueTooltip.propTypes = {
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
	className: PropTypes.string,
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
	yDisplayFormat: format(".2f"),
	xAccessor: noop,
	yAccessor: identity,
	className: "react-stockcharts-toottip",
};

export default SingleValueTooltip;
