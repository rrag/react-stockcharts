"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from "react-stockcharts";

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries } = series;
var { discontinuousTimeScaleProvider } = scale;

var { EdgeIndicator } = coordinates;
var { CurrentCoordinate } = coordinates;

var { OHLCTooltip, MovingAverageTooltip, HoverTooltip } = tooltip;
var { XAxis, YAxis } = axes;
var { ema, sma } = indicator;
var { fitWidth } = helper;

var dateFormat = timeFormat("%Y-%m-%d");
var numberFormat = format(".2f");

function tooltipContent(calculators) {
	return ({ currentItem, xAccessor }) => {
		return {
			x: dateFormat(xAccessor(currentItem)),
			y: [
				{ label: "open", value: currentItem.open && numberFormat(currentItem.open) },
				{ label: "high", value: currentItem.high && numberFormat(currentItem.high) },
				{ label: "low", value: currentItem.low && numberFormat(currentItem.low) },
				{ label: "close", value: currentItem.close && numberFormat(currentItem.close) },
			]
			.concat(calculators.map(each => ({
				label: each.tooltipLabel(),
				value: numberFormat(each.accessor()(currentItem)),
				stroke: each.stroke()
			})))
			.filter(line => line.value)
		};
	};
}

const keyValues = ["high", "low", "open"];

class CandleStickChartWithHoverTooltip extends React.Component {

	removeRandomValues(data) {
		return data.map((item) => {
			const numberOfDeletion = Math.floor(Math.random() * keyValues.length) + 1;
			for (let i = 0; i < numberOfDeletion; i += 1){
				const randomKey = keyValues[Math.floor(Math.random() * keyValues.length)];
				item[randomKey] = undefined;
			}
			return item;
		});
	}

	render() {
		var { data, type, width, ratio } = this.props;

		// remove some of the data to be able to see
		// the tooltip resize
		data = this.removeRandomValues(data);

		var ema20 = ema()
			.id(0)
			.windowSize(20)
			.merge((d, c) => {d.ema20 = c;})
			.accessor(d => d.ema20);

		var ema50 = ema()
			.id(2)
			.windowSize(50)
			.merge((d, c) => {d.ema50 = c;})
			.accessor(d => d.ema50);

		var margin = { left: 80, right: 80, top: 30, bottom: 50 };

		return (
			<ChartCanvas ratio={ratio} height={400}
					width={width}
					margin={margin}
					type={type}
					seriesName="MSFT"
					data={data}
					calculator={[ema20, ema50]}
					xAccessor={d => d.date}
					xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2015, 0, 1), new Date(2015, 5, 8)]}>

				<Chart id={1}
						yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>

					<YAxis axisAt="right" orient="right" ticks={5} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<EdgeIndicator itemType="last"
						orient="right"
						edgeAt="right"
						yAccessor={d => d.close}
						fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

				</Chart>
				<Chart id={2}
						yExtents={[d => d.volume]}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")}/>

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
				</Chart>
				<HoverTooltip
					chartId={1}
					yAccessor={ema50.accessor()}
					tooltipContent={tooltipContent([ema20, ema50])}
					fontSize={15} />
			</ChartCanvas>
		);
	}
}

CandleStickChartWithHoverTooltip.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithHoverTooltip.defaultProps = {
	type: "svg",
};
CandleStickChartWithHoverTooltip = fitWidth(CandleStickChartWithHoverTooltip);

export default CandleStickChartWithHoverTooltip;
