"use strict";

import { rebind } from "../utils";

import { kagi } from "../calculator";
import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "Kagi";

export default function() {

	const base = baseIndicator()
		.type(ALGORITHM_TYPE);

	const underlyingAlgorithm = kagi();

	const indicator = underlyingAlgorithm;

	rebind(indicator, base, "id", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "dateAccessor", "dateMutator");
	rebind(indicator, underlyingAlgorithm, "options");

	return indicator;
}
