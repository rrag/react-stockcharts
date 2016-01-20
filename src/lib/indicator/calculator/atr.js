"use strict";

import d3 from "d3";
import last from "lodash.last";

import slidingWindow from "./slidingWindow";
import { isDefined } from "../../utils/utils";

export default function() {

	var windowSize = 9,
		value = d => ({ open: d.open, high: d.high, low: d.low, close: d.close });

	function atr(data) {

		var trueRangeAlgorithm = slidingWindow()
			.windowSize(2)
			.value(value)
			.undefinedValue(d => d.high - d.low) // the first TR value is simply the High minus the Low
			.accumulator(values => {
				var prev = values[0];
				var d = values[1];
				return Math.max(d.high - d.low,
					d.high - prev.close,
					d.low - prev.close);
			});

		var prevATR;

		var atrAlgorithm = slidingWindow()
			.skipInitial(1) // trueRange starts from index 1 so ATR starts from 1
			.windowSize(windowSize)
			.accumulator(values => {
				var tr = last(values);
				var atr = isDefined(prevATR)
					? ((prevATR * (windowSize - 1)) + tr) / windowSize
					: d3.sum(values) / windowSize;

				prevATR = atr;
				return atr;
			});

		var newData = atrAlgorithm(trueRangeAlgorithm(data));

		return newData;
	};

	atr.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return atr;
	};

	atr.value = function(x) {
		if (!arguments.length) {
			return value;
		}
		value = x;
		return atr;
	};

	return atr;
}