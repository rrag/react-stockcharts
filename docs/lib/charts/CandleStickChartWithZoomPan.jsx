'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('src/');

var ChartCanvas = ReStock.ChartCanvas
	, XAxis = ReStock.axes.XAxis
	, YAxis = ReStock.axes.YAxis
	, CandlestickSeries = ReStock.CandlestickSeries
	, DataTransform = ReStock.DataTransform
	, Chart = ReStock.Chart
	, DataSeries = ReStock.DataSeries
	, ChartWidthMixin = ReStock.helper.ChartWidthMixin
	, HistogramSeries = ReStock.HistogramSeries
	, EventCapture = ReStock.EventCapture
	, MouseCoordinates = ReStock.MouseCoordinates
	, CrossHair = ReStock.CrossHair
	, TooltipContainer = ReStock.tooltip.TooltipContainer
	, OHLCTooltip = ReStock.tooltip.OHLCTooltip
;

var CandleStickChartWithZoomPan = React.createClass({
	mixins: [ChartWidthMixin],
	render() {
		if (this.state === null || !this.state.width) return <div />;

		var dateFormat = d3.time.format("%Y-%m-%d");

		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 70, right: 70, top:10, bottom: 30}} data={this.props.data} initialDisplay={200}>
				<DataTransform transformType="stockscale">
					<Chart id={1} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={(y) => y.toFixed(2)}>
						<XAxis axisAt="bottom" orient="bottom"/>
						<YAxis axisAt="right" orient="right" ticks={5} />
						<DataSeries yAccessor={CandlestickSeries.yAccessor} >
							<CandlestickSeries />
						</DataSeries>
					</Chart>
					<Chart id={2} yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
							height={150} origin={(w, h) => [0, h - 150]}>
						<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
						<DataSeries yAccessor={(d) => d.volume} >
							<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
						</DataSeries>
					</Chart>
					<MouseCoordinates xDisplayFormat={dateFormat} type="crosshair" />
					<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
					<TooltipContainer>
						<OHLCTooltip forChart={1} origin={[-40, 0]}/>
					</TooltipContainer>
				</DataTransform>
			</ChartCanvas>
		);
	}
});


module.exports = CandleStickChartWithZoomPan;
