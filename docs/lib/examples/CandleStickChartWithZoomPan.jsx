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
	, ChartWidthMixin = require('./mixin/ChartWidthMixin')
	, InitialStateMixin = require('./mixin/initial-state-mixin')
	, HistogramSeries = ReStock.HistogramSeries
	, EventCapture = ReStock.EventCapture
	, MouseCoordinates = ReStock.MouseCoordinates
	, CrossHair = ReStock.CrossHair
	, TooltipContainer = ReStock.TooltipContainer
	, OHLCTooltip = ReStock.OHLCTooltip
;

var CandleStickChart = React.createClass({
	mixins: [InitialStateMixin, ChartWidthMixin],
	render() {
		if (!this.state.width) return <div />;

		var dateFormat = d3.time.format("%Y-%m-%d");

		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 40, right: 70, top:10, bottom: 30}} data={this.props.data}>
				<DataTransform transformType="stockscale">
					<Chart id={1} >
						<XAxis axisAt="bottom" orient="bottom"/>
						<YAxis axisAt="right" orient="right" ticks={5} />
						<DataSeries yAccessor={CandlestickSeries.yAccessor} >
							<CandlestickSeries />
						</DataSeries>
					</Chart>
					<Chart id={2} height={150} origin={(w, h) => [0, h - 150]}>
						<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
						<DataSeries yAccessor={(d) => d.volume} >
							<HistogramSeries className={(d) => d.close > d.open ? 'up' : 'down'} />
						</DataSeries>
					</Chart>
					<MouseCoordinates forChart={1} xDisplayFormat={dateFormat} yDisplayFormat={(y) => y.toFixed(2)} type="crosshair" />
					<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
					<TooltipContainer>
						<OHLCTooltip forChart={1} origin={[-40, 0]}/>
					</TooltipContainer>
				</DataTransform>
			</ChartCanvas>
		);
	}
});


module.exports = CandleStickChart;

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