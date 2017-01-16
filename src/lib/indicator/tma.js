"use strict";

import { rebind } from "d3fc-rebind";

import { merge } from "../utils";

import { tma } from "../calculator";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "TMA";

export default function() {

	var base = baseIndicator()
        .type(ALGORITHM_TYPE)
        .accessor(d => d.tma);

	var underlyingAlgorithm = tma();

	var mergedAlgorithm = merge()
        .algorithm(underlyingAlgorithm)
        .merge((datum, indicator) => { datum.tma = indicator; });

	var indicator = function(data, options = { merge: true }) {
		if (options.merge) {
			if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
			return mergedAlgorithm(data);
		}
		return underlyingAlgorithm(data);
	};
	rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "undefinedLength");
	rebind(indicator, underlyingAlgorithm, "options");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
