"use strict";

import { slidingWindow, path } from "../utils";
import { ForceIndex as defaultOptions } from "./defaultOptionsForComputation";

export default function() {

	var options = defaultOptions;

	function calculator(data) {
		var { sourcePath, volumePath } = options;

		var source = path(sourcePath);
		var volume = path(volumePath);

		var forceIndexCalulator = slidingWindow()
			.windowSize(2)
			.accumulator(([prev, curr]) => (source(curr) - source(prev)) * volume(curr));

		var forceIndex = forceIndexCalulator(data);

		return forceIndex;
	}
	calculator.undefinedLength = function() {
		return 2;
	};
	calculator.options = function(x) {
		if (!arguments.length) {
			return options;
		}
		options = { ...defaultOptions, ...x };
		return calculator;
	};

	return calculator;
}
