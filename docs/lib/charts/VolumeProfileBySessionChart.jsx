"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries, VolumeProfileSeries } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { EdgeIndicator } = ReStock.coordinates;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { ema, sma, change } = ReStock.indicator;

var { fitWidth } = ReStock.helper;

class VolumeProfileChart extends React.Component {
	render() {
		var { data, type, width } = this.props;

		var ema20 = ema()
			.id(0)
			.windowSize(20)
			.merge((d, c) => {d.ema20 = c})
			.accessor(d => d.ema20);

		var ema50 = ema()
			.id(2)
			.windowSize(50)
			.merge((d, c) => {d.ema50 = c})
			.accessor(d => d.ema50);

		var changeCalculator = change();

		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 80, right: 80, top:10, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data} calculator={[ema20, ema50, changeCalculator]}
					xExtents={[new Date(2014, 9, 1), new Date(2015, 2, 2)]}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}>
				<Chart id={2}
						yExtents={[d => d.volume]}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

					<MouseCoordinateY id={0}
						at="left"
						orient="left"
						displayFormat={d3.format(".4s")} />

					<BarSeries yAccessor={d => d.volume}
							widthRatio={0.95}
							opacity={0.3}
							fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
				</Chart>
				<Chart id={1}
						yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
						padding={{ top: 40, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<VolumeProfileSeries bySession orient="right" showSessionBackground />
					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]} />
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]} 
						calculators={[ema20, ema50]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
}

VolumeProfileChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

VolumeProfileChart.defaultProps = {
	type: "svg",
};
VolumeProfileChart = fitWidth(VolumeProfileChart);

export default VolumeProfileChart;
