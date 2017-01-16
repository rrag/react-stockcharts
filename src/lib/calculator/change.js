"use strict";

import { slidingWindow } from "../utils";
import { Change as defaultOptions } from "./defaultOptionsForComputation";

export default function() {
	var options = defaultOptions;

	function calculator(data) {
		var { sourcePath } = options;

		var algo = slidingWindow()
			.windowSize(2)
			.sourcePath(sourcePath)
			.accumulator(([prev, curr]) => {
				var absoluteChange = curr - prev;
				var percentChange = absoluteChange * 100 / prev;
				return { absoluteChange, percentChange };
			});

		var newData = algo(data);

		return newData;
	}
	calculator.undefinedLength = function() {
		return 1;
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
