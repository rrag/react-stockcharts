"use strict";

import React from "react";

import { first } from "../utils/utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class StochasticTooltip extends React.Component {
	render() {
		var { forChart, onClick, fontFamily, fontSize, calculator, displayFormat, children } = this.props;
		var { chartConfig, currentItem, width, height } = this.context;

		var yAccessor = calculator.accessor();
		var stroke = calculator.stroke();
		var config = first(chartConfig.filter(each => each.id === forChart));
		var stochastic = yAccessor(currentItem);

		var K = (stochastic && stochastic.K && displayFormat(stochastic.K)) || "n/a";
		var D = (stochastic && stochastic.D && displayFormat(stochastic.D)) || "n/a";
		var label = children || "Stochastic";

		var { origin: originProp } = this.props;
		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);
		var [ox, oy] = config.origin;

		return (
			<g transform={`translate(${ ox + x }, ${ oy + y })`} onClick={onClick}>
				<ToolTipText x={0} y={0} fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel>{`${ label } %K(`}</ToolTipTSpanLabel>
					<tspan fill={stroke.K}>{`${ calculator.windowSize() }, ${ calculator.kWindowSize() }`}</tspan>
					<ToolTipTSpanLabel>): </ToolTipTSpanLabel>
					<tspan fill={stroke.K}>{K}</tspan>
					<ToolTipTSpanLabel> %D (</ToolTipTSpanLabel>
					<tspan fill={stroke.D}>{calculator.dWindowSize()}</tspan>
					<ToolTipTSpanLabel>): </ToolTipTSpanLabel>
					<tspan fill={stroke.D}>{D}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

StochasticTooltip.contextTypes = {
	chartConfig: React.PropTypes.array.isRequired,
	currentItem: React.PropTypes.object.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
};

StochasticTooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	origin: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.func
	]).isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	onClick: React.PropTypes.func,
	calculator: React.PropTypes.func.isRequired,
	children: React.PropTypes.node.isRequired,
};

StochasticTooltip.defaultProps = {
	displayFormat: d3.format(".2f"),
	origin: [0, 0]
};

export default StochasticTooltip;
