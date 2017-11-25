
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	BollingerSeries,
	CandlestickSeries,
	LineSeries,
	StochasticSeries,
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
	BollingerBandTooltip,
	StochasticTooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, stochasticOscillator, bollingerBand } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

const bbAppearance = {
	stroke: {
		top: "#964B00",
		middle: "#FF6600",
		bottom: "#964B00",
	},
	fill: "#4682B4"
};
const stoAppearance = {
	stroke: Object.assign({},
		StochasticSeries.defaultProps.stroke,
		{ top: "#37a600", middle: "#b8ab00", bottom: "#37a600" })
};

class CandleStickChartWithDarkTheme extends React.Component {
	render() {
		const height = 750;
		const { type, data: initialData, width, ratio } = this.props;

		const margin = { left: 70, right: 70, top: 20, bottom: 30 };

		const gridHeight = height - margin.top - margin.bottom;
		const gridWidth = width - margin.left - margin.right;

		const showGrid = true;
		const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 } : {};
		const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};

		const ema20 = ema()
			.id(0)
			.options({ windowSize: 20 })
			.merge((d, c) => {d.ema20 = c;})
			.accessor(d => d.ema20);

		const ema50 = ema()
			.id(2)
			.options({ windowSize: 50 })
			.merge((d, c) => {d.ema50 = c;})
			.accessor(d => d.ema50);

		const slowSTO = stochasticOscillator()
			.options({ windowSize: 14, kWindowSize: 3 })
			.merge((d, c) => {d.slowSTO = c;})
			.accessor(d => d.slowSTO);
		const fastSTO = stochasticOscillator()
			.options({ windowSize: 14, kWindowSize: 1 })
			.merge((d, c) => {d.fastSTO = c;})
			.accessor(d => d.fastSTO);
		const fullSTO = stochasticOscillator()
			.options({ windowSize: 14, kWindowSize: 3, dWindowSize: 4 })
			.merge((d, c) => {d.fullSTO = c;})
			.accessor(d => d.fullSTO);

		const bb = bollingerBand()
			.merge((d, c) => {d.bb = c;})
			.accessor(d => d.bb);


		const calculatedData = bb(ema20(ema50(slowSTO(fastSTO(fullSTO(initialData))))));
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
			<ChartCanvas height={750}
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


				<Chart id={1} height={325}
					yExtents={[d => [d.high, d.low], bb.accessor(), ema20.accessor(), ema50.accessor()]}
					padding={{ top: 10, bottom: 20 }}
				>
					<YAxis axisAt="right" orient="right" ticks={5} {...yGrid} inverted={true}
						tickStroke="#FFFFFF" />
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0}
						stroke="#FFFFFF" opacity={0.5} />

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries
						stroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
						wickStroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
						fill={d => d.close > d.open ? "#6BA583" : "#DB0000"} />

					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<BollingerSeries yAccessor={d => d.bb}
						{...bbAppearance} />
					<CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#DB0000"}/>

					<OHLCTooltip origin={[-40, -10]}/>
					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: ema20.accessor(),
								type: ema20.type(),
								stroke: ema20.stroke(),
								windowSize: ema20.options().windowSize,
							},
							{
								yAccessor: ema50.accessor(),
								type: ema50.type(),
								stroke: ema50.stroke(),
								windowSize: ema50.options().windowSize,
							},
						]}
					/>
					<BollingerBandTooltip
						origin={[-38, 60]}
						yAccessor={d => d.bb}
						options={bb.options()}
					/>
				</Chart>
				<Chart id={2}
					yExtents={d => d.volume}
					height={100} origin={(w, h) => [0, h - 475]}
				>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}
						tickStroke="#FFFFFF" />
					<BarSeries
						yAccessor={d => d.volume}
						fill={d => d.close > d.open ? "#6BA583" : "#DB0000"} />
				</Chart>
				<Chart id={3}
					yExtents={[0, 100]}
					height={125} origin={(w, h) => [0, h - 375]} padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom"
						showTicks={false}
						outerTickSize={0}
						stroke="#FFFFFF" opacity={0.5} />
					<YAxis axisAt="right" orient="right"
						tickValues={[20, 50, 80]}
						tickStroke="#FFFFFF"/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<StochasticSeries
						yAccessor={d => d.slowSTO}
						{...stoAppearance} />
					<StochasticTooltip
						origin={[-38, 15]}
						yAccessor={d => d.slowSTO}
						options={slowSTO.options()}
						appearance={stoAppearance}
						label="Slow STO" />
				</Chart>
				<Chart id={4}
					yExtents={[0, 100]}
					height={125} origin={(w, h) => [0, h - 250]} padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom"
						showTicks={false}
						outerTickSize={0}
						stroke="#FFFFFF"
						opacity={0.5} />
					<YAxis axisAt="right" orient="right"
						tickValues={[20, 50, 80]}
						tickStroke="#FFFFFF"/>

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<StochasticSeries
						yAccessor={d => d.fastSTO}
						{...stoAppearance} />
					<StochasticTooltip
						origin={[-38, 15]}
						yAccessor={d => d.fastSTO}
						options={fastSTO.options()}
						appearance={stoAppearance}
						label="Fast STO" />
				</Chart>
				<Chart id={5}
					yExtents={[0, 100]}
					height={125}
					origin={(w, h) => [0, h - 125]}
					padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom"
						{...xGrid}
						tickStroke="#FFFFFF"
						stroke="#FFFFFF" />
					<YAxis axisAt="right" orient="right"
						tickValues={[20, 50, 80]}
						tickStroke="#FFFFFF"/>

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<StochasticSeries
						yAccessor={d => d.fullSTO}
						{...stoAppearance} />
					<StochasticTooltip
						origin={[-38, 15]}
						yAccessor={d => d.fullSTO}
						options={fullSTO.options()}
						appearance={stoAppearance}
						label="Full STO" />
				</Chart>
				<CrossHairCursor stroke="#FFFFFF" />
			</ChartCanvas>
		);
	}
}
CandleStickChartWithDarkTheme.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithDarkTheme.defaultProps = {
	type: "svg",
};
CandleStickChartWithDarkTheme = fitWidth(CandleStickChartWithDarkTheme);

export default CandleStickChartWithDarkTheme;
