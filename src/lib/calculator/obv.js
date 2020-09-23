

import { max, min, mean } from "d3-array";

import { OBV as defaultOptions } from "./defaultOptionsForComputation";
import { slidingWindow, last, current, mapValue } from "../utils";

export default function () {

	let options = defaultOptions;
	let source = d => ({ close: d.close, volume: d.volume });

	function calculator(data) {
		const { windowSize } = options;

		const obvAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.accumulator(([prev, curr]) => {
				let obv;
				if (curr.close > prev.close) {
					obv = Math.round(prev.volume - curr.volume, 2)
				} else if (curr.close < prev.close) {
					obv = Math.round(prev.volume - curr.volume, 2)
				} else {
					obv = Math.round(prev.volume, 2)
				}

				return Math.abs(obv);
			});

		const newData = obvAlgorithm(data);

		return newData;
	}
	calculator.undefinedLength = function () {
		const { windowSize } = options;
		return windowSize - 1;
	};
	calculator.options = function (x) {
		if (!arguments.length) {
			return options;
		}
		options = { ...defaultOptions, ...x };
		return calculator;
	};

	calculator.source = function (x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return calculator;
	};

	return calculator;
}
