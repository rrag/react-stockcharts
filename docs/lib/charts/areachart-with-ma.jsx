'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('src/');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.axes.XAxis
	, YAxis = ReStock.axes.YAxis
	, AreaSeries = ReStock.AreaSeries
	, Translate = ReStock.Translate
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries
	, EventCapture = ReStock.EventCapture
	, MouseCoordinates = ReStock.MouseCoordinates
	, CrossHair = ReStock.CrossHair
	, TooltipContainer = ReStock.tooltip.TooltipContainer
	, OHLCTooltip = ReStock.tooltip.OHLCTooltip
	, OverlaySeries = ReStock.OverlaySeries
	, LineSeries = ReStock.LineSeries
	, CurrentCoordinate = ReStock.CurrentCoordinate
	, MovingAverageTooltip = ReStock.tooltip.MovingAverageTooltip
;

module.exports = {
	init(data) {
		var AreaChartWithMA = React.createClass({
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
					<ChartCanvas data={data} width={this.state.width} height={this.state.height} margin={{left: 5, right: 90, top:10, bottom: 30}}>
						<Chart id={1}>
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
						<MouseCoordinates forChart={1} xDisplayFormat={dateFormat} yDisplayFormat={(y) => y.toFixed(2)}>
							<CrossHair />
						</MouseCoordinates>
						<EventCapture mouseMove={true}  mainChart={1}/>
						<TooltipContainer>
							<OHLCTooltip forChart={1} />
							<MovingAverageTooltip forChart={1} onClick={this.handleMATooltipClick} />
						</TooltipContainer>
					</ChartCanvas>
				);
			}
		});

		return AreaChartWithMA;
	}
}
