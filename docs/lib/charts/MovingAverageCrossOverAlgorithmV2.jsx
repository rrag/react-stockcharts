"use strict";

import React from "react";
import d3 from "d3";

import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { EdgeIndicator } = ReStock.coordinates;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = ReStock.coordinates;
var { Annotate, SvgPathAnnotation, Label, buyPath, sellPath } = ReStock.annotation;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { ema, sma } = ReStock.indicator;
var { fitWidth } = ReStock.helper;

var algorithm = ReStock.algorithm.default;

class MovingAverageCrossOverAlgorithmV2 extends React.Component {
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
			onClick: console.log.bind(console),
		}

		var longAnnotationProps = {
			...defaultAnnotationProps,
			y: ({ yScale, datum }) => yScale(datum.low),
			fill: "#006517",
			path: buyPath,
			tooltip: "Go long",
		};

		var shortAnnotationProps = {
			...defaultAnnotationProps,
			y: ({ yScale, datum }) => yScale(datum.high),
			fill: "#FF0000",
			path: sellPath,
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
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2015, 0, 1), new Date(2015, 5, 8)]}>

				<Chart id={1}
						yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>

					<Label x={(width -margin.left - margin.right)/ 2} y={height - 45}
						fontSize="12" text="XAxis Label here" />

					<YAxis axisAt="right" orient="right" ticks={5} />

					<Label x={yAxisLabelX} y={yAxisLabelY}
						rotate={-90}
						fontSize="12" text="YAxis Label here" />
					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<CurrentCoordinate id={1} yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate id={2} yAccessor={ema50.accessor()} fill={ema50.stroke()} />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
					<MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]} 
						calculators={[ema20, ema50]}/>
				</TooltipContainer>

				<Annotate id={0} chartId={1} with={SvgPathAnnotation} when={d => d.longShort === "LONG"}
					usingProps={longAnnotationProps} />
				<Annotate id={1} chartId={1} with={SvgPathAnnotation} when={d => d.longShort === "SHORT"}
					usingProps={shortAnnotationProps} />

			</ChartCanvas>
		);
	}
}

/*
					<LineSeries yAccessor={d => d.close} stroke="#000000" />

*/

MovingAverageCrossOverAlgorithmV2.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

MovingAverageCrossOverAlgorithmV2.defaultProps = {
	type: "svg",
};

MovingAverageCrossOverAlgorithmV2 = fitWidth(MovingAverageCrossOverAlgorithmV2);

export default MovingAverageCrossOverAlgorithmV2;
