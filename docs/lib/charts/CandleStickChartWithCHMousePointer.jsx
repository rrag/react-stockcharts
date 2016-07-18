"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { CandlestickSeries, BarSeries } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = ReStock.coordinates;
var { TooltipContainer, OHLCTooltip } = ReStock.tooltip;

var { XAxis, YAxis } = ReStock.axes;

var { fitWidth } = ReStock.helper;

class CandleStickChartWithCHMousePointer extends React.Component {
	render() {
		var { data, type, width } = this.props;

		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 70, right: 70, top:10, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1}
						yExtents={[d => [d.high, d.low]]}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />
					<CandlestickSeries />
				</Chart>
				<Chart id={2} height={150}
						yExtents={d => d.volume}
						origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="left"
						orient="left"
						displayFormat={d3.format(".4s")} />

					<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"} />
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove={true} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
				</TooltipContainer>
			</ChartCanvas>
		);
	}
};

/*


*/
CandleStickChartWithCHMousePointer.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithCHMousePointer.defaultProps = {
	type: "svg",
};
CandleStickChartWithCHMousePointer = fitWidth(CandleStickChartWithCHMousePointer);

export default CandleStickChartWithCHMousePointer;
