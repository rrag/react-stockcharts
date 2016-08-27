"use strict";

import d3 from "d3";

import { merge } from "../utils";
import { macd } from "./algorithm";

import baseIndicator from "./baseIndicator";
import { MACD as defaultOptions } from "./defaultOptions";

const ALGORITHM_TYPE = "MACD";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.fill(defaultOptions.fill)
		.stroke(defaultOptions.stroke)
		.accessor(d => d.macd);

	var underlyingAlgorithm = macd()
		.fast(defaultOptions.fast)
		.slow(defaultOptions.slow)
		.signal(defaultOptions.signal)
		.sourcePath(defaultOptions.sourcePath);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.macd = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		return mergedAlgorithm(data);
	};

	indicator.undefinedLength = function() {
		return underlyingAlgorithm.slow() + underlyingAlgorithm.signal();
	};

	d3.rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type", "tooltipLabel");
	d3.rebind(indicator, underlyingAlgorithm, "sourcePath", "fast", "slow", "signal", "options");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
