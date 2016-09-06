"use strict";

import d3 from "d3";

import { merge } from "../utils";

import { sma } from "./algorithm";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "SMA";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.sma);

	var underlyingAlgorithm = sma();

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.sma = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		var newData = mergedAlgorithm(data);
		return newData;
	};
	indicator.undefinedLength = function() {
		return underlyingAlgorithm.windowSize();
	};

	base.tooltipLabel(() => `${ALGORITHM_TYPE}(${underlyingAlgorithm.windowSize()})`);

	d3.rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type", "tooltipLabel");
	d3.rebind(indicator, underlyingAlgorithm, "windowSize", "undefinedValue", "sourcePath", "skipInitial");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");


	return indicator;
}
