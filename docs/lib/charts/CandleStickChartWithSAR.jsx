"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from "react-stockcharts";

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries, SARSeries } = series;
var { discontinuousTimeScaleProvider } = scale;

var { EdgeIndicator } = coordinates;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = coordinates;

var { OHLCTooltip, SingleValueTooltip } = tooltip;
var { XAxis, YAxis } = axes;
var { ema, sar } = indicator;
var { fitWidth } = helper;

class CandleStickChartWithSAR extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;
		var ema26 = ema()
			.id(0)
			.windowSize(26)
			.merge((d, c) => {d.ema26 = c})
			.accessor(d => d.ema26);

		const accelerationFactor = .02;
		const maxAccelerationFactor = .2;

		var defaultSar = sar()
			.accelerationFactor(accelerationFactor)
			.maxAccelerationFactor(maxAccelerationFactor)
			.merge((d, c) => {d.sar = c})
			.accessor(d => d.sar);

		var dataWithSar = defaultSar(data);

		return (
			<ChartCanvas ratio={ratio} width={width} height={450}
					margin={{ left: 50, right: 90, top: 10, bottom: 30 }} type={type}
					seriesName="MSFT"
					data={dataWithSar}
					xAccessor={d => d.date}
					xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2016, 0, 1), new Date(2016, 9, 11)]}>

				<Chart id={1}
						yExtents={[d => [d.high, d.low, d.sar]]}
						padding={{ top: 10, bottom: 10 }}>

					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={5} />

					<CandlestickSeries />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<SARSeries yAccessor={d => d.sar}/>

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<OHLCTooltip origin={[-40, 0]}/>
					<SingleValueTooltip
						yLabel={`SAR (${accelerationFactor}, ${maxAccelerationFactor})`} yAccessor={d => d.sar}
						origin={[-40, 20]}/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

/*


*/

CandleStickChartWithSAR.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithSAR.defaultProps = {
	type: "svg",
};
CandleStickChartWithSAR = fitWidth(CandleStickChartWithSAR);

export default CandleStickChartWithSAR;
