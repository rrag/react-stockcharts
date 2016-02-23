"use strict";

import d3 from "d3";

import { haikinAshi } from "./algorithm";
import baseIndicator from "./baseIndicator";

import { merge } from "../utils";

const ALGORITHM_TYPE = "HaikinAshi";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.ha);

	var underlyingAlgorithm = haikinAshi();

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.ha = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		return mergedAlgorithm(data);
	};

	d3.rebind(indicator, base, "accessor", "stroke", "fill", "echo", "type");
	// d3.rebind(indicator, underlyingAlgorithm, "windowSize", "source");
	d3.rebind(indicator, mergedAlgorithm, "merge");

	return indicator;
}