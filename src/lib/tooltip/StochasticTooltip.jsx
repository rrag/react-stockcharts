"use strict";

import { format } from "d3-format";
import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericChartComponent from "../GenericChartComponent";

import { functor } from "../utils";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class StochasticTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {
		var { onClick, fontFamily, fontSize, calculator, displayFormat, children } = this.props;
		var { className } = this.props;
		var { chartConfig: { width, height } } = moreProps;
		var { currentItem } = moreProps;

		var yAccessor = calculator.accessor();
		var stroke = calculator.stroke();
		var stochastic = currentItem && yAccessor(currentItem);

		var K = (stochastic && stochastic.K && displayFormat(stochastic.K)) || "n/a";
		var D = (stochastic && stochastic.D && displayFormat(stochastic.D)) || "n/a";
		var label = children || "Stochastic";

		var { origin: originProp } = this.props;
		var origin = functor(originProp);
		var [x, y] = origin(width, height);

		return (
			<g className={className} transform={`translate(${ x }, ${ y })`} onClick={onClick}>
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

StochasticTooltip.propTypes = {
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	className: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	onClick: PropTypes.func,
	calculator: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]).isRequired,
	displayFormat: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
};

StochasticTooltip.defaultProps = {
	displayFormat: format(".2f"),
	origin: [0, 0],
	className: "react-stockcharts-toottip",
};

export default StochasticTooltip;
