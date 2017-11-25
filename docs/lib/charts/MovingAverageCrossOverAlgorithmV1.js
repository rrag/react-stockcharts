
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	CandlestickSeries,
	LineSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	OHLCTooltip,
	MovingAverageTooltip,
} from "react-stockcharts/lib/tooltip";
import { ema } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import algo from "react-stockcharts/lib/algorithm";
import {
	Label,
	Annotate,
	LabelAnnotation,
} from "react-stockcharts/lib/annotation";
import { last } from "react-stockcharts/lib/utils";

class MovingAverageCrossOverAlgorithmV1 extends React.Component {
	render() {
		const { type, data: initialData, width, ratio } = this.props;

		const ema20 = ema()
			.id(0)
			.options({ windowSize: 13 })
			.merge((d, c) => { d.ema20 = c; })
			.accessor(d => d.ema20);

		const ema50 = ema()
			.id(2)
			.options({ windowSize: 50 })
			.merge((d, c) => { d.ema50 = c; })
			.accessor(d => d.ema50);

		const buySell = algo()
			.windowSize(2)
			.accumulator(([prev, now]) => {
				const { ema20: prevShortTerm, ema50: prevLongTerm } = prev;
				const { ema20: nowShortTerm, ema50: nowLongTerm } = now;
				if (prevShortTerm < prevLongTerm && nowShortTerm > nowLongTerm) return "LONG";
				if (prevShortTerm > prevLongTerm && nowShortTerm < nowLongTerm) return "SHORT";
			})
			.merge((d, c) => { d.longShort = c; });

		const defaultAnnotationProps = {
			fontFamily: "Glyphicons Halflings",
			fontSize: 20,
			opacity: 0.8,
			onClick: console.log.bind(console),
		};

		const longAnnotationProps = {
			...defaultAnnotationProps,
			fill: "#006517",
			text: "\ue093",
			y: ({ yScale, datum }) => yScale(datum.low) + 20,
			tooltip: "Go long",
		};

		const shortAnnotationProps = {
			...defaultAnnotationProps,
			fill: "#E20000",
			text: "\ue094",
			y: ({ yScale, datum }) => yScale(datum.high),
			tooltip: "Go short",
		};

		const margin = { left: 80, right: 80, top: 30, bottom: 50 };
		const height = 400;

		const [yAxisLabelX, yAxisLabelY] = [width - margin.left - 40, margin.top + (height - margin.top - margin.bottom) / 2];

		const calculatedData = buySell(ema50(ema20(initialData)));
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
			<ChartCanvas height={height}
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
				<Chart id={1}
					yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
					padding={{ top: 10, bottom: 20 }}
				>
					<XAxis axisAt="bottom" orient="bottom"/>

					<Label x={(width - margin.left - margin.right) / 2} y={height - 45}
						fontSize="12" text="XAxis Label here" />

					<YAxis axisAt="right" orient="right" ticks={5} />

					<Label x={yAxisLabelX} y={yAxisLabelY}
						rotate={-90}
						fontSize="12" text="YAxis Label here" />
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<OHLCTooltip origin={[-40, 0]}/>
					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: ema20.accessor(),
								type: "EMA",
								stroke: ema20.stroke(),
								windowSize: ema20.options().windowSize,
							},
							{
								yAccessor: ema50.accessor(),
								type: "EMA",
								stroke: ema50.stroke(),
								windowSize: ema50.options().windowSize,
							},
						]}
					/>

					<Annotate with={LabelAnnotation} when={d => d.longShort === "LONG"}
						usingProps={longAnnotationProps} />
					<Annotate with={LabelAnnotation} when={d => d.longShort === "SHORT"}
						usingProps={shortAnnotationProps} />

				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

MovingAverageCrossOverAlgorithmV1.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

MovingAverageCrossOverAlgorithmV1.defaultProps = {
	type: "svg",
};

MovingAverageCrossOverAlgorithmV1 = fitWidth(MovingAverageCrossOverAlgorithmV1);

export default MovingAverageCrossOverAlgorithmV1;
