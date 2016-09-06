"use strict";

import d3 from "d3";

import { slidingWindow } from "../../utils";
import { SMA as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

	var { windowSize, sourcePath } = defaultOptions;

	function calculator(data) {

		var mean = slidingWindow()
			.windowSize(windowSize)
			.sourcePath(sourcePath)
			.accumulator(values => d3.mean(values));

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
