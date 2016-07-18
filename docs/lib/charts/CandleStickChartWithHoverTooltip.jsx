"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { EdgeIndicator } = ReStock.coordinates;
var { CurrentCoordinate } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, HoverTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { ema, sma } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

var dateFormat = d3.time.format("%Y-%m-%d");
var numberFormat = d3.format(".2f");

function tooltipContent(calculators) {
	return ({currentItem, xAccessor}) => {
		return {
			x: dateFormat(xAccessor(currentItem)),
			y: [
				{ label: "open", value: numberFormat(currentItem.open) },
				{ label: "high", value: numberFormat(currentItem.high) },
				{ label: "low", value: numberFormat(currentItem.low) },
				{ label: "close", value: numberFormat(currentItem.close) },
			].concat(calculators.map(each => ({
				label: each.tooltipLabel(),
				value: numberFormat(each.accessor()(currentItem)),
				stroke: each.stroke()
			})))
		}
	}
}

class CandleStickChartWithHoverTooltip extends React.Component {
	render() {
		var { data, type, width } = this.props;

		var ema20 = ema()
			.id(0)
			.windowSize(20)
			.merge((d, c) => {d.ema20 = c})
			.accessor(d => d.ema20);

		var ema50 = ema()
			.id(2)
			.windowSize(50)
			.merge((d, c) => {d.ema50 = c})
			.accessor(d => d.ema50);

		var annotationProps = {
			fontFamily: "Glyphicons Halflings",
			fontSize: 20,
			fill: "#060F8F",
			opacity: 0.8,
			text: "\ue093",
			y: ({ yScale }) => (yScale.range()[0] - 10)
		};

		var margin = {left: 80, right: 80, top:30, bottom: 50};
		var height = 400;

		var [yAxisLabelX, yAxisLabelY] = [width -margin.left - 40, margin.top + (height - margin.top - margin.bottom) / 2]
		return (
			<ChartCanvas width={width} height={height}
					margin={margin} type={type}
					seriesName="MSFT"
					data={data} calculator={[ema20, ema50]}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2015, 0, 1), new Date(2015, 5, 8)]}>

				<Chart id={1}
						yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>

					<YAxis axisAt="right" orient="right" ticks={5} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
				</Chart>
				<Chart id={2}
						yExtents={[d => d.volume]}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
				</Chart>
				<HoverTooltip tooltipContent={tooltipContent([ema20, ema50])} bgwidth={120} bgheight={95} />
				<EventCapture mouseMove zoom pan useCrossHairStyle={false} />
			</ChartCanvas>
		);
	}
}

CandleStickChartWithHoverTooltip.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithHoverTooltip.defaultProps = {
	type: "svg",
};
CandleStickChartWithHoverTooltip = fitWidth(CandleStickChartWithHoverTooltip);

export default CandleStickChartWithHoverTooltip;
