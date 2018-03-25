

import { format } from "d3-format";
import React, { Component } from "react";
import PropTypes from "prop-types";
import displayValuesFor from "./displayValuesFor";
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
		const { onClick, fontFamily, fontSize, yAccessor, displayFormat, label } = this.props;
		const { className, options, appearance, labelFill } = this.props;
		const { displayValuesFor } = this.props;
		const { chartConfig: { width, height } } = moreProps;

		const currentItem = displayValuesFor(this.props, moreProps);
		const { stroke } = appearance;
		const stochastic = currentItem && yAccessor(currentItem);

		const K = (stochastic && stochastic.K && displayFormat(stochastic.K)) || "n/a";
		const D = (stochastic && stochastic.D && displayFormat(stochastic.D)) || "n/a";

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

		return (
			<g className={className} transform={`translate(${ x }, ${ y })`} onClick={onClick}>
				<ToolTipText x={0} y={0} fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel fill={labelFill}>{`${ label } %K(`}</ToolTipTSpanLabel>
					<tspan fill={stroke.kLine}>{`${options.windowSize}, ${options.kWindowSize}`}</tspan>
					<ToolTipTSpanLabel fill={labelFill}>): </ToolTipTSpanLabel>
					<tspan fill={stroke.kLine}>{K}</tspan>
					<ToolTipTSpanLabel fill={labelFill}> %D (</ToolTipTSpanLabel>
					<tspan fill={stroke.dLine}>{options.dWindowSize}</tspan>
					<ToolTipTSpanLabel fill={labelFill}>): </ToolTipTSpanLabel>
					<tspan fill={stroke.dLine}>{D}</tspan>
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

StochasticTooltip.propTypes = {
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	className: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	labelFill: PropTypes.string,

	onClick: PropTypes.func,
	yAccessor: PropTypes.func.isRequired,
	options: PropTypes.shape({
		windowSize: PropTypes.number.isRequired,
		kWindowSize: PropTypes.number.isRequired,
		dWindowSize: PropTypes.number.isRequired,
	}).isRequired,
	appearance: PropTypes.shape({
		stroke: {
			dLine: PropTypes.string.isRequired,
			kLine: PropTypes.string.isRequired,
		}.isRequired,
	}).isRequired,
	displayFormat: PropTypes.func.isRequired,
	displayValuesFor: PropTypes.func,
	label: PropTypes.string.isRequired,
};

StochasticTooltip.defaultProps = {
	displayFormat: format(".2f"),
	displayValuesFor: displayValuesFor,
	origin: [0, 0],
	className: "react-stockcharts-tooltip",
	label: "STO",
};

export default StochasticTooltip;
