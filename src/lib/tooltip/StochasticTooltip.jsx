"use strict";

import d3 from "d3";
import React, { PropTypes, Component } from "react";

import { first } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class StochasticTooltip extends Component {
	render() {
		var { forChart, onClick, fontFamily, fontSize, calculator, displayFormat, children } = this.props;
		var { chartConfig, currentItem, width, height } = this.context;

		var yAccessor = calculator.accessor();
		var stroke = calculator.stroke();
		var config = first(chartConfig.filter(each => each.id === forChart));
		var stochastic = currentItem && yAccessor(currentItem);

		var K = (stochastic && stochastic.K && displayFormat(stochastic.K)) || "n/a";
		var D = (stochastic && stochastic.D && displayFormat(stochastic.D)) || "n/a";
		var label = children || "Stochastic";

		var { origin: originProp } = this.props;
		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);
		var [ox, oy] = config.origin;

		return (
			<g transform={`translate(${ ox + x }, ${ oy + y })`} onClick={onClick}>
				<ToolTipText x={0} y={0} fontFamily={fontFamily} fontSize={fontSize}>
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
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};

StochasticTooltip.propTypes = {
	forChart: PropTypes.number.isRequired,
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	onClick: PropTypes.func,
	calculator: PropTypes.func.isRequired,
	displayFormat: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
};

StochasticTooltip.defaultProps = {
	displayFormat: d3.format(".2f"),
	origin: [0, 0]
};

export default StochasticTooltip;
