"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import { first, isDefined } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";



class HoverTooltip extends Component {
	render() {
		var { forChart, fontFamily, fontSize, backgroundShapeSVG, origin, height, width } = this.props;
		var { tooltipContent } = this.props;
		var { chartConfig, currentItem, width: chartWidth, height: chartHeight, mouseXY } = this.context;
		var { show, panInProgress } = this.context;

		if (!show || panInProgress) return null;

		var [x, y] = origin({mouseXY, height, width, chartHeight, chartWidth});

		var content = tooltipContent(currentItem);
		return (
			<g transform={`translate(${x}, ${y})`}>
				{backgroundShapeSVG({height, width})}
				{tooltipSVG({content, fontFamily, fontSize})}
			</g>
		);
	}
}

HoverTooltip.contextTypes = {
	chartConfig: PropTypes.array.isRequired,
	currentItem: PropTypes.object.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	mouseXY: PropTypes.array,
	panInProgress: PropTypes.bool.isRequired,
	show: PropTypes.bool,
};

HoverTooltip.propTypes = {
	// forChart: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	tooltipContent: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.func
	]).isRequired,
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
};

HoverTooltip.defaultProps = {
	width: 150,
	height: 50,
	tooltipContent: ({currentItem}) => ({x: "XValue", y:[{ label: "yLabel", value: 30, stroke: "yellow"}]}),
	tooltipSVG: tooltipSVG,
	origin: origin,
	backgroundShapeSVG: ({height, width}) => <rect height={height} width={width} fill="steelblue" opacity={0.6} stroke="steelblue" />,
	backgroundShapeCanvas: ({height, width, ctx}) => { console.log("HERE") },
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,

};

const PADDING = 5;

function tooltipSVG({content, fontFamily, fontSize}) {
	return <text fontFamily={fontFamily} fontSize={fontSize}>
		<tspan x={10} y={15}>SomeXValue</tspan>
		<tspan x={10} dy={fontSize}>SomeyValue</tspan>
		<tspan x={10} dy={fontSize}>SomeyValue</tspan>
	</text>
}

function origin({mouseXY, height, width, chartHeight, chartWidth}) {
	var [x, y] = mouseXY;
	var originX = (x - width - PADDING * 2 < 0) ? x + PADDING : x - width - PADDING;
	var originY = y - height / 2;
	return [originX, originY];
}

export default HoverTooltip;
