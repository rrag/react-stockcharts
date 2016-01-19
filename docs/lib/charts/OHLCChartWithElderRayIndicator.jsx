"use strict";

import React from "react";
import d3 from "d3";

import * as ReStock from "react-stockcharts";

var { ChartCanvas, Chart, DataSeries, OverlaySeries, EventCapture } = ReStock;

var { OHLCSeries, HistogramSeries, LineSeries, AreaSeries, ElderRaySeries, StraightLine } = ReStock.series;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { EdgeContainer, EdgeIndicator } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, SingleValueTooltip, RSITooltip } = ReStock.tooltip;
var { StockscaleTransformer } = ReStock.transforms;

var { XAxis, YAxis } = ReStock.axes;
var { Copy, EMA, SMA, ElderRay } = ReStock.indicator;

var { fitWidth } = ReStock.helper;

class OHLCChartWithElderRayIndicator extends React.Component {
	render() {
		var { data, type, width } = this.props;

		return (
			<ChartCanvas width={width} height={650}
				margin={{left: 70, right: 70, top:20, bottom: 30}} initialDisplay={200} 
				dataTransform={[ { transform: StockscaleTransformer } ]}
				data={data} type={type}>
				<Chart id={1} yMousePointerDisplayLocation="right" height={300}
						yMousePointerDisplayFormat={d3.format(".2f")} padding={{ top: 10, right: 0, bottom: 20, left: 0 }}>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<DataSeries id={0} yAccessor={OHLCSeries.yAccessor} >
						<OHLCSeries />
					</DataSeries>
					<DataSeries id={1} indicator={EMA} options={{ period: 26 }} >
						<LineSeries />
					</DataSeries>
					<DataSeries id={2} indicator={EMA} options={{ period: 12 }} >
						<LineSeries />
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={1} forDataSeries={1} />
				<CurrentCoordinate forChart={1} forDataSeries={2} />
				<Chart id={2} yMousePointerDisplayLocation="left" yMousePointerDisplayFormat={d3.format(".4s")}
						height={150} origin={(w, h) => [0, h - 450]} >
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>
					<DataSeries id={0} yAccessor={(d) => d.volume} >
						<HistogramSeries
							fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"}
							opacity={0.5} />
					</DataSeries>
				</Chart>
				<CurrentCoordinate forChart={2} forDataSeries={0} />
				<EdgeContainer>
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={1} forDataSeries={1} />
					<EdgeIndicator itemType="last" orient="right"
						edgeAt="right" forChart={1} forDataSeries={2} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={1} forDataSeries={1} />
					<EdgeIndicator itemType="first" orient="left"
						edgeAt="left" forChart={1} forDataSeries={2} />
				</EdgeContainer>
				<Chart id={3} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}
						height={100} origin={(w, h) => [0, h - 300]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={d3.format("s")}/>
					<DataSeries id={0} indicator={ElderRay} >
						<ElderRaySeries />
					</DataSeries>
				</Chart>
				<Chart id={4} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}
						height={100} origin={(w, h) => [0, h - 200]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={d3.format(".2f")}/>
					<DataSeries id={0} indicator={Copy} options={{ source: [ "chart_3", "overlay_0", "bullPower" ], period:13 }} >
						<HistogramSeries
							baseAt={(xScale, yScale, d) => yScale(0)}
							fill="#6BA583" />
						<StraightLine yValue={0} />
					</DataSeries>
				</Chart>
				<Chart id={5} yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}
						height={100} origin={(w, h) => [0, h - 100]} padding={{ top: 10, right: 0, bottom: 10, left: 0 }} >
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={d3.format(".2f")}/>
					<DataSeries id={0} indicator={Copy} options={{ source: [ "chart_3", "overlay_0", "bearPower" ], period:13 }} >
						<HistogramSeries
							baseAt={(xScale, yScale, d) => yScale(0)}
							fill="#FF0000"
							opacity={0.5} />
						<StraightLine yValue={0} />
					</DataSeries>
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, -10]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 5]} />
					<SingleValueTooltip forChart={3} forSeries={0}
						yLabel="Elder Ray"
						yDisplayFormat={d => `${d3.format(".2f")(d.bullPower)}, ${d3.format(".2f")(d.bearPower)}`}
						origin={[-40, 15]}/>
					<SingleValueTooltip forChart={4} forSeries={0}
						yLabel={indicator => `Elder Ray - Bull power (${ indicator.options().period })`}
						yDisplayFormat={d3.format(".2f")}
						origin={[-40, 15]}/>
					<SingleValueTooltip forChart={5} forSeries={0}
						yLabel={indicator => `Elder Ray - Bear power (${ indicator.options().period })`}
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
