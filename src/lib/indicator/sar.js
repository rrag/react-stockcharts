"use strict";

import { rebind } from "d3fc-rebind";

import { merge } from "../utils";

import { sar } from "./algorithm";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "SMA";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.sar);

	var underlyingAlgorithm = sar();

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.sar = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		var newData = mergedAlgorithm(data);
		return newData;
	};
	indicator.undefinedLength = function() {
		return underlyingAlgorithm.windowSize();
	};

	base.tooltipLabel(() => `${ALGORITHM_TYPE}(${underlyingAlgorithm.windowSize()})`);

	rebind(indicator, base, "id", "accessor", "stroke", "echo", "type", "tooltipLabel");
	rebind(indicator, underlyingAlgorithm, "undefinedLength", "accelerationFactor", "maxAccelerationFactor");
	rebind(indicator, mergedAlgorithm, "merge");

	return indicator;
}
