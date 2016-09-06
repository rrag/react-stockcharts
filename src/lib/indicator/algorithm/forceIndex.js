"use strict";

import { slidingWindow, path } from "../../utils";
import { ForceIndex as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

	var { sourcePath } = defaultOptions;
	var volumePath = "volume";

	function calculator(data) {

		var source = path(sourcePath);
		var volume = path(volumePath);

		var forceIndexCalulator = slidingWindow()
			.windowSize(2)
			.accumulator(([prev, curr]) => (source(curr) - source(prev)) * volume(curr));

		var forceIndex = forceIndexCalulator(data);

		return forceIndex;
	}

	calculator.sourcePath = function(x) {
		if (!arguments.length) {
			return sourcePath;
		}
		sourcePath = x;
		return calculator;
	};

	calculator.volumePath = function(x) {
		if (!arguments.length) {
			return volumePath;
		}
		volumePath = x;
		return calculator;
	};

	return calculator;
}
