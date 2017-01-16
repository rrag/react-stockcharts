"use strict";

import { mean } from "d3-array";

import { slidingWindow } from "../utils";
import { SMA as defaultOptions } from "./defaultOptionsForComputation";

export default function() {

	var options = defaultOptions;

	function calculator(data) {
		var { windowSize, sourcePath } = options;

		var average = slidingWindow()
			.windowSize(windowSize)
			.sourcePath(sourcePath)
			.accumulator(values => mean(values));

		return average(data);
	}
	calculator.undefinedLength = function() {
		var { windowSize } = options;
		return windowSize - 1;
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
