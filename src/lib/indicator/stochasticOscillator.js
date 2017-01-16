"use strict";

import { rebind } from "d3fc-rebind";

import { merge } from "../utils";
import { sto } from "../calculator";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "STO";

export default function() {
	var base = baseIndicator()
		.type(ALGORITHM_TYPE);

	var underlyingAlgorithm = sto();

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.sto = indicator; });

	var indicator = function(data, options = { merge: true }) {
		if (options.merge) {
			if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
			return mergedAlgorithm(data);
		}
		return underlyingAlgorithm(data);
	};

	rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "options", "undefinedLength");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
