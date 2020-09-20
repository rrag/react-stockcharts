

import { format } from "d3-format";
import React, { Component } from "react";
import PropTypes from "prop-types";
import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";

import { isDefined, functor } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class ADXTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {
		const { onClick, fontFamily, fontSize, yAccessor, displayFormat, className } = this.props;
		const { options, labelFill, textFill } = this.props;
		const { displayValuesFor } = this.props;
		const { chartConfig: { width, height } } = moreProps;

		const currentItem = displayValuesFor(this.props, moreProps);
		const adx = isDefined(currentItem) && yAccessor(currentItem);
		const plusDI = (adx && displayFormat(adx.plusDI)) || "n/a";
		const minusDI = (adx && displayFormat(adx.minusDI)) || "n/a";
		const adxVal = (adx && displayFormat(adx.adxValue)) || "n/a";

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

		const tooltipLabel = `ADX (${options.windowSize}): `;
		const plusDILabel = `DIP (${options.windowSize}): `;
		const minusDILabel = `DIM (${options.windowSize}): `;

		return (
			<g className={className} transform={`translate(${x}, ${y})`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel fill={labelFill}>{tooltipLabel}</ToolTipTSpanLabel>
					<tspan fill={textFill}>{adxVal}</tspan>
				</ToolTipText>
				<ToolTipText x={0} y={14}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel fill={labelFill}>{plusDILabel}</ToolTipTSpanLabel>
					<tspan fill={textFill}>{plusDI}</tspan>
				</ToolTipText>
				<ToolTipText x={0} y={28}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel fill={labelFill}>{minusDILabel}</ToolTipTSpanLabel>
					<tspan fill={textFill}>{minusDI}</tspan>
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

ADXTooltip.propTypes = {
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	options: PropTypes.shape({
		windowSize: PropTypes.number.isRequired,
	}).isRequired,
	className: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	onClick: PropTypes.func,
	yAccessor: PropTypes.func.isRequired,
	displayFormat: PropTypes.func.isRequired,
	displayValuesFor: PropTypes.func,
	textFill: PropTypes.string,
	labelFill: PropTypes.string,
};

ADXTooltip.defaultProps = {
	displayFormat: format(".2f"),
	displayValuesFor: displayValuesFor,
	origin: [0, 0],
	className: "react-stockcharts-tooltip",
};

export default ADXTooltip;