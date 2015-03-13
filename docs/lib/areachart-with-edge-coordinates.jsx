'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('../../src/');

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
		var AreaChartWithEdgeCoordinates = React.createClass({
			getInitialState() {
				return {
					width: 500,
					height: 400
				};
			},
			getEventStore() {
				return this.refs.eventStore.getEventStore();
			},
			updateEventStore(eventStore) {
				return this.refs.eventStore.updateEventStore(eventStore);
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
						margin={{left: 5, right: 90, top:10, bottom: 30}} data={data} ref="eventStore">
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
								<OverlaySeries id={3} type="sma" options={{ period: 250 }} >
									<LineSeries/>
								</OverlaySeries>
								<OverlaySeries id={4} type="sma" options={{ period: 350 }} >
									<LineSeries/>
								</OverlaySeries>
								<OverlaySeries id={5} type="sma" options={{ period: 450 }} >
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
								forOverlay={1}
								/>
							<EdgeIndicator
								className="horizontal"
								itemType="last"
								orient="right"
								edgeAt="right"
								forChart={1}
								forOverlay={5}
								/>
						</EdgeContainer>
						<MouseCoordinates forChart={1} xDisplayFormat={dateFormat} yDisplayFormat={(y) => y.toFixed(2)}>
							<CrossHair />
						</MouseCoordinates>
						<EventCapture mouseMove={true} />
						<TooltipContainer>
							<OHLCTooltip forChart={1} />
							<MovingAverageTooltip forChart={1} onClick={this.handleMATooltipClick} />
						</TooltipContainer>
					</ChartCanvas>
				);
			}
		});

		return AreaChartWithEdgeCoordinates;
	}
}

/*

							
							

						<EdgeContainer>

						</EdgeContainer>


							<EdgeIndicator
								type="horizontal"
								className="horizontal"
								itemType="last"
								orient="right"
								edgeAt="right"
								forSeries={1}
								displayFormat={(d) => (d)}
								/>
							<EdgeIndicator
								type="horizontal"
								className="horizontal"
								itemType="first"
								orient="left"
								edgeAt="left"
								forSeries={1}
								displayFormat={(d) => (d)}
								/>
*/
