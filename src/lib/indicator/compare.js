"use strict";

import { rebind } from "d3fc-rebind";

import { merge } from "../utils";
import { compare } from "./algorithm";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "Compare";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.compare);

	var underlyingAlgorithm = compare()
		.base(d => d.close)
		.mainKeys(["open", "high", "low", "close"]);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.compare = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		return mergedAlgorithm(data);
	};

	rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "base", "mainKeys", "compareKeys");
	rebind(indicator, mergedAlgorithm, "merge");

	return indicator;
}
