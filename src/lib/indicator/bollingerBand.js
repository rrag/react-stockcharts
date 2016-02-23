"use strict";

import d3 from "d3";

import { merge } from "../utils";

import { BollingerBand as defaultOptions } from "./defaultOptions";
import baseIndicator from "./baseIndicator";
import { bollingerband } from "./algorithm";

const ALGORITHM_TYPE = "BollingerBand";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.bollingerBand)
		.stroke({
			top: "#964B00",
			middle: "#000000",
			bottom: "#964B00",
		})
		.fill("#4682B4");

	var underlyingAlgorithm = bollingerband()
		.windowSize(defaultOptions.period)
		.movingAverageType(defaultOptions.movingAverageType)
		.multiplier(defaultOptions.multiplier)
		.source(defaultOptions.source);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.bollingerBand = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);

		var newData = mergedAlgorithm(data);
		return newData;
	};

	base.tooltipLabel(() => `BB (${underlyingAlgorithm.windowSize()}, ${underlyingAlgorithm.multiplier()}`
		+ `, ${underlyingAlgorithm.movingAverageType()}): `);

	d3.rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type", "tooltipLabel");
	d3.rebind(indicator, underlyingAlgorithm, "windowSize", "movingAverageType", "multiplier", "source");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}