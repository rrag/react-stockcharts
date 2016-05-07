"use strict";

import { merge, slidingWindow } from "../utils";
import { identity } from "../utils";

export default function() {

	var windowSize = 1,
		accumulator = identity,
		mergeAs = identity;

	function algorithm(data) {

		var defaultAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.accumulator(accumulator);

		var calculator = merge()
			.algorithm(defaultAlgorithm)
			.merge(mergeAs);

		var newData = calculator(data);

		return newData;
	}

	algorithm.accumulator = function(x) {
		if (!arguments.length) {
			return accumulator;
		}
		accumulator = x;
		return algorithm;
	};

	algorithm.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return algorithm;
	};
	algorithm.merge = function(x) {
		if (!arguments.length) {
			return mergeAs;
		}
		mergeAs = x;
		return algorithm;
	};

	return algorithm;
}