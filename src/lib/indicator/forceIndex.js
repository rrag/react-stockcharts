"use strict";

import { rebind } from "d3fc-rebind";

import { merge } from "../utils";
import { forceIndex } from "./algorithm";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "ForceIndex";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.forceIndex);

	var underlyingAlgorithm = forceIndex();

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.forceIndex = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		return mergedAlgorithm(data);
	};

	rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "sourcePath");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
