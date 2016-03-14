"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;
var { BarSeries, LineSeries, AreaSeries, KagiSeries } = ReStock.series;
var { financeEODDiscontiniousScale } = ReStock.scale;

var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { kagi } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

var xScale = financeEODDiscontiniousScale();

class Kagi extends React.Component {
	getChartCanvas() {
		return this.refs.chartCanvas;
	}
	render() {
		var { data, type, width } = this.props;
		var kagiCalculator = kagi();
		return (
			<ChartCanvas ref="chartCanvas" width={width} height={400}
					margin={{left: 80, right: 80, top:10, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data} calculator={[kagiCalculator]}
					xAccessor={d => d.date} discontinous xScale={xScale}>
				<Chart id={1}
						yExtents={d => [d.high, d.low]}
						yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")} 
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<KagiSeries />
				</Chart>
				<Chart id={2}
						yExtents={d => d.volume}
						yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<BarSeries
							yAccessor={d => d.volume}
							stroke
							fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} 
							opacity={0.5} />
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
}

Kagi.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

Kagi.defaultProps = {
	type: "svg",
};
Kagi = fitWidth(Kagi);

export default Kagi;
