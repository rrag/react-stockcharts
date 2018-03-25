

import { rebind } from "../utils";

import { renko } from "../calculator";
import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "Renko";

export default function() {

	const base = baseIndicator()
		.type(ALGORITHM_TYPE);

	const underlyingAlgorithm = renko();

	const indicator = underlyingAlgorithm;

	rebind(indicator, base, "id", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "dateAccessor", "dateMutator");
	rebind(indicator, underlyingAlgorithm, "options");

	return indicator;
}