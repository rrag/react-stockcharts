
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	CandlestickSeries,
	LineSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip, SingleValueTooltip } from "react-stockcharts/lib/tooltip";
import { compare } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class CandleStickChartWithCompare extends React.Component {
	render() {
		const compareCalculator = compare()
			.options({
				basePath: "close",
				mainKeys: ["open", "high", "low", "close"],
				compareKeys: ["AAPLClose", "SP500Close"],
			})
			.accessor(d => d.compare)
			.merge((d, c) => { d.compare = c; });

		const { type, data: initialData, width, ratio } = this.props;

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
			<ChartCanvas height={400}
				width={width}
				ratio={ratio}
				margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				postCalculator={compareCalculator}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart id={1}
					yExtents={d => d.compare}
				>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={5} tickFormat={format(".0%")} />

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries yAccessor={d => d.compare}/>
					<LineSeries yAccessor={d => d.compare.AAPLClose} stroke="#ff7f0e" />
					<LineSeries yAccessor={d => d.compare.SP500Close} stroke="#2ca02c"/>

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.compare.AAPLClose} fill="#ff7f0e"
						displayFormat={format(".0%")} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.compare.SP500Close} fill="#2ca02c"
						displayFormat={format(".0%")} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.compare.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}
						displayFormat={format(".0%")} />

					<OHLCTooltip origin={[-40, 0]} />
					<SingleValueTooltip
						yAccessor={d => d.AAPLClose}
						yLabel="AAPL"
						yDisplayFormat={format(".2f")}
						valueStroke="#ff7f0e"
						/* labelStroke="#4682B4" - optional prop */
						origin={[-40, 20]}/>
					<SingleValueTooltip
						yAccessor={d => d.SP500Close}
						yLabel="S&P 500"
						yDisplayFormat={format(".2f")}
						valueStroke="#2ca02c"
						/* labelStroke="#4682B4" - optional prop */
						origin={[-40, 35]}/>
				</Chart>
				<Chart id={2}
					yExtents={d => d.volume}
					height={150}
					origin={(w, h) => [0, h - 150]}
				>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
				</Chart>
				<CrossHairCursor />

			</ChartCanvas>
		);
	}
}

CandleStickChartWithCompare.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithCompare.defaultProps = {
	type: "svg",
};
CandleStickChartWithCompare = fitWidth(CandleStickChartWithCompare);

export default CandleStickChartWithCompare;
