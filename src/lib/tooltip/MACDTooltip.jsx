"use strict";

import { format } from "d3-format";
import React, { PropTypes, Component } from "react";
import GenericChartComponent from "../GenericChartComponent";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";
import { functor } from "../utils";

class MACDTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {
		const { onClick, fontFamily, fontSize, displayFormat, className } = this.props;
		const { yAccessor, options, appearance } = this.props;
		const { chartConfig: { width, height } } = moreProps;
		const { currentItem } = moreProps;

		const macdValue = currentItem && yAccessor(currentItem);

		const macd = (macdValue && macdValue.macd && displayFormat(macdValue.macd)) || "n/a";
		const signal = (macdValue && macdValue.signal && displayFormat(macdValue.signal)) || "n/a";
		const divergence = (macdValue && macdValue.divergence && displayFormat(macdValue.divergence)) || "n/a";

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

		return (
			<g className={className} transform={`translate(${ x }, ${ y })`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel>MACD (</ToolTipTSpanLabel>
					<tspan fill={appearance.stroke.macd}>{options.slow}</tspan>
					<ToolTipTSpanLabel>, </ToolTipTSpanLabel>
					<tspan fill={appearance.stroke.macd}>{options.fast}</tspan>
					<ToolTipTSpanLabel>): </ToolTipTSpanLabel>
					<tspan fill={appearance.stroke.macd}>{macd}</tspan>
					<ToolTipTSpanLabel> Signal (</ToolTipTSpanLabel>
					<tspan fill={appearance.stroke.signal}>{options.signal}</tspan>
					<ToolTipTSpanLabel>): </ToolTipTSpanLabel>
					<tspan fill={appearance.stroke.signal}>{signal}</tspan>
					<ToolTipTSpanLabel> Divergence: </ToolTipTSpanLabel>
					<tspan fill={appearance.fill.divergence}>{divergence}</tspan>
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

MACDTooltip.propTypes = {
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	className: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	yAccessor: PropTypes.func.isRequired,
	options: PropTypes.shape({
		slow: PropTypes.number.isRequired,
		fast: PropTypes.number.isRequired,
		signal: PropTypes.number.isRequired,
	}).isRequired,
	appearance: PropTypes.shape({
		stroke: {
			macd: PropTypes.string.isRequired,
			signal: PropTypes.string.isRequired,
		}.isRequired,
		fill: PropTypes.shape({
			divergence: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
	displayFormat: PropTypes.func.isRequired,
	onClick: PropTypes.func,
};

MACDTooltip.defaultProps = {
	origin: [0, 0],
	displayFormat: format(".2f"),
	className: "react-stockcharts-toottip",
};

export default MACDTooltip;
// export default MACDTooltip;
