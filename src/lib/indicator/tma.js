"use strict";

import { rebind } from "d3fc-rebind";

import { merge } from "../utils";

import { tma } from "./algorithm";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "TMA";

export default function() {

	var base = baseIndicator()
        .type(ALGORITHM_TYPE)
        .accessor(d => d.tma);

	var underlyingAlgorithm = tma();

	var mergedAlgorithm = merge()
        .algorithm(underlyingAlgorithm)
        .merge((datum, indicator) => { datum.tma = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		var newData = mergedAlgorithm(data);
		return newData;
	};
	indicator.undefinedLength = function() {
		return underlyingAlgorithm.windowSize();
	};

	base.tooltipLabel(() => `${ALGORITHM_TYPE}(${underlyingAlgorithm.windowSize()})`);

	rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type", "tooltipLabel");
	rebind(indicator, underlyingAlgorithm, "windowSize", "undefinedLength", "sourcePath");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
