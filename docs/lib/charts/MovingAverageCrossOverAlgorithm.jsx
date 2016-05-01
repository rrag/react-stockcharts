"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries } = ReStock.series;
var { financeEODDiscontiniousScale } = ReStock.scale;

var { EdgeIndicator } = ReStock.coordinates;
var { MouseCoordinates, CurrentCoordinate } = ReStock.coordinates;
var { Annotate, LabelAnnotation, Label } = ReStock.annotation;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { ema, sma } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

var algorithm = ReStock.algorithm.default;

var xScale = financeEODDiscontiniousScale();

class MovingAverageCrossOverAlgorithm extends React.Component {
	render() {
		var { data, type, width } = this.props;

		var ema20 = ema()
			.id(0)
			.windowSize(13)
			.merge((d, c) => {d.ema20 = c})
			.accessor(d => d.ema20);

		var ema50 = ema()
			.id(2)
			.windowSize(50)
			.merge((d, c) => {d.ema50 = c})
			.accessor(d => d.ema50);

		var buySell = algorithm()
			.windowSize(2)
			.accumulator(([prev, now]) => {
				var { ema20: prevShortTerm, ema50: prevLongTerm } = prev;
				var { ema20: nowShortTerm, ema50: nowLongTerm } = now;
				if (prevShortTerm < prevLongTerm && nowShortTerm > nowLongTerm) return "LONG";
				if (prevShortTerm > prevLongTerm && nowShortTerm < nowLongTerm) return "SHORT";
			})
			.merge((d, c) => {d.longShort = c})

		var defaultAnnotationProps = {
			fontFamily: "Glyphicons Halflings",
			fontSize: 20,
			opacity: 0.8,
			onClick: console.log.bind(console),
		}

		var longAnnotationProps = {
			...defaultAnnotationProps,
			fill: "#006517",
			text: "\ue093",
			y: ({ yScale, datum }) => yScale(datum.low) + 20,
			tooltip: "Go long",
		};

		var shortAnnotationProps = {
			...defaultAnnotationProps,
			fill: "#E20000",
			text: "\ue094",
			y: ({ yScale, datum }) => yScale(datum.high),
			tooltip: "Go short",
		};

		var margin = {left: 80, right: 80, top:30, bottom: 50};
		var height = 400;

		var [yAxisLabelX, yAxisLabelY] = [width -margin.left - 40, margin.top + (height - margin.top - margin.bottom) / 2]
		return (
			<ChartCanvas width={width} height={height}
					margin={margin} type={type}
					seriesName="MSFT"
					data={data} calculator={[ema20, ema50, buySell]}
					allowedIntervals={["D", "W", "M"]}
					xAccessor={d => d.date} discontinous xScale={xScale}
					xExtents={[new Date(2015, 0, 1), new Date(2015, 5, 8)]}>

				<Label x={(width -margin.left - margin.right)/ 2} y={30}
					fontSize="30" text="Moving Average Crossover Algorithm" />

				<Chart id={1}
						yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
						yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")} 
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>

					<Label x={(width -margin.left - margin.right)/ 2} y={height - 45}
						fontSize="12" text="XAxis Label here" />

					<YAxis axisAt="right" orient="right" ticks={5} />

					<Label x={yAxisLabelX} y={yAxisLabelY}
						rotate={-90}
						fontSize="12" text="YAxis Label here" />

					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<CurrentCoordinate id={1} yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate id={2} yAccessor={ema50.accessor()} fill={ema50.stroke()} />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]} 
						calculators={[ema20, ema50]}/>
				</TooltipContainer>

				<Annotate id={0} chartId={1} with={LabelAnnotation} when={d => d.longShort === "LONG"}
					usingProps={longAnnotationProps} />
				<Annotate id={1} chartId={1} with={LabelAnnotation} when={d => d.longShort === "SHORT"}
					usingProps={shortAnnotationProps} />

			</ChartCanvas>
		);
	}
}

/*
					<LineSeries yAccessor={d => d.close} stroke="#000000" />

*/

MovingAverageCrossOverAlgorithm.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

MovingAverageCrossOverAlgorithm.defaultProps = {
	type: "svg",
};

MovingAverageCrossOverAlgorithm = fitWidth(MovingAverageCrossOverAlgorithm);

export default MovingAverageCrossOverAlgorithm;
