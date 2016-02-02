"use strict";

import merge from "../utils/merge";

import { EMA as defaultOptions } from "./defaultOptions";
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

	base.tooltipLabel(`${ALGORITHM_TYPE}`);

	d3.rebind(indicator, base, "id"/*, "accessor"*/, "stroke", "fill", "echo", "type", "tooltipLabel");
	// d3.rebind(indicator, underlyingAlgorithm, "windowSize", "source");
	// d3.rebind(indicator, mergedAlgorithm, "merge"/*, "skipUndefined"*/);

	return indicator;
}