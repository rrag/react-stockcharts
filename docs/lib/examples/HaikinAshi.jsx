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
	, ChartWidthMixin = require('./mixin/chart-width-mixin')
	, InitialStateMixin = require('./mixin/initial-state-mixin')
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


;

module.exports = {
	init(data) {
		var HaikinAshi = React.createClass({
			mixins: [InitialStateMixin, ChartWidthMixin],
			render() {
				if (!this.state.width) return <div />;

				var parseDate = d3.time.format("%Y-%m-%d").parse
				var dateRange = { from: parseDate("2012-12-01"), to: parseDate("2012-12-31")}
				var dateFormat = d3.time.format("%Y-%m-%d");

				return (
					<ChartCanvas width={this.state.width} height={400} margin={{left: 90, right: 70, top:10, bottom: 30}} data={data} interval="1D" >
						<DataTransform transformType="stockscale">
						<DataTransform transformType="heikinashi">
							<Chart id={1} >
								<XAxis axisAt="bottom" orient="bottom"/>
								<YAxis axisAt="right" orient="right" ticks={5} />
								<DataSeries yAccessor={CandlestickSeries.yAccessor} >
									<CandlestickSeries />
									<OverlaySeries id={0} type="sma" options={{ period: 20, pluck: 'close' }}>
										<LineSeries/>
									</OverlaySeries>
									<OverlaySeries id={1} type="sma" options={{ period: 30 }} >
										<LineSeries/>
									</OverlaySeries>
									<OverlaySeries id={2} type="sma" options={{ period: 50 }} >
										<LineSeries/>
									</OverlaySeries>
								</DataSeries>
							</Chart>
							<CurrentCoordinate forChart={1} forOverlay={0} />
							<CurrentCoordinate forChart={1} forOverlay={1} />
							<CurrentCoordinate forChart={1} forOverlay={2} />
							<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
								<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
								<DataSeries yAccessor={(d) => d.volume} >
									<HistogramSeries className={(d) => d.close > d.open ? 'up' : 'down'} />
									<OverlaySeries id={3} type="sma" options={{ period: 10, pluck:'volume' }} >
										<AreaSeries/>
									</OverlaySeries>
								</DataSeries>
							</Chart>
							<CurrentCoordinate forChart={2} forOverlay={3} />
							<CurrentCoordinate forChart={2}/>
							<EdgeContainer>
								<EdgeIndicator className="horizontal" itemType="last" orient="right"
									edgeAt="right" forChart={1} forOverlay={0}
									/>
								<EdgeIndicator className="horizontal" itemType="last" orient="right"
									edgeAt="right" forChart={1} forOverlay={1}
									/>
								<EdgeIndicator className="horizontal" itemType="last" orient="right"
									edgeAt="right" forChart={1} forOverlay={2}
									/>
								<EdgeIndicator className="horizontal" itemType="first" orient="left"
									edgeAt="left" forChart={1} forOverlay={0}
									/>
								<EdgeIndicator className="horizontal" itemType="first" orient="left"
									edgeAt="left" forChart={1} forOverlay={1}
									/>
								<EdgeIndicator className="horizontal" itemType="first" orient="left"
									edgeAt="left" forChart={1} forOverlay={2}
									/>
								<EdgeIndicator className="horizontal" itemType="first" orient="left"
									edgeAt="left" forChart={2} forOverlay={3} displayFormat={d3.format(".4s")}
									/>
								<EdgeIndicator className="horizontal" itemType="last" orient="right"
									edgeAt="right" forChart={2} forOverlay={3} displayFormat={d3.format(".4s")}
									/>
								<EdgeIndicator className="horizontal" itemType="first" orient="left"
									edgeAt="left" forChart={2} displayFormat={d3.format(".4s")}
									/>
								<EdgeIndicator className="horizontal" itemType="last" orient="right"
									edgeAt="right" forChart={2} displayFormat={d3.format(".4s")}
									/>
							</EdgeContainer>
							<MouseCoordinates forChart={1} xDisplayFormat={dateFormat} yDisplayFormat={(y) => y.toFixed(2)}>
								<CrossHair />
							</MouseCoordinates>
							<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
							<TooltipContainer>
								<OHLCTooltip forChart={1} origin={[-50, 0]}/>
								<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-48, 15]}/>
							</TooltipContainer>
						</DataTransform>
						</DataTransform>
					</ChartCanvas>
				);
			}
		});
		return HaikinAshi
	}
}


/*
 xScaleDependsOn={1}
							<Chart id={1} >
								<XAxis axisAt="bottom" orient="bottom" ticks={5}/>
								<YAxis axisAt="right" orient="right" ticks={5} />
								<DataSeries yAccessor={CandlestickSeries.yAccessor} >
									<CandlestickSeries />
								</DataSeries>
							</Chart>

*/