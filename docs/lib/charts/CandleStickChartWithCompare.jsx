"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "ReStock";

var { ChartCanvas, Chart, DataSeries, OverlaySeries, EventCapture } = ReStock;

var { CandlestickSeries, HistogramSeries, LineSeries, AreaSeries, CompareSeries } = ReStock.series;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, CompareTooltip } = ReStock.tooltip;
var { StockscaleTransformer } = ReStock.transforms;
var { XAxis, YAxis } = ReStock.axes;
var { SMA } = ReStock.indicator;
var { ChartWidthMixin } = ReStock.helper;

var CandleStickChartWithCompare = React.createClass({
	mixins: [ChartWidthMixin],
	propTypes: {
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	},
	render() {
		if (this.state === null || !this.state.width) return <div />;
		var { data, type } = this.props;

		var parseDate = d3.time.format("%Y-%m-%d").parse
		var dateRange = { from: parseDate("2012-12-01"), to: parseDate("2012-12-31")}
		var dateFormat = d3.time.format("%Y-%m-%d");

		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 90, right: 70, top:10, bottom: 30}} initialDisplay={30}
				dataTransform={[ { transform: StockscaleTransformer } ]}
				data={data} type={type}>
				<Chart id={1} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={(y) => y.toFixed(2)}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<DataSeries yAccessor={CandlestickSeries.yAccessor} compareBase={(d) => d.close}>
						<CandlestickSeries />
						<CompareSeries id={1} yAccessor={(d) => d.AAPLClose} displayLabel="AAPL" />
						<CompareSeries id={2} yAccessor={(d) => d.SP500Close} displayLabel="S&P 500" />
					</DataSeries>
				</Chart>
				<Chart id={2} yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<DataSeries yAccessor={(d) => d.volume} >
						<HistogramSeries fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
						<OverlaySeries id={3} indicator={SMA} options={{ period: 10, pluck:"volume" }} >
							<AreaSeries/>
						</OverlaySeries>
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={1} forCompareSeries={1} />
				<CurrentCoordinate forChart={1} forCompareSeries={2} />
				<MouseCoordinates xDisplayFormat={dateFormat} type="crosshair" />
				<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-50, 0]} />
					<CompareTooltip forChart={1} forCompareSeries={1} origin={[-50, 20]}/>
					<CompareTooltip forChart={1} forCompareSeries={2} origin={[-50, 40]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
});

export default CandleStickChartWithCompare;
