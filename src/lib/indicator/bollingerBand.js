"use strict";

import d3 from "d3";

import merge from "../utils/merge";

import { BollingerBand as defaultOptions } from "./defaultOptions";
import baseIndicator from "./baseIndicator";
import { bollingerband } from "./algorithm";

const ALGORITHM_TYPE = "Bollinger Band";

export default function() {

	var base = baseIndicator();

	var underlyingAlgorithm = bollingerband()
		.windowSize(defaultOptions.period)
		.movingAverageType(defaultOptions.movingAverageType)
		.multiplier(defaultOptions.multiplier)
		.source(defaultOptions.source);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.bollingerBand = indicator });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`)
		console.log("HERE");
		var newData = mergedAlgorithm(data);
		return newData;
	};

	d3.rebind(indicator, base, "accessor", "stroke", "fill", "echo");
	d3.rebind(indicator, underlyingAlgorithm, "windowSize", "movingAverageType", "multiplier", "source");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}