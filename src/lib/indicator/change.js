"use strict";

import d3 from "d3";

import { merge, slidingWindow } from "../utils";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "Change";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.elderRay);

	var underlyingAlgorithm = slidingWindow()
		.windowSize(2)
		.source(d => d.close)
		.accumulator(([prev, curr]) => {
			var absoluteChange = curr - prev;
			var percentChange = absoluteChange * 100 / prev;
			return { absoluteChange, percentChange };
		});

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
	d3.rebind(indicator, underlyingAlgorithm, "windowSize", "source");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
