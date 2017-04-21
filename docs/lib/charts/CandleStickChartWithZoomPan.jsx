"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	CandlestickSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	OHLCTooltip,
} from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

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
		var { type, data: initialData, width, ratio } = this.props;
		var { mouseMoveEvent, panEvent, zoomEvent } = this.props;
		var { clamp } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
			<ChartCanvas ref={this.saveNode} height={900}
					ratio={ratio}
					width={width}
					margin={{ left: 70, right: 70, top: 10, bottom: 30 }}

					mouseMoveEvent={mouseMoveEvent}
					panEvent={panEvent}
					zoomEvent={zoomEvent}
					clamp={clamp}

					type={type}
					seriesName="MSFT"
					data={data}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}>

				<Chart id={1}
						yExtents={[d => [d.high, d.low]]}>
					<XAxis axisAt="bottom" orient="bottom" zoomEnabled={!zoomEvent} />
					<YAxis axisAt="right" orient="right" ticks={5} zoomEnabled={!zoomEvent} />

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
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")} zoomEnabled={!zoomEvent} />

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
	mouseMoveEvent: true,
	panEvent: true,
	zoomEvent: true,
	clamp: false,
};

CandleStickChartWithZoomPan = fitWidth(CandleStickChartWithZoomPan);

export default CandleStickChartWithZoomPan;
