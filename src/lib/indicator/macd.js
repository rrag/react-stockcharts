"use strict";

import { rebind, merge } from "../utils";

import { macd } from "../calculator";

import baseIndicator from "./baseIndicator";
import { MACD as appearanceOptions } from "./defaultOptionsForAppearance";

const ALGORITHM_TYPE = "MACD";

export default function() {

	const base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.fill(appearanceOptions.fill)
		.stroke(appearanceOptions.stroke)
		.accessor(d => d.macd);

	const underlyingAlgorithm = macd();

	const mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.macd = indicator; });

	const indicator = function(data, options = { merge: true }) {
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
