"use strict";

import d3 from "d3";

import { merge } from "../utils";
import { elderRay } from "./algorithm";

import baseIndicator from "./baseIndicator";
import { ElderRay as defaultOptions } from "./defaultOptions";

const ALGORITHM_TYPE = "ElderRay";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.elderRay);

	var underlyingAlgorithm = elderRay()
		.windowSize(defaultOptions.period)
		.ohlc(defaultOptions.ohlc)
		.movingAverageType(defaultOptions.movingAverageType)
		.source(defaultOptions.source);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.elderRay = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		return mergedAlgorithm(data);
	};

	base.tooltipLabel(`${ALGORITHM_TYPE}: `);

	d3.rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type", "tooltipLabel");
	d3.rebind(indicator, underlyingAlgorithm, "windowSize", "ohlc", "movingAverageType", "source");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
