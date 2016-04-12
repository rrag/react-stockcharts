"use strict";

import { mappedSlidingWindow, identity } from "../../utils";

export default function() {

	var source = identity;

	function calculator(data) {
		var algorithm = mappedSlidingWindow()
			.windowSize(2)
			.undefinedValue(({ open, high, low, close }) => {
				close = (open + high + low + close) / 4;
				return { open, high, low, close };
			})
			.accumulator(([prev, now]) => {
				// console.log(prev, now);
				var close = (now.open + now.high + now.low + now.close) / 4;
				var open = (prev.open + prev.close) / 2;
				var high = Math.max(open, now.high, close);
				var low = Math.min(open, now.low, close);
				return { open, high, low, close };
			});

		return algorithm(data);
	}
	calculator.source = function(x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return calculator;
	};

	return calculator;
}