"use strict";

import { head, last } from "../utils";

/**
 * Bar width is based on the amount of items in the plot data and the distance between the first and last of those
 * items.
 * @param props the props passed to the series.
 * @param moreProps an object holding the xScale, xAccessor and plotData.
 * @return {number} the bar width.
 */
export function plotDataLengthBarWidth(props, moreProps) {
	const { widthRatio: widthRatio = 0.8 } = props;
	const { xScale: scale, xAccessor: accessor, plotData } = moreProps;

	const width = Math.abs((scale(accessor(last(plotData))) - scale(accessor(head(plotData)))) / (plotData.length - 1));
	return width * widthRatio;
}

/**
 * Generates a width function that calculates the bar width based on the given time interval.
 * @param interval a d3-time time interval.
 * @return {Function} the width function.
 */
export function timeIntervalBarWidth(interval) {
	return function(props, moreProps) {
		const { widthRatio: widthRatio = 0.8 } = props;
		const { xScale: scale, xAccessor: accessor, plotData } = moreProps;

		const first = accessor(head(plotData));
		return Math.abs(scale(interval.offset(first, 1)) - scale(first)) * widthRatio;
	};
}
