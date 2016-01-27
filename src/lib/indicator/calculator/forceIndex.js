"use strict";

import identity from "../../utils/identity";
import slidingWindow from "../../utils/slidingWindow";
import zipper from "../../utils/zipper";

import { isDefined, isNotDefined } from "../../utils/utils";
import { ForceIndex as defaultOptions } from "../defaultOptions";

export default function() {

	var { volume } = defaultOptions;
	var close = d => d.close;

	function calculator(data) {

		var forceIndexCalulator = slidingWindow()
			.windowSize(2)
			.accumulator(([prev, curr]) => (close(curr) - close(prev)) * volume(curr))

		var forceIndex = forceIndexCalulator(data);

		return forceIndex;
	};

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