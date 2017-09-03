"use strict";

import { heikinAshi } from "../calculator";
import baseIndicator from "./baseIndicator";

import { rebind, merge } from "../utils";

const ALGORITHM_TYPE = "HeikinAshi";

export default function() {

	const base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.ha);

	const underlyingAlgorithm = heikinAshi();

	const mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => {
			return { ...datum, ...indicator };
		});

	const indicator = function(data, options = { merge: true }) {
		if (options.merge) {
			if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
			return mergedAlgorithm(data);
		}
		return underlyingAlgorithm(data);
	};

	rebind(indicator, base, "accessor", "stroke", "fill", "echo", "type");
	// rebind(indicator, underlyingAlgorithm, "windowSize", "source");
	rebind(indicator, mergedAlgorithm, "merge");

	return indicator;
}
