"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "../../../src/";

var { ChartCanvas, Chart, DataSeries, OverlaySeries, EventCapture } = ReStock;

var { CandlestickSeries, HistogramSeries, LineSeries, AreaSeries, StochasticSeries, BollingerSeries } = ReStock.series;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, StochasticTooltip, BollingerBandTooltip } = ReStock.tooltip;
var { StockscaleTransformer } = ReStock.transforms;

var { XAxis, YAxis } = ReStock.axes;
var { MACD, EMA, SMA, FullStochasticOscillator, BollingerBand } = ReStock.indicator;

var { fitWidth } = ReStock.helper;

class CandleStickChartWithDarkTheme extends React.Component {
	render() {
		var height = 750;
		var { data, type, width } = this.props;

		var margin = {left: 70, right: 70, top:20, bottom: 30};

		var gridHeight = height - margin.top - margin.bottom;
		var gridWidth = width - margin.left - margin.right;

		var showGrid = true;
		var yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.1 } : {};
		var xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1 } : {};

		return (
			<ChartCanvas width={width} height={750}
				margin={margin} initialDisplay={200} 
				dataTransform={[ { transform: StockscaleTransformer } ]}
				data={data} type={type}>
				<Chart id={1} yMousePointerDisplayLocation="right" height={325}
						yMousePointerDisplayFormat={(y) => y.toFixed(2)} padding={{ top: 10, right: 0, bottom: 20, left: 0 }}>
					<YAxis axisAt="right" orient="right" ticks={5} {...yGrid} tickStroke="#FFFFFF" stroke="#FFFFFF" />
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} stroke="#FFFFFF" opacity={0.5}/>
					<DataSeries id={0} yAccessor={CandlestickSeries.yAccessor} >
						<CandlestickSeries wickStroke={{ up: "#6BA583", down: "#db0000" }} fill={{ up: "#6BA583", down: "#db0000" }}/>
					</DataSeries>
					<DataSeries id={1} indicator={EMA} options={{ period: 26 }} >
						<LineSeries/>
					</DataSeries>
					<DataSeries id={2} indicator={EMA} options={{ period: 12 }} >
						<LineSeries/>
					</DataSeries>
					<DataSeries id={3} indicator={BollingerBand} options={{ period: 20, multiplier: 2, }}>
						<BollingerSeries fill="#adffaf" opacity={0.1} stroke={{ top: "brown", middle: "#8c9900", bottom: "brown" }} />
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={1} forDataSeries={1} />
				<CurrentCoordinate forChart={1} forDataSeries={2} />
				<Chart id={2} yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={100} origin={(w, h) => [0, h - 475]} >
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")} tickStroke="#FFFFFF" />
					<DataSeries id={0} yAccessor={(d) => d.volume} >
						<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "#db0000"} />
					</DataSeries>
					<DataSeries id={1} indicator={SMA} options={{ period: 10, pluck:"volume" }} stroke="#4682B4" fill="#4682B4">
						<AreaSeries opacity={0.5} />
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={2} forDataSeries={0} />
				<CurrentCoordinate forChart={2} forDataSeries={1} />
				<EdgeContainer>
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={1} forDataSeries={1} />
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={1} forDataSeries={2} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={1} forDataSeries={1} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={1} forDataSeries={2} />
				</EdgeContainer>
				<Chart id={3} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={(y) => y.toFixed(2)}
						height={125} origin={(w, h) => [0, h - 375]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0}  stroke="#FFFFFF" opacity={0.5}/>
					<YAxis axisAt="right" orient="right" ticks={2} tickStroke="#FFFFFF" />
					<DataSeries id={1} indicator={FullStochasticOscillator}
						options={{ period: 14, K: 1, D: 3, stroke: { D: "#ea2bff", K: "#74d400" } }} >
						<StochasticSeries stroke={{ top: "#37a600", middle: "#b8ab00", bottom: "#37a600" }} />
					</DataSeries>
				</Chart>
				<Chart id={4} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={(y) => y.toFixed(2)}
						height={125} origin={(w, h) => [0, h - 250]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} stroke="#FFFFFF" opacity={0.5} />
					<YAxis axisAt="right" orient="right" ticks={2} tickStroke="#FFFFFF" />
					<DataSeries id={1} indicator={FullStochasticOscillator}
						options={{ period: 14, K: 3, D: 3, stroke: { D: "#ea2bff", K: "#74d400" } }} >
						<StochasticSeries stroke={{ top: "#37a600", middle: "#b8ab00", bottom: "#37a600" }} />
					</DataSeries>
				</Chart>
				<Chart id={5} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={(y) => y.toFixed(2)}
						height={125} origin={(w, h) => [0, h - 125]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" tickStroke="#FFFFFF" stroke="#FFFFFF" {...xGrid} />
					<YAxis axisAt="right" orient="right" ticks={2} tickStroke="#FFFFFF" />
					<DataSeries id={1} indicator={FullStochasticOscillator}
						options={{ period: 14, K: 3, D: 3, stroke: { D: "#ea2bff", K: "#74d400" } }} >
						<StochasticSeries stroke={{ top: "#37a600", middle: "#b8ab00", bottom: "#37a600" }} />
					</DataSeries>
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} stroke="#FFFFFF" opacity={0.4}/>
				<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-50, -10]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-48, 5]} />
					<BollingerBandTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-50, 55]} />
					<StochasticTooltip forChart={3} origin={[-38, 15]}>Fast STO</StochasticTooltip>
					<StochasticTooltip forChart={4} origin={[-38, 15]}>Slow STO</StochasticTooltip>
					<StochasticTooltip forChart={5} origin={[-38, 15]}>Full STO</StochasticTooltip>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
}
CandleStickChartWithDarkTheme.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithDarkTheme.defaultProps = {
	type: "svg",
};
CandleStickChartWithDarkTheme = fitWidth(CandleStickChartWithDarkTheme);

export default CandleStickChartWithDarkTheme;
