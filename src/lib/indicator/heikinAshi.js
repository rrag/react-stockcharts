"use strict";

import { rebind } from "d3fc-rebind";

import { heikinAshi } from "./algorithm";
import baseIndicator from "./baseIndicator";

import { merge } from "../utils";

const ALGORITHM_TYPE = "HeikinAshi";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.ha);

	var underlyingAlgorithm = heikinAshi();

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => {
			return { ...datum, ...indicator };
		});

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		return mergedAlgorithm(data);
	};

	rebind(indicator, base, "accessor", "stroke", "fill", "echo", "type");
	// rebind(indicator, underlyingAlgorithm, "windowSize", "source");
	rebind(indicator, mergedAlgorithm, "merge");

	return indicator;
}
