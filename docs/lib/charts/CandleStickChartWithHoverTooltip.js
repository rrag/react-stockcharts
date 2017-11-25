import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	CandlestickSeries,
	LineSeries
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { EdgeIndicator } from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import { ema } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format(".2f");

function tooltipContent(ys) {
	return ({ currentItem, xAccessor }) => {
		return {
			x: dateFormat(xAccessor(currentItem)),
			y: [
				{
					label: "open",
					value: currentItem.open && numberFormat(currentItem.open)
				},
				{
					label: "high",
					value: currentItem.high && numberFormat(currentItem.high)
				},
				{
					label: "low",
					value: currentItem.low && numberFormat(currentItem.low)
				},
				{
					label: "close",
					value: currentItem.close && numberFormat(currentItem.close)
				}
			]
				.concat(
					ys.map(each => ({
						label: each.label,
						value: each.value(currentItem),
						stroke: each.stroke
					}))
				)
				.filter(line => line.value)
		};
	};
}

const keyValues = ["high", "low"];

class CandleStickChartWithHoverTooltip extends React.Component {
	removeRandomValues(data) {
		return data.map(item => {
			const newItem = { ...item };
			const numberOfDeletion =
				Math.floor(Math.random() * keyValues.length) + 1;
			for (let i = 0; i < numberOfDeletion; i += 1) {
				const randomKey =
					keyValues[Math.floor(Math.random() * keyValues.length)];
				newItem[randomKey] = undefined;
			}
			return newItem;
		});
	}

	render() {
		let { type, data: initialData, width, ratio } = this.props;

		// remove some of the data to be able to see
		// the tooltip resize
		initialData = this.removeRandomValues(initialData);

		const ema20 = ema()
			.id(0)
			.options({ windowSize: 20 })
			.merge((d, c) => {
				d.ema20 = c;
			})
			.accessor(d => d.ema20);

		const ema50 = ema()
			.id(2)
			.options({ windowSize: 50 })
			.merge((d, c) => {
				d.ema50 = c;
			})
			.accessor(d => d.ema50);

		const margin = { left: 80, right: 80, top: 30, bottom: 50 };

		const calculatedData = ema50(ema20(initialData));
		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
			d => d.date
		);
		const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
			calculatedData
		);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
			<ChartCanvas
				height={400}
				width={width}
				ratio={ratio}
				margin={margin}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart
					id={1}
					yExtents={[
						d => [d.high, d.low],
						ema20.accessor(),
						ema50.accessor()
					]}
					padding={{ top: 10, bottom: 20 }}
				>
					<XAxis axisAt="bottom" orient="bottom" />

					<YAxis axisAt="right" orient="right" ticks={5} />

					<CandlestickSeries />
					<LineSeries
						yAccessor={ema20.accessor()}
						stroke={ema20.stroke()}
					/>
					<LineSeries
						yAccessor={ema50.accessor()}
						stroke={ema50.stroke()}
					/>

					<EdgeIndicator
						itemType="last"
						orient="right"
						edgeAt="right"
						yAccessor={d => d.close}
						fill={d => (d.close > d.open ? "#6BA583" : "#FF0000")}
					/>

					<HoverTooltip
						yAccessor={ema50.accessor()}
						tooltipContent={tooltipContent([
							{
								label: `${ema20.type()}(${ema20.options()
									.windowSize})`,
								value: d => numberFormat(ema20.accessor()(d)),
								stroke: ema20.stroke()
							},
							{
								label: `${ema50.type()}(${ema50.options()
									.windowSize})`,
								value: d => numberFormat(ema50.accessor()(d)),
								stroke: ema50.stroke()
							}
						])}
						fontSize={15}
					/>
				</Chart>
				<Chart
					id={2}
					yExtents={[d => d.volume]}
					height={150}
					origin={(w, h) => [0, h - 150]}
				>
					<YAxis
						axisAt="left"
						orient="left"
						ticks={5}
						tickFormat={format(".2s")}
					/>

					<BarSeries
						yAccessor={d => d.volume}
						fill={d => (d.close > d.open ? "#6BA583" : "#FF0000")}
					/>
				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickChartWithHoverTooltip.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChartWithHoverTooltip.defaultProps = {
	type: "svg"
};
CandleStickChartWithHoverTooltip = fitWidth(CandleStickChartWithHoverTooltip);

export default CandleStickChartWithHoverTooltip;
