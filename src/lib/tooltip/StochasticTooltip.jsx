"use strict";

import d3 from "d3";
import React, { PropTypes, Component } from "react";
import GenericChartComponent from "../GenericChartComponent";

import { first } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class StochasticTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {
		var { onClick, fontFamily, fontSize, calculator, displayFormat, children } = this.props;
		var { width, height } = this.context;
		var { currentItem } = moreProps;

		var yAccessor = calculator.accessor();
		var stroke = calculator.stroke();
		var stochastic = currentItem && yAccessor(currentItem);

		var K = (stochastic && stochastic.K && displayFormat(stochastic.K)) || "n/a";
		var D = (stochastic && stochastic.D && displayFormat(stochastic.D)) || "n/a";
		var label = children || "Stochastic";

		var { origin: originProp } = this.props;
		var origin = d3.functor(originProp);
		var [x, y] = origin(width, height);

		return (
			<g transform={`translate(${ x }, ${ y })`} onClick={onClick}>
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
	render() {
		return <GenericChartComponent
			clip={false}
			svgDraw={this.renderSVG}
			drawOnMouseMove
			/>;
	}
}

StochasticTooltip.contextTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};

StochasticTooltip.propTypes = {
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
