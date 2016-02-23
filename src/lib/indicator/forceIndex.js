"use strict";

import d3 from "d3";

import { merge } from "../utils";
import { forceIndex } from "./algorithm";

import baseIndicator from "./baseIndicator";
import { ForceIndex as defaultOptions } from "./defaultOptions";

const ALGORITHM_TYPE = "ForceIndex";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.forceIndex);

	var underlyingAlgorithm = forceIndex()
		.volume(defaultOptions.volume)
		.close(defaultOptions.close);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.forceIndex = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		return mergedAlgorithm(data);
	};

	d3.rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type");
	d3.rebind(indicator, underlyingAlgorithm, "close", "volume");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
