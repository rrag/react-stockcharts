"use strict";

import React, { PropTypes, Component } from "react";
import { format } from "d3-format";

import GenericChartComponent from "../GenericChartComponent";

import { isDefined, functor } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class BollingerBandTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {
		const { onClick, displayFormat, yAccessor, options } = this.props;
		const { chartConfig: { width, height } } = moreProps;
		const { currentItem } = moreProps;

		let top, middle, bottom;
		top = middle = bottom = "n/a";

		if (isDefined(currentItem)
				&& isDefined(yAccessor(currentItem))) {
			const item = yAccessor(currentItem);
			top = displayFormat(item.top);
			middle = displayFormat(item.middle);
			bottom = displayFormat(item.bottom);
		}

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

		const { sourcePath, windowSize, multiplier, movingAverageType } = options;
		const tooltipLabel = `BB(${sourcePath}, ${windowSize}, ${multiplier}, ${movingAverageType}): `;
		const tooltipValue = `${top}, ${middle}, ${bottom}`;
		return (
			<g transform={`translate(${ x }, ${ y })`}
					className={this.props.className} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel>{tooltipLabel}</ToolTipTSpanLabel>
					<tspan>{tooltipValue}</tspan>
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

BollingerBandTooltip.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	displayFormat: PropTypes.func.isRequired,
	origin: PropTypes.array.isRequired,
	onClick: PropTypes.func,
	options: PropTypes.shape({
		sourcePath: PropTypes.string.isRequired,
		windowSize: PropTypes.number.isRequired,
		multiplier: PropTypes.number.isRequired,
		movingAverageType: PropTypes.string.isRequired,
	}).isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
};

BollingerBandTooltip.defaultProps = {
	className: "react-stockcharts-toottip react-stockcharts-bollingerband-tooltip",
	displayFormat: format(".2f"),
	origin: [0, 10],
};

export default BollingerBandTooltip;
