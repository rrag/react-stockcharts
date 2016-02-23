"use strict";

import d3 from "d3";

import { merge, slidingWindow } from "../utils";

import { SMA as defaultOptions } from "./defaultOptions";
import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "SMA";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.sma);

	var underlyingAlgorithm = slidingWindow()
		.windowSize(defaultOptions.period)
		.source(defaultOptions.source)
		.accumulator(values => d3.mean(values));

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.sma = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		var newData = mergedAlgorithm(data);
		return newData;
	};

	base.tooltipLabel(() => `${ALGORITHM_TYPE}(${underlyingAlgorithm.windowSize()})`);

	d3.rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type", "tooltipLabel");
	d3.rebind(indicator, underlyingAlgorithm, "windowSize", "source", "undefinedValue", "skipInitial");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");


	return indicator;
}