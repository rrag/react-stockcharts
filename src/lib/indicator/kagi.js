"use strict";

import { rebind } from "d3fc-rebind";

import { kagi } from "./algorithm";
import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "Kagi";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE);

	var underlyingAlgorithm = kagi();

	var indicator = underlyingAlgorithm;

	rebind(indicator, base, "id", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "dateAccessor", "dateMutator");
	rebind(indicator, underlyingAlgorithm, "reversalType", "windowSize", "reversal", "sourcePath");
	// rebind(indicator, mergedAlgorithm, "merge"/*, "skipUndefined"*/);

	return indicator;
}
