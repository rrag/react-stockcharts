"use strict";

import { merge } from "../utils";

import { renko } from "./algorithm";
import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "Renko";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE);

	var underlyingAlgorithm = renko();

	var indicator = function(data) {
		return underlyingAlgorithm(data);
	};

	d3.rebind(indicator, base, "id"/*, "accessor"*/, "stroke", "fill", "echo", "type", "tooltipLabel");
	d3.rebind(indicator, underlyingAlgorithm, "dateAccessor", "dateMutator", "indexMutator", "indexAccessor");
	d3.rebind(indicator, underlyingAlgorithm, "reversal", "boxSize", "source");
	// d3.rebind(indicator, mergedAlgorithm, "merge"/*, "skipUndefined"*/);

	return indicator;
}