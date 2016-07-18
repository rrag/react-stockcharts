"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "../../../src/";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries, StochasticSeries } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = ReStock.coordinates;
var { EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, StochasticTooltip } = ReStock.tooltip;

var { XAxis, YAxis } = ReStock.axes;
var { stochasticOscilator, ema } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

class CandleStickChartWithFullStochasticsIndicator extends React.Component {
	render() {
		var height = 750;
		var { data, type, width } = this.props;

		var margin = {left: 70, right: 70, top:20, bottom: 30};

		var gridHeight = height - margin.top - margin.bottom;
		var gridWidth = width - margin.left - margin.right;

		var showGrid = true;
		var yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.1 } : {};
		var xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1 } : {};

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

		var slowSTO = stochasticOscilator()
			.windowSize(14)
			.kWindowSize(1)
			.merge((d, c) => {d.slowSTO = c})
			.accessor(d => d.slowSTO);
		var fastSTO = stochasticOscilator()
			.windowSize(14)
			.kWindowSize(3)
			.merge((d, c) => {d.fastSTO = c})
			.accessor(d => d.fastSTO);
		var fullSTO = stochasticOscilator()
			.windowSize(14)
			.kWindowSize(3)
			.dWindowSize(4)
			.merge((d, c) => {d.fullSTO = c})
			.accessor(d => d.fullSTO);

		return (
			<ChartCanvas width={width} height={750}
					margin={margin} type={type}
					seriesName="MSFT"
					data={data} calculator={[ema20, ema50, slowSTO, fastSTO, fullSTO]}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1} height={325}
						yExtents={d => [d.high, d.low]}
						padding={{ top: 10, bottom: 20 }}>
					<YAxis axisAt="right" orient="right" ticks={5} {...yGrid}/>
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />

					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<CandlestickSeries />

					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<CurrentCoordinate id={1} yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate id={2} yAccessor={ema50.accessor()} fill={ema50.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
				</Chart>
				<Chart id={2}
						yExtents={d => d.volume}
						height={100} origin={(w, h) => [0, h - 475]} >
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

					<MouseCoordinateY id={0}
						at="left"
						orient="left"
						displayFormat={d3.format(".4s")} />

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
				</Chart>
				<Chart id={3}
						yExtents={slowSTO.domain()}
						height={125} origin={(w, h) => [0, h - 375]} padding={{ top: 10, bottom: 10 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={2} tickValues={slowSTO.tickValues()} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<StochasticSeries calculator={slowSTO}/>
				</Chart>
				<Chart id={4}
						yExtents={fastSTO.domain()}
						height={125} origin={(w, h) => [0, h - 250]} padding={{ top: 10, bottom: 10 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={2} tickValues={fastSTO.tickValues()} />

					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<StochasticSeries calculator={fastSTO}/>
				</Chart>
				<Chart id={5}
						yExtents={fullSTO.domain()}
						height={125} origin={(w, h) => [0, h - 125]} padding={{ top: 10, bottom: 10 }} >
					<XAxis axisAt="bottom" orient="bottom" {...xGrid} />
					<YAxis axisAt="right" orient="right" ticks={2} tickValues={fullSTO.tickValues()} />

					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<StochasticSeries calculator={fullSTO}/>
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, -10]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]} 
						calculators={[ema20, ema50]}/>
					<StochasticTooltip forChart={3} calculator={slowSTO} origin={[-38, 15]}>Fast STO</StochasticTooltip>
					<StochasticTooltip forChart={4} calculator={fastSTO} origin={[-38, 15]}>Slow STO</StochasticTooltip>
					<StochasticTooltip forChart={5} calculator={fullSTO} origin={[-38, 15]}>Full STO</StochasticTooltip>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
}
CandleStickChartWithFullStochasticsIndicator.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithFullStochasticsIndicator.defaultProps = {
	type: "svg",
};
CandleStickChartWithFullStochasticsIndicator = fitWidth(CandleStickChartWithFullStochasticsIndicator);

export default CandleStickChartWithFullStochasticsIndicator;
