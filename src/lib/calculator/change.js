"use strict";

import { slidingWindow } from "../utils";
import { Change as defaultOptions } from "./defaultOptionsForComputation";

export default function() {
	let options = defaultOptions;

	function calculator(data) {
		const { sourcePath } = options;

		const algo = slidingWindow()
			.windowSize(2)
			.sourcePath(sourcePath)
			.accumulator(([prev, curr]) => {
				const absoluteChange = curr - prev;
				const percentChange = absoluteChange * 100 / prev;
				return { absoluteChange, percentChange };
			});

		const newData = algo(data);

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
