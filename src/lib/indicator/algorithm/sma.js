"use strict";

import { mean } from "d3-array";

import { slidingWindow } from "../../utils";
import { SMA as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

	var { windowSize, sourcePath } = defaultOptions;

	function calculator(data) {

		var average = slidingWindow()
			.windowSize(windowSize)
			.sourcePath(sourcePath)
			.accumulator(values => mean(values));

		return average(data);
	}
	calculator.undefinedLength = function() {
		return windowSize;
	};
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
