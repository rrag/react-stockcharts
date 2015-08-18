"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "ReStock";

var { ChartCanvas, Chart, DataSeries } = ReStock;
var { CandlestickSeries, HistogramSeries } = ReStock;
var { EventCapture, MouseCoordinates } = ReStock;

var { TooltipContainer, OHLCTooltip } = ReStock.tooltip;
var { StockscaleTransformer } = ReStock.transforms;

var { XAxis, YAxis } = ReStock.axes;
var { ChartWidthMixin } = ReStock.helper;

var CandleStickChartWithZoomPan = React.createClass({
	mixins: [ChartWidthMixin],
	propTypes: {
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	},
	render() {
		if (this.state === null || !this.state.width) return <div />;
		var { data, type } = this.props;
		var dateFormat = d3.time.format("%Y-%m-%d");

		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 70, right: 70, top:10, bottom: 30}} initialDisplay={200}
				dataTransform={[ { transform: StockscaleTransformer } ]}
				data={data} type={type}>
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
			</ChartCanvas>
		);
	}
});


export default CandleStickChartWithZoomPan;
