'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('src/');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.XAxis
	, YAxis = ReStock.YAxis
	, AreaSeries = ReStock.AreaSeries
	, Translate = ReStock.Translate
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries
	, EventCapture = ReStock.EventCapture
	, MouseCoordinates = ReStock.MouseCoordinates
	, CrossHair = ReStock.CrossHair
	, TooltipContainer = ReStock.TooltipContainer
	, OHLCTooltip = ReStock.OHLCTooltip
	, OverlaySeries = ReStock.OverlaySeries
	, LineSeries = ReStock.LineSeries
	, MovingAverageTooltip = ReStock.MovingAverageTooltip
	, EdgeContainer = ReStock.EdgeContainer
	, EdgeIndicator = ReStock.EdgeIndicator
	, CurrentCoordinate = ReStock.CurrentCoordinate

;

module.exports = {
	init(data) {
		var AreaChartWithZoom = React.createClass({
			getInitialState() {
				return {
					width: 500,
					height: 400
				};
			},
			handleMATooltipClick(overlay) {
				console.log('You clicked on ', overlay, ' handle your onclick event here...');
			},
			render() {
				var parseDate = d3.time.format("%Y-%m-%d").parse
				var dateRange = { from: parseDate("2012-06-01"), to: parseDate("2012-12-31")}
				var dateFormat = d3.time.format("%Y-%m-%d");

				return (
					<ChartCanvas 
						width={this.state.width} height={this.state.height}
						margin={{left: 65, right: 90, top:30, bottom: 30}} data={data} ref="eventStore">
						<Chart id={1} >
							<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
							<YAxis axisAt="right" orient="right" />
							<DataSeries yAccessor={(d) => d.close} xAccessor={(d) => d.date}>
								<AreaSeries />
								<OverlaySeries id={0} type="sma" options={{ period: 50 }} >
									<LineSeries/>
								</OverlaySeries>
								<OverlaySeries id={1} type="sma" options={{ period: 150 }} >
									<LineSeries/>
								</OverlaySeries>
								<OverlaySeries id={2} type="sma" options={{ period: 250 }} >
									<LineSeries/>
								</OverlaySeries>
								<OverlaySeries id={3} type="sma" options={{ period: 350 }} >
									<LineSeries/>
								</OverlaySeries>
								<OverlaySeries id={4} type="sma" options={{ period: 450 }} >
									<LineSeries/>
								</OverlaySeries>
							</DataSeries>
						</Chart>
						<CurrentCoordinate forChart={1} />
						<CurrentCoordinate forChart={1} forOverlay={1} />
						<EdgeContainer>
							<EdgeIndicator
								className="horizontal"
								itemType="last"
								orient="right"
								edgeAt="right"
								forChart={1}
								forOverlay={0}
								/>
							<EdgeIndicator
								className="horizontal"
								itemType="first"
								orient="left"
								edgeAt="left"
								forChart={1}
								forOverlay={1}
								/>
							<EdgeIndicator
								className="horizontal"
								itemType="last"
								orient="right"
								edgeAt="right"
								forChart={1}
								/>
							<EdgeIndicator
								className="horizontal"
								itemType="first"
								orient="left"
								edgeAt="left"
								forChart={1}
								/>
							<EdgeIndicator
								className="horizontal"
								itemType="last"
								orient="right"
								edgeAt="right"
								forChart={1}
								forOverlay={2}
								/>
							<EdgeIndicator
								className="horizontal"
								itemType="last"
								orient="right"
								edgeAt="right"
								forChart={1}
								forOverlay={3}
								/>
						</EdgeContainer>
						<MouseCoordinates forChart={1} xDisplayFormat={dateFormat} yDisplayFormat={(y) => y.toFixed(2)}>
							<CrossHair />
						</MouseCoordinates>
						<EventCapture mouseMove={true} zoom={true} mainChart={1}/>
						<TooltipContainer>
							<OHLCTooltip forChart={1} origin={[-60, -20]}/>
							<MovingAverageTooltip forChart={1} onClick={this.handleMATooltipClick}  origin={[-60, -10]}/>
						</TooltipContainer>
					</ChartCanvas>
				);
			}
		});

		return AreaChartWithZoom;
	}
}
