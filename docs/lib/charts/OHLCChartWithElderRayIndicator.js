
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	OHLCSeries,
	ElderRaySeries,
	StraightLine,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	OHLCTooltip,
	SingleValueTooltip,
} from "react-stockcharts/lib/tooltip";
import { change, elderRay } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class OHLCChartWithElderRayIndicator extends React.Component {
	render() {
		const elder = elderRay();
		const changeCalculator = change();

		const { type, data: initialData, width, ratio } = this.props;

		const calculatedData = changeCalculator(elder(initialData));
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
			<ChartCanvas height={650}
				width={width}
				ratio={ratio}
				margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart id={1} height={300}
					yExtents={d => [d.high, d.low]}
					padding={{ top: 10, right: 0, bottom: 20, left: 0 }}
				>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<OHLCSeries />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<OHLCTooltip origin={[-40, -10]}/>

				</Chart>
				<Chart id={2} height={150}
					yExtents={d => d.volume}
					origin={(w, h) => [0, h - 450]}
				>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume}
						fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}
						opacity={0.4}/>
				</Chart>
				<Chart id={3} height={100}
					yExtents={[0, elder.accessor()]}
					origin={(w, h) => [0, h - 300]}
					padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={format(".2f")}/>

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<ElderRaySeries yAccessor={elder.accessor()} />
					<SingleValueTooltip
						yAccessor={elder.accessor()}
						yLabel="Elder Ray"
						yDisplayFormat={d => `${format(".2f")(d.bullPower)}, ${format(".2f")(d.bearPower)}`}
						origin={[-40, 15]}/>
				</Chart>
				<Chart id={4} height={100}
					yExtents={[0, d => elder.accessor()(d) && elder.accessor()(d).bullPower]}
					origin={(w, h) => [0, h - 200]}
					padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={format(".2f")}/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<BarSeries
						yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bullPower}
						baseAt={(xScale, yScale, d) => yScale(0)}
						fill="#6BA583" />
					<StraightLine yValue={0} />

					<SingleValueTooltip
						yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bullPower}
						yLabel="Elder Ray - Bull power"
						yDisplayFormat={format(".2f")}
						origin={[-40, 15]}/>
				</Chart>
				<Chart id={5} height={100}
					yExtents={[0, d => elder.accessor()(d) && elder.accessor()(d).bearPower]}
					origin={(w, h) => [0, h - 100]}
					padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={4} tickFormat={format(".2f")}/>
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<BarSeries
						yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bearPower}
						baseAt={(xScale, yScale, d) => yScale(0)}
						fill="#FF0000" />
					<StraightLine yValue={0} />

					<SingleValueTooltip
						yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bearPower}
						yLabel="Elder Ray - Bear power"
						yDisplayFormat={format(".2f")}
						origin={[-40, 15]}/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

OHLCChartWithElderRayIndicator.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

OHLCChartWithElderRayIndicator.defaultProps = {
	type: "svg",
};
OHLCChartWithElderRayIndicator = fitWidth(OHLCChartWithElderRayIndicator);

export default OHLCChartWithElderRayIndicator;
