"use strict";

import { slidingWindow } from "../../utils";
import { SMA as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

	var { period: windowSize, sourcePath } = defaultOptions;

	function calculator(data) {

		var mean = slidingWindow()
			.windowSize(windowSize)
			.sourcePath(sourcePath)
			.accumulator(values => d3.mean(values))

		return mean(data);
	}

	calculator.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return calculator;
	};

	calculator.sourcePath = function(x) {
		if (!arguments.length) {
			return sourcePath;
		}
		sourcePath = x;
		return calculator;
	};

	return calculator;
}
