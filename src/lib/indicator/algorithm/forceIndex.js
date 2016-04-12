"use strict";

import { slidingWindow } from "../../utils";
import { ForceIndex as defaultOptions } from "../defaultOptions";

export default function() {

	var { close, volume } = defaultOptions;

	function calculator(data) {

		var forceIndexCalulator = slidingWindow()
			.windowSize(2)
			.accumulator(([prev, curr]) => (close(curr) - close(prev)) * volume(curr));

		var forceIndex = forceIndexCalulator(data);

		return forceIndex;
	}

	calculator.close = function(x) {
		if (!arguments.length) {
			return close;
		}
		close = x;
		return calculator;
	};

	calculator.volume = function(x) {
		if (!arguments.length) {
			return volume;
		}
		volume = x;
		return calculator;
	};

	return calculator;
}