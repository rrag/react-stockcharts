"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	AreaSeries,
	CandlestickSeries,
	LineSeries,
	MACDSeries,
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
	MACDTooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, macd, sma } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { TrendLine } from "react-stockcharts/lib/interactive";
import { last } from "react-stockcharts/lib/utils";

const macdStroke = {
	macd: "#FF0000",
	signal: "#00F300",
};

const macdFill = {
	divergence: "#4682B4"
};

class CandlestickChart extends React.Component {
	constructor(props) {
		super(props);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onTrendLineComplete = this.onTrendLineComplete.bind(this);
		this.state = {
			enableTrendLine: true
		};
	}
	componentDidMount() {
		document.addEventListener("keyup", this.onKeyPress);
	}
	componentWillUnmount() {
		document.removeEventListener("keyup", this.onKeyPress);
	}
	onTrendLineComplete() {
		this.setState({
			enableTrendLine: false
		});
	}
	onKeyPress(e) {
		var keyCode = e.which;
		console.log(keyCode);
		switch (keyCode) {
		case 46: { // DEL
			this.refs.trend.removeLast();
			break;
		}
		case 27: { // ESC
			this.refs.trend.terminate();
			this.setState({
				enableTrendLine: false
			});
			break;
		}
		case 68:   // D - Draw trendline
		case 69: { // E - Enable trendline
			this.setState({
				enableTrendLine: true
			});
			break;
		}
		}
	}
	render() {
		var ema26 = ema()
			.id(0)
			.windowSize(26)
			.merge((d, c) => {d.ema26 = c;})
			.accessor(d => d.ema26);

		var ema12 = ema()
			.id(1)
			.windowSize(12)
			.merge((d, c) => {d.ema12 = c;})
			.accessor(d => d.ema12);

		var macdCalculator = macd()
			.fast(12)
			.slow(26)
			.signal(9)
			.merge((d, c) => {d.macd = c;})
			.accessor(d => d.macd);

		var smaVolume50 = sma()
			.id(3)
			.windowSize(10)
			.sourcePath("volume")
			.merge((d, c) => {d.smaVolume50 = c;})
			.accessor(d => d.smaVolume50);

		var { type, data: initialData, width, ratio } = this.props;

		const calculatedData = macdCalculator(smaVolume50(ema12(ema26(initialData))));
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
			<ChartCanvas height={600}
					width={width}
					ratio={ratio}
					margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
					type={type}
					seriesName="MSFT"
					data={data}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					xExtents={xExtents}
					drawMode={this.state.enableTrendLine}>
				<Chart id={1} height={400}
						yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={5} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()}/>
					<LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()}/>


					<CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />
					<CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<OHLCTooltip origin={[-40, 0]}/>

					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: ema26.accessor(),
								type: "EMA",
								stroke: ema26.stroke(),
								windowSize: ema26.windowSize(),
							},
							{
								yAccessor: ema12.accessor(),
								type: "EMA",
								stroke: ema12.stroke(),
								windowSize: ema12.windowSize(),
							},
						]}
						/>
					<TrendLine ref="trend"
						enabled={this.state.enableTrendLine}
						type="LINE"
						snap={true} snapTo={d => [d.high, d.low]}
						onStart={() => console.log("START")}
						onComplete={this.onTrendLineComplete}
						/>
				</Chart>
				<Chart id={2} height={150}
						yExtents={[d => d.volume, smaVolume50.accessor()]}
						origin={(w, h) => [0, h - 300]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")}/>

					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
					<AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>
				</Chart>
				<Chart id={3} height={150}
						yExtents={macdCalculator.accessor()}
						origin={(w, h) => [0, h - 150]} padding={{ top: 10, bottom: 10 }} >
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={2} />

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<MACDSeries yAccessor={d => d.macd}
						stroke={macdStroke}
						fill={macdFill} />
					<MACDTooltip
						origin={[-38, 15]}
						yAccessor={d => d.macd}
						options={{
							slow: macdCalculator.slow(),
							fast: macdCalculator.fast(),
							signal: macdCalculator.signal(),
						}}
						appearance={{
							stroke: macdStroke,
							fill: macdFill,
						}}
						/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CandlestickChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandlestickChart.defaultProps = {
	type: "svg",
};

var CandleStickChartWithInteractiveIndicator = fitWidth(CandlestickChart);

export default CandleStickChartWithInteractiveIndicator;
