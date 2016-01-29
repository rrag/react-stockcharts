"use strict";

import merge from "../utils/merge";

import { EMA as defaultOptions } from "./defaultOptions";
import { ema } from "./algorithm";
import baseIndicator from "./baseIndicator";

export default function() {

	var base = baseIndicator();

	var underlyingAlgorithm = ema()
		.windowSize(defaultOptions.period)
		.source(defaultOptions.source);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.ema = indicator });

	var movingAverage = function(data) {
		if (!base.accessor()) throw new Error("set an accessor before calculating")
		return mergedAlgorithm(data);
	};

	d3.rebind(movingAverage, base, "accessor", "stroke", "fill", "echo");
	d3.rebind(movingAverage, underlyingAlgorithm, "windowSize", "source");
	d3.rebind(movingAverage, mergedAlgorithm, "merge", "skipUndefined");

	movingAverage.type = function() {
		return "EMA"
	}
	movingAverage.tooltipLabel = function() {
		return `EMA(${underlyingAlgorithm.windowSize()})`
	}

	return movingAverage;
}