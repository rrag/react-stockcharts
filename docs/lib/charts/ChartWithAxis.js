import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { BarSeries, CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class ChartWithAxis extends React.Component {
	render() {
		const { type, data: initialData, width, ratio } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
			d => d.date
		);
		const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
			initialData
		);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
			<ChartCanvas
				height={400}
				ratio={ratio}
				width={width}
				margin={{ left: 70, right: 70, top: 30, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				xExtents={xExtents}
			>
				<Chart id={1} yExtents={[d => [d.high, d.low]]}>
					<XAxis axisAt="bottom" orient="bottom" />
					<XAxis axisAt="top" orient="top" />
					<YAxis axisAt="right" orient="right" />
					<YAxis axisAt="left" orient="left" />
				</Chart>
			</ChartCanvas>
		);
	}
}

ChartWithAxis.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

ChartWithAxis.defaultProps = {
	type: "svg"
};
ChartWithAxis = fitWidth(
	ChartWithAxis
);

export default ChartWithAxis;
