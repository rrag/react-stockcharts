"use strict";

import d3 from "d3";

import { slidingWindow } from "../../utils";

export default function() {

	var sourcePath = "close";
	function calculator(data) {

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

	calculator.sourcePath = function(x) {
		if (!arguments.length) {
			return sourcePath;
		}
		sourcePath = x;
		return calculator;
	};

	return calculator;
}
