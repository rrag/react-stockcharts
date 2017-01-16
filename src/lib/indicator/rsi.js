"use strict";

import { rebind } from "d3fc-rebind";

import { merge } from "../utils";
import { rsi } from "../calculator";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "RSI";

export default function() {
	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.rsi);

	var underlyingAlgorithm = rsi();

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.rsi = indicator; });

	var indicator = function(data, options = { merge: true }) {
		if (options.merge) {
			if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
			return mergedAlgorithm(data);
		}
		return underlyingAlgorithm(data);
	};

	rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "options", "undefinedLength");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
