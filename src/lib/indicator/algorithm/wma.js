"use strict";

import { sum } from "d3-array";

import { slidingWindow } from "../../utils";
import { WMA as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

	var { windowSize, sourcePath } = defaultOptions;

	function calculator(data)    {
		var weight = windowSize * (windowSize + 1) / 2;

		var waverage = slidingWindow()
            .windowSize(windowSize)
            .sourcePath(sourcePath)
            .accumulator((values) => {
	return sum(values, function(v, i) { return (i + 1) * v;} ) / weight;
});

		return waverage(data);
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
