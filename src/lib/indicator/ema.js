"use strict";

import merge from "../utils/merge";

import { EMA as defaultOptions } from "./defaultOptions";
import { ema } from "./algorithm";
import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "EMA";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.ema);

	var underlyingAlgorithm = ema()
		.windowSize(defaultOptions.period)
		.source(defaultOptions.source);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.ema = indicator });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`)
		return mergedAlgorithm(data);
	};
	base.tooltipLabel(`${ALGORITHM_TYPE}(${underlyingAlgorithm.windowSize()})`);

	d3.rebind(indicator, base, "accessor", "stroke", "fill", "echo", "type", "tooltipLabel");
	d3.rebind(indicator, underlyingAlgorithm, "windowSize", "source");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}