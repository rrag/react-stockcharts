"use strict";

import merge from "../utils/merge";

import { kagi } from "./algorithm";
import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "Kagi";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE);

	var underlyingAlgorithm = kagi();

	var indicator = function(data) {
		return underlyingAlgorithm(data);
	};

	d3.rebind(indicator, base, "id"/*, "accessor"*/, "stroke", "fill", "echo", "type");
	d3.rebind(indicator, underlyingAlgorithm, "dateAccessor", "dateMutator", "indexMutator");
	// d3.rebind(indicator, mergedAlgorithm, "merge"/*, "skipUndefined"*/);

	return indicator;
}