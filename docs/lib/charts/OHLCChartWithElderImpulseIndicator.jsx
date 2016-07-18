"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { OHLCSeries, BarSeries, LineSeries, AreaSeries, MACDSeries, ElderImpulseBackground } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = ReStock.coordinates;
var { EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, MACDTooltip } = ReStock.tooltip;

var { XAxis, YAxis } = ReStock.axes;
var { elderImpulse, change, macd, ema } = ReStock.indicator;

var { fitWidth } = ReStock.helper;

class OHLCChartWithElderImpulseIndicator extends React.Component {
	render() {
		var { data, type, width } = this.props;

		var changeCalculator = change();

		var ema12 = ema()
			.id(1)
			.windowSize(12)
			.merge((d, c) => {d.ema12 = c})
			.accessor(d => d.ema12);

		var macdCalculator = macd()
			.fast(12)
			.slow(26)
			.signal(9)
			.merge((d, c) => {d.macd = c})
			.accessor(d => d.macd);

		var elderImpulseCalculator = elderImpulse()
			.macdSource(macdCalculator.accessor())
			.emaSource(ema12.accessor());

		return (
			<ChartCanvas width={width} height={500}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data} calculator={[changeCalculator, ema12, macdCalculator, elderImpulseCalculator]}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>

				<Chart id={1} height={300} 
						yExtents={d => [d.high, d.low]}
						padding={{ top: 10, bottom: 10 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={2}/>

					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()}/>

					<OHLCSeries stroke={elderImpulseCalculator.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
				</Chart>
				<Chart id={2} height={150}
						yExtents={d => d.volume}
						origin={(w, h) => [0, h - 300]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

					<MouseCoordinateY id={0}
						at="left"
						orient="left"
						displayFormat={d3.format(".4s")} />

					<BarSeries yAccessor={d => d.volume}
						fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}
						opacity={0.4}/>
				</Chart>
				<Chart id={3} height={150}
						yExtents={macdCalculator.accessor()}
						origin={(w, h) => [0, h - 150]} padding={{ top: 10, bottom: 10 }} >
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={2} />

					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<MACDSeries calculator={macdCalculator} />
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, -10]}/>
					<MovingAverageTooltip forChart={1} origin={[-38, 5]}
						calculators={[ema12]} />
					<MACDTooltip forChart={3} origin={[-38, 15]} calculator={macdCalculator}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
};
OHLCChartWithElderImpulseIndicator.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

OHLCChartWithElderImpulseIndicator.defaultProps = {
	type: "svg",
};
OHLCChartWithElderImpulseIndicator = fitWidth(OHLCChartWithElderImpulseIndicator);

export default OHLCChartWithElderImpulseIndicator;
