"use strict";

import { mean } from "d3-array";

import { slidingWindow } from "../utils";
import { SMA as defaultOptions } from "./defaultOptionsForComputation";

export default function() {

	let options = defaultOptions;

	function calculator(data) {
		const { windowSize, sourcePath } = options;

		const average = slidingWindow()
			.windowSize(windowSize)
			.sourcePath(sourcePath)
			.accumulator(values => mean(values));

		return average(data);
	}
	calculator.undefinedLength = function() {
		const { windowSize } = options;
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
