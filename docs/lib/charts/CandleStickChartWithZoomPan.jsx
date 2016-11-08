"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from "react-stockcharts";

var { CandlestickSeries, BarSeries } = series;
var { discontinuousTimeScaleProvider } = scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = coordinates;

var { OHLCTooltip } = tooltip;

var { XAxis, YAxis } = axes;

var { fitWidth } = helper;

class CandleStickChartWithZoomPan extends React.Component {
	constructor(props) {
		super(props);
		this.saveNode = this.saveNode.bind(this);
		this.resetYDomain = this.resetYDomain.bind(this);
	}
	saveNode(node) {
		this.node = node;
	}
	resetYDomain() {
		this.node.resetYDomain();
	}
	render() {
		var { data, type, width, ratio, disableMouseMoveEvent, disablePanEvent, disableZoomEvent } = this.props;
		return (
			<ChartCanvas ref={this.saveNode}
					ratio={ratio} width={width} height={400}
					margin={{ left: 70, right: 70, top: 10, bottom: 30 }} type={type}
					seriesName="MSFT"
					data={data}
					disableMouseMoveEvent={disableMouseMoveEvent}
					disablePanEvent={disablePanEvent}
					disableZoomEvent={disableZoomEvent}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
				<Chart id={1}
						yExtents={[d => [d.high, d.low]]}>
					<XAxis axisAt="bottom" orient="bottom" zoomEnabled={!disableZoomEvent} />
					<YAxis axisAt="right" orient="right" ticks={5} zoomEnabled={!disableZoomEvent} />

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries />
					<OHLCTooltip origin={[-40, 0]}/>
				</Chart>
				<Chart id={2}
						yExtents={d => d.volume}
						height={150} origin={(w, h) => [0, h - 150]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")} zoomEnabled={!disableZoomEvent} />

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"} />
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CandleStickChartWithZoomPan.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithZoomPan.defaultProps = {
	type: "svg",
	disableMouseMoveEvent: false,
	disablePanEvent: false,
	disableZoomEvent: false,
};

CandleStickChartWithZoomPan = fitWidth(CandleStickChartWithZoomPan);


export default CandleStickChartWithZoomPan;
