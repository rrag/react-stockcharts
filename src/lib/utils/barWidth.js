"use strict";

import { head, last } from "../utils";

/**
 * Bar width is based on the amount of items in the plot data and the distance between the first and last of those items.
 * @param scale the scale of the axis.
 * @param accessor the accessor to retrieve the value on the axis.
 * @param plotData the plot data.
 * @return {number} the bar width.
 */
export function plotDataLengthBarWidth(scale, accessor, plotData) {
	return Math.abs((scale(accessor(last(plotData))) - scale(accessor(head(plotData)))) / (plotData.length - 1));
}

/**
 * Generates a width function that calculates the bar width based on the given time interval.
 * @param interval a d3-time time interval.
 * @return {Function} the width function.
 */
export function timeIntervalBarWidth(interval) {
	return function(scale, accessor, plotData) {
		const first = accessor(head(plotData));
		return Math.abs(scale(interval.offset(first, 1)) - scale(first));
	};
}
