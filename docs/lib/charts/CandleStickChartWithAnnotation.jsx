"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	CandlestickSeries,
	LineSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { LabelAnnotation, Label, Annotate } from "react-stockcharts/lib/annotation";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip, MovingAverageTooltip } from "react-stockcharts/lib/tooltip";
import { ema } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class CandleStickChartWithAnnotation extends React.Component {
	render() {
		var ema20 = ema()
			.id(0)
			.windowSize(13)
			.merge((d, c) => {d.ema20 = c;})
			.accessor(d => d.ema20);

		var ema50 = ema()
			.id(2)
			.windowSize(50)
			.merge((d, c) => {d.ema50 = c;})
			.accessor(d => d.ema50);

		var annotationProps = {
			fontFamily: "Glyphicons Halflings",
			fontSize: 20,
			fill: "#060F8F",
			opacity: 0.8,
			text: "\ue182",
			y: ({ yScale }) => yScale.range()[0],
			onClick: console.log.bind(console),
			tooltip: d => timeFormat("%B")(d.date),
			// onMouseOver: console.log.bind(console),
		};

		var margin = { left: 80, right: 80, top: 30, bottom: 50 };
		var height = 400;

		var [yAxisLabelX, yAxisLabelY] = [width - margin.left - 40, margin.top + (height - margin.top - margin.bottom) / 2];

		var { type, data: initialData, width, ratio } = this.props;

		const calculatedData = ema50(ema20(initialData));
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
			<ChartCanvas height={height}
					ratio={ratio}
					width={width}
					margin={margin}
					type={type}
					seriesName="MSFT"
					data={data}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					xExtents={xExtents}>

				<Label x={(width - margin.left - margin.right) / 2} y={30}
					fontSize="30" text="Chart title here" />

				<Chart id={1}
						yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<Label x={(width - margin.left - margin.right) / 2} y={height - 45}
						fontSize="12" text="XAxis Label here" />

					<YAxis axisAt="right" orient="right" ticks={5} />

					<Label x={yAxisLabelX} y={yAxisLabelY}
						rotate={-90}
						fontSize="12" text="YAxis Label here" />

					<CandlestickSeries />
					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<OHLCTooltip origin={[-40, 0]}/>
					<MovingAverageTooltip onClick={(e) => console.log(e)} origin={[-38, 15]}
						calculators={[ema20, ema50]}/>

					<Annotate with={LabelAnnotation}
						when={d => d.date.getDate() === 1 /* some condition */}
						usingProps={annotationProps} />

				</Chart>
				<CrossHairCursor strokeDasharray="LongDashDot" />

		</ChartCanvas>
		);
	}
}

/*


*/

CandleStickChartWithAnnotation.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithAnnotation.defaultProps = {
	type: "svg",
};

CandleStickChartWithAnnotation = fitWidth(CandleStickChartWithAnnotation);

export default CandleStickChartWithAnnotation;
