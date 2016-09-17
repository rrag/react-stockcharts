"use strict";

import { rebind } from "d3fc-rebind";

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

	rebind(indicator, base, "id", "stroke", "fill", "echo", "type", "tooltipLabel");
	rebind(indicator, underlyingAlgorithm, "dateAccessor", "dateMutator");
	rebind(indicator, underlyingAlgorithm, "reversalType", "fixedBrickSize", "sourcePath", "windowSize");

	return indicator;
}