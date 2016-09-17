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

		var { onClick, fontFamily, fontSize, labelStroke, valueStroke } = this.props;
		var { xDisplayFormat, yDisplayFormat, xLabel, yLabel, xAccessor, yAccessor } = this.props;

		var { width, height } = this.context;
		var { currentItem } = moreProps;

		var xDisplayValue = isDefined(currentItem) && isDefined(xAccessor(currentItem)) ? xDisplayFormat(xAccessor(currentItem)) : "n/a";
		var yDisplayValue = isDefined(currentItem) && isDefined(yAccessor(currentItem)) ? yDisplayFormat(yAccessor(currentItem)) : "n/a";

		var { origin: originProp } = this.props;
		var origin = functor(originProp);
		var [x, y] = origin(width, height);

		return (
			<g transform={`translate(${ x }, ${ y })`} onClick={onClick}>
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
			drawOnMouseMove
			/>;
	}
}

SingleValueTooltip.contextTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};

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
};

export default SingleValueTooltip;
