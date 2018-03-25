

import { merge, slidingWindow, identity } from "../utils";

export default function() {

	let windowSize = 1,
		accumulator = identity,
		mergeAs = identity;

	function algorithm(data) {

		const defaultAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.accumulator(accumulator);

		const calculator = merge()
			.algorithm(defaultAlgorithm)
			.merge(mergeAs);

		const newData = calculator(data);

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