'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('src/');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.XAxis
	, YAxis = ReStock.YAxis
	, CandlestickSeries = ReStock.CandlestickSeries
	, DataTransform = ReStock.DataTransform
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries
	, ChartWidthMixin = ReStock.helper.ChartWidthMixin
	, HistogramSeries = ReStock.HistogramSeries
	, EventCapture = ReStock.EventCapture
	, MouseCoordinates = ReStock.MouseCoordinates
	, CrossHair = ReStock.CrossHair
	, TooltipContainer = ReStock.TooltipContainer
	, OHLCTooltip = ReStock.OHLCTooltip
	, OverlaySeries = ReStock.OverlaySeries
	, LineSeries = ReStock.LineSeries
	, MovingAverageTooltip = ReStock.MovingAverageTooltip
	, CurrentCoordinate = ReStock.CurrentCoordinate
	, AreaSeries = ReStock.AreaSeries
	, EdgeContainer = ReStock.EdgeContainer
	, EdgeIndicator = ReStock.EdgeIndicator
	, MACDSeries = ReStock.MACDSeries
	, MACDIndicator = ReStock.indicator.MACD
	, MACDTooltip = ReStock.tooltip.MACDTooltip
;


var CandleStickChartWithMACDIndicatorCanvas = React.createClass({
	mixins: [ChartWidthMixin],
	render() {
		if (this.state === null || !this.state.width) return <div />;

		var dateFormat = d3.time.format("%Y-%m-%d");

		return (
			<ChartCanvas width={this.state.width} height={600}
				margin={{left: 70, right: 70, top:20, bottom: 30}} data={this.props.data} interval="D"
				initialDisplay={200} type="hybrid" >
				<DataTransform transformType="stockscale">
					<Chart id={1} yMousePointerDisplayLocation="right" height={390}
							yMousePointerDisplayFormat={(y) => y.toFixed(2)} padding={{ top: 10, right: 0, bottom: 20, left: 0 }}>
						<YAxis axisAt="right" orient="right" ticks={5} />
						<XAxis axisAt="bottom" orient="bottom" noTicks={true}/>
						<DataSeries yAccessor={CandlestickSeries.yAccessor} >
							<CandlestickSeries />
							<OverlaySeries id={0} type="ema" options={{ period: 26 }} >
								<LineSeries/>
							</OverlaySeries>
							<OverlaySeries id={1} type="ema" options={{ period: 12 }} >
								<LineSeries/>
							</OverlaySeries>
						</DataSeries>
					</Chart>
					<CurrentCoordinate forChart={1} forOverlay={0} />
					<CurrentCoordinate forChart={1} forOverlay={1} />
					<Chart id={2} yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
							height={150} origin={(w, h) => [0, h - 310]} >
						<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
						<DataSeries yAccessor={(d) => d.volume} >
							<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
							<OverlaySeries id={3} type="sma" options={{ period: 10, pluck:'volume' }} >
								<AreaSeries opacity={0.5} stroke="steelblue" fill="steelblue" />
							</OverlaySeries>
						</DataSeries>
					</Chart>
					<CurrentCoordinate forChart={2} forOverlay={3} />
					<CurrentCoordinate forChart={2}/>
					<EdgeContainer>
						<EdgeIndicator className="horizontal" itemType="last" orient="right"
							edgeAt="right" forChart={1} forOverlay={0} />
						<EdgeIndicator className="horizontal" itemType="last" orient="right"
							edgeAt="right" forChart={1} forOverlay={1} />
						<EdgeIndicator className="horizontal" itemType="first" orient="left"
							edgeAt="left" forChart={1} forOverlay={0} />
						<EdgeIndicator className="horizontal" itemType="first" orient="left"
							edgeAt="left" forChart={1} forOverlay={1} />
					</EdgeContainer>
					<Chart id={3} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={(y) => y.toFixed(2)}
							height={140} origin={(w, h) => [0, h - 150]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }}
							>
						<XAxis axisAt={150} orient="bottom"/>
						<YAxis axisAt="right" orient="right" ticks={2}/>
						<DataSeries indicator={MACDIndicator} options={{ fast: 12, slow: 26, signal: 9 }} >
							<MACDSeries />
						</DataSeries>
					</Chart>
					<MouseCoordinates xDisplayFormat={dateFormat} type="crosshair" />
					<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
					<TooltipContainer>
						<OHLCTooltip forChart={1} origin={[-40, -10]}/>
						<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 5]}/>
						<MACDTooltip forChart={3} origin={(w, h) => [-38, h - 140]}/>
					</TooltipContainer>
				</DataTransform>
			</ChartCanvas>
		);
	}
});

//						<MACDTooltip forChart={3} origin={(w, h) => [-38, h - 140]}/>


module.exports = CandleStickChartWithMACDIndicatorCanvas;
