"use strict";

import d3 from "d3";

import merge from "../utils/merge";
import { isDefined, isNotDefined } from "../utils/utils";
import slidingWindow from "../utils/slidingWindow";

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
				var prevMACDHistogram = macdSource(prev).histogram;
				var currMACDHistogram = macdSource(curr).histogram;

				var prevEMA = emaSource(prev);
				var currEMA = emaSource(curr);

				if (currMACDHistogram >= prevMACDHistogram
					&& currEMA >= prevEMA) return "up";

				if (currMACDHistogram <= prevMACDHistogram
					&& currEMA <= prevEMA) return "down";
			}
			return "neutral";
		});

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.elderImpulse = indicator });

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