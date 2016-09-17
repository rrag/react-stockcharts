"use strict";

import { rebind } from "d3fc-rebind";

import { merge } from "../utils";
import { atr } from "./algorithm";

import baseIndicator from "./baseIndicator";
import { ATR as defaultOptions } from "./defaultOptionsForComputation";

const ALGORITHM_TYPE = "ATR";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.atr);

	var underlyingAlgorithm = atr()
		.windowSize(defaultOptions.period);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.atr = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		return mergedAlgorithm(data);
	};

	base.tooltipLabel(() => `${ALGORITHM_TYPE}(${underlyingAlgorithm.windowSize()})`);

	rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type", "tooltipLabel");
	rebind(indicator, underlyingAlgorithm, "windowSize");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
