
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";

import {
	PriceCoordinate
} from "react-stockcharts/lib/coordinates";

class CandleStickChartWithPriceMarkers extends React.Component {
	render() {
		const { type, data: initialData, width, ratio } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);
		const xExtents = [
			xAccessor(last(data)),
			xAccessor(data[data.length - 100])
		];

		return (
			<ChartCanvas height={400}
				ratio={ratio}
				width={width}
				margin={{ left: 60, right: 60, top: 10, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>

				<Chart id={1} yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" ticks={5} />
					<YAxis axisAt="right" orient="right" ticks={5} />
					<CandlestickSeries />

					<PriceCoordinate
						at="left"
						orient="left"
						price={60}
						displayFormat={format(".2f")}
					/>

					<PriceCoordinate
						at="right"
						orient="right"
						price={55}
						stroke="#3490DC"
						strokeWidth={1}
						fill="#FFFFFF"
						textFill="#22292F"
						arrowWidth={7}
						strokeDasharray="ShortDash"
						displayFormat={format(".2f")}
					/>

				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickChartWithPriceMarkers.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithPriceMarkers.defaultProps = {
	type: "svg",
};
CandleStickChartWithPriceMarkers = fitWidth(CandleStickChartWithPriceMarkers);

export default CandleStickChartWithPriceMarkers;
