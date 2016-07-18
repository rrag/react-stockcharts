"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { OHLCSeries, BarSeries, LineSeries, AreaSeries, ElderRaySeries, StraightLine } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = ReStock.coordinates;
var { EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, SingleValueTooltip, RSITooltip } = ReStock.tooltip;

var { XAxis, YAxis } = ReStock.axes;
var { elderRay, change } = ReStock.indicator;

var { fitWidth } = ReStock.helper;

class OHLCChartWithElderRayIndicator extends React.Component {
	render() {
		var { data, type, width } = this.props;

		var elder = elderRay();
		var changeCalculator = change();

		return (
			<ChartCanvas width={width} height={650}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data} calculator={[changeCalculator, elder]}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1} height={300} 
						yExtents={d => [d.high, d.low]}
						padding={{ top: 10, right: 0, bottom: 20, left: 0 }}>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />

					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<OHLCSeries />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
				</Chart>
				<Chart id={2} height={150} 
						yExtents={d => d.volume}
						origin={(w, h) => [0, h - 450]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<MouseCoordinateY id={0}
						at="left"
						orient="left"
						displayFormat={d3.format(".4s")} />

					<BarSeries yAccessor={d => d.volume}
						fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}
						opacity={0.4}/>
				</Chart>
				<Chart id={3} height={100}
						yExtents={[0, elder.accessor()]}
						origin={(w, h) => [0, h - 300]}
						padding={{ top: 10, bottom: 10 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={d3.format(".2f")}/>

					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<ElderRaySeries calculator={elder} />
				</Chart>
				<Chart id={4} height={100}
						yExtents={[0, d => elder.accessor()(d) && elder.accessor()(d).bullPower]}
						origin={(w, h) => [0, h - 200]}
						padding={{ top: 10, bottom: 10 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={d3.format(".2f")}/>
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<BarSeries
						yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bullPower}
						baseAt={(xScale, yScale, d) => yScale(0)}
						fill="#6BA583" />
					<StraightLine yValue={0} />
				</Chart>
				<Chart id={5} height={100}
						yExtents={[0, d => elder.accessor()(d) && elder.accessor()(d).bearPower]}
						origin={(w, h) => [0, h - 100]}
						padding={{ top: 10, bottom: 10 }} >
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={d3.format(".2f")}/>
					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />
					<BarSeries
						yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bearPower}
						baseAt={(xScale, yScale, d) => yScale(0)}
						fill="#FF0000" />
					<StraightLine yValue={0} />
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, -10]}/>
					<SingleValueTooltip forChart={3}
						yAccessor={elder.accessor()}
						yLabel="Elder Ray"
						yDisplayFormat={d => `${d3.format(".2f")(d.bullPower)}, ${d3.format(".2f")(d.bearPower)}`}
						origin={[-40, 15]}/>
					<SingleValueTooltip forChart={4}
						yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bullPower}
						yLabel="Elder Ray - Bull power"
						yDisplayFormat={d3.format(".2f")}
						origin={[-40, 15]}/>
					<SingleValueTooltip forChart={5}
						yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bearPower}
						yLabel="Elder Ray - Bear power"
						yDisplayFormat={d3.format(".2f")}
						origin={[-40, 15]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
};

OHLCChartWithElderRayIndicator.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

OHLCChartWithElderRayIndicator.defaultProps = {
	type: "svg",
};
OHLCChartWithElderRayIndicator = fitWidth(OHLCChartWithElderRayIndicator);

export default OHLCChartWithElderRayIndicator;
