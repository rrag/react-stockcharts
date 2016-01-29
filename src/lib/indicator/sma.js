"use strict";

import d3 from "d3";

import merge from "../utils/merge";
import slidingWindow from "../utils/slidingWindow";

import { SMA as defaultOptions } from "./defaultOptions";
import baseIndicator from "./baseIndicator";

export default function() {

	var base = baseIndicator();

	var underlyingAlgorithm = slidingWindow()
		.windowSize(defaultOptions.period)
		.source(defaultOptions.source)
		.accumulator(values => d3.mean(values));

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.sma = indicator });

	var movingAverage = function(data) {
		if (!base.accessor()) throw new Error("set an accessor before calculating")
		var newData = mergedAlgorithm(data);
		// console.log("HERE")
		return newData;
	};

	d3.rebind(movingAverage, base, "accessor", "stroke", "fill", "echo");
	d3.rebind(movingAverage, underlyingAlgorithm, "windowSize", "source", "undefinedValue", "skipInitial");
	d3.rebind(movingAverage, mergedAlgorithm, "merge", "skipUndefined");

	movingAverage.type = function() {
		return "SMA"
	}
	movingAverage.tooltipLabel = function() {
		return `SMA(${underlyingAlgorithm.windowSize()})`
	}
	return movingAverage;
}