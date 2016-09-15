"use strict";

import d3 from "d3";

import { merge } from "../utils";
import { change } from "./algorithm";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "Change";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.elderRay);

	var underlyingAlgorithm = change();

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => {
			datum.absoluteChange = indicator.absoluteChange;
			datum.percentChange = indicator.percentChange;
		});

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		return mergedAlgorithm(data);
	};

	d3.rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type");
	d3.rebind(indicator, underlyingAlgorithm, "windowSize", "sourcePath");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
