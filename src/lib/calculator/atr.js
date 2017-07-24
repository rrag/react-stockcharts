"use strict";

import { sum } from "d3-array";

import { ATR as defaultOptions } from "./defaultOptionsForComputation";
import { slidingWindow, last, isDefined } from "../utils";

export default function() {

	let options = defaultOptions;
	let source = d => ({ open: d.open, high: d.high, low: d.low, close: d.close });

	function calculator(data) {
		const { windowSize } = options;

		const trueRangeAlgorithm = slidingWindow()
			.windowSize(2)
			.source(source)
			.undefinedValue(d => d.high - d.low) // the first TR value is simply the High minus the Low
			.accumulator(values => {
				const prev = values[0];
				const d = values[1];
				return Math.max(d.high - d.low,
					d.high - prev.close,
					d.low - prev.close);
			});

		let prevATR;

		const atrAlgorithm = slidingWindow()
			.skipInitial(1) // trueRange starts from index 1 so ATR starts from 1
			.windowSize(windowSize)
			.accumulator(values => {
				const tr = last(values);
				const atr = isDefined(prevATR)
					? ((prevATR * (windowSize - 1)) + tr) / windowSize
					: sum(values) / windowSize;

				prevATR = atr;
				return atr;
			});

		const newData = atrAlgorithm(trueRangeAlgorithm(data));

		return newData;
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

	calculator.source = function(x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return calculator;
	};

	return calculator;
}
