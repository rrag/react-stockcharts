"use strict";

import d3 from "d3";

import { isDefined, isNotDefined, merge, slidingWindow } from "../utils";

import { ElderImpulse as defaultOptions } from "./defaultOptions";
import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "ElderImpulse";

export default function() {

	var macdSource, emaSource;

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.stroke(d => defaultOptions.stroke[d.elderImpulse])
		.accessor([d => d.close])
		.fill(undefined);

	var underlyingAlgorithm = slidingWindow()
		.windowSize(2)
		.undefinedValue("neutral")
		.accumulator(([prev, curr]) => {
			if (isNotDefined(macdSource)) throw new Error(`macdSource not defined for ${ALGORITHM_TYPE} calculator`);
			if (isNotDefined(emaSource)) throw new Error(`emaSource not defined for ${ALGORITHM_TYPE} calculator`);

			if (isDefined(macdSource(prev)) && isDefined(emaSource(prev))) {
				var prevMACDDivergence = macdSource(prev).divergence;
				var currMACDDivergence = macdSource(curr).divergence;

				var prevEMA = emaSource(prev);
				var currEMA = emaSource(curr);

				if (currMACDDivergence >= prevMACDDivergence
					&& currEMA >= prevEMA) return "up";

				if (currMACDDivergence <= prevMACDDivergence
					&& currEMA <= prevEMA) return "down";
			}
			return "neutral";
		});

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.elderImpulse = indicator; });

	var indicator = function(data) {
		var newData = mergedAlgorithm(data);
		return newData;
	};
	indicator.macdSource = function(x) {
		if (!arguments.length) return macdSource;
		macdSource = x;
		return indicator;
	};
	indicator.emaSource = function(x) {
		if (!arguments.length) return emaSource;
		emaSource = x;
		return indicator;
	};
	d3.rebind(indicator, base, "id", "stroke", "echo", "type");
	// d3.rebind(indicator, underlyingAlgorithm, "windowSize", "movingAverageType", "multiplier", "source");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}