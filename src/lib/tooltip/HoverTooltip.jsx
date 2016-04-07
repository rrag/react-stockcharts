"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import { first, last, isDefined, isNotDefined } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class HoverTooltip extends Component {
	render() {
		var { forChart, fontFamily, fontSize, backgroundShapeSVG, origin, height, width } = this.props;
		var { tooltipContent } = this.props;
		var { chartConfig, currentItem, width: chartWidth, height: chartHeight, mouseXY } = this.context;
		var { show, panInProgress, xAccessor, xScale, displayXAccessor, plotData } = this.context;

		var xValue = xAccessor(currentItem);
		if (!show || panInProgress || isNotDefined(xValue)) return null;

		var [x, y] = origin({mouseXY, height, width, chartHeight, chartWidth, xValue, xScale});

		var content = tooltipContent({ currentItem, xAccessor: displayXAccessor });
		var bgX = xScale(xValue)
		var drawWidth = Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData)))) / (plotData.length - 1);
		return (
			<g>
				<rect x={bgX - drawWidth / 2} y={0} width={drawWidth} height={chartHeight} fill="#CDDDFB" opacity={0.4} />
				<g transform={`translate(${x}, ${y})`}>
					{backgroundShapeSVG({height, width})}
					{tooltipSVG({content, fontFamily, fontSize})}
				</g>
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
	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	displayXAccessor: PropTypes.func.isRequired,
	show: PropTypes.bool,
	plotData: PropTypes.array,
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
	tooltipSVG: tooltipSVG,
	origin: origin,
	backgroundShapeSVG: ({height, width}) => <rect height={height} width={width} fill="#D4E2FD" opacity={0.8} stroke="steelblue" />,
	backgroundShapeCanvas: ({height, width, ctx}) => { console.log("HERE") },
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,

};

const PADDING = 5;

function tooltipSVG({content, fontFamily, fontSize}) {
	var tspans = [];
	for (var i = 0; i < content.y.length; i++) {
		let y = content.y[i]
		tspans.push(<tspan key={`L-${i}`} x={10} dy={fontSize} fill={y.stroke}>{y.label}</tspan>);
		tspans.push(<tspan key={`${i}`}>: </tspan>);
		tspans.push(<tspan key={`V-${i}`}>{y.value}</tspan>);
	};
	return <text fontFamily={fontFamily} fontSize={fontSize}>
		<tspan x={10} y={15}>{content.x}</tspan>
		{tspans}
	</text>
}

function origin({mouseXY, height, width, chartHeight, chartWidth, xValue, xScale}) {
	var [x, y] = mouseXY;

	var snapX = xScale(xValue);
	var originX = (snapX - width - PADDING * 2 < 0) ? snapX + PADDING : snapX - width - PADDING;
	// originX = (x - width - PADDING * 2 < 0) ? x + PADDING : x - width - PADDING;

	var originY = y - height / 2;
	return [originX, originY];
}

export default HoverTooltip;
