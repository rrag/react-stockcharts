

import { max, min, mean } from "d3-array";

import { OBV as defaultOptions } from "./defaultOptionsForComputation";
import { slidingWindow, last, current, mapValue } from "../utils";

export default function () {

	let options = defaultOptions;
	let source = d => ({ volume: d.volume, });

	function calculator(data) {
		const { windowSize } = options;
		const volume = d => source(d).volume;


		const obvAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.source(source)
			.accumulator((item, index) => {
				let obvData = current(item, volume)

				return obvData;
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
