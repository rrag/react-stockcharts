"use strict";

import identity from "./identity";
import ema from "./ema";
import slidingWindow from "./slidingWindow";
import zipper from "./zipper";
import { isDefined, isNotDefined } from "../../utils/utils";
import { ForceIndex as defaultOptions } from "../defaultOptions";

export default function() {

	var { volume } = defaultOptions;
	var close = d => d.close;

	function calculator(data) {

		var fastEMA = ema()
			.windowSize(fast)
			.value(value);
		var slowEMA = ema()
			.windowSize(slow)
			.value(value);
		var signalEMA = ema()
			.windowSize(signal);

		var macdLine = d3.zip(fastEMA(data), slowEMA(data))
			.map((tuple) => (isDefined(tuple[0]) && isDefined(tuple[1])) ? tuple[0] - tuple[1] : undefined);

		var undefinedArray = new Array(slow);
		var signalLine = signalEMA(macdLine.slice(slow))
		signalLine.unshift(undefinedArray);

		var macd = d3.zip(macdLine, signalLine)
			.map(tuple => ({
				MACDLine: tuple[0],
				signalLine: tuple[1],
				histogram: (isDefined(tuple[0]) && isDefined(tuple[1])) ? tuple[0] - tuple[1] : undefined,
			}));

		return macd;
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