

import { max, min, mean } from "d3-array";

import { ATR as defaultOptions } from "./defaultOptionsForComputation";
import { slidingWindow, last, isDefined } from "../utils";
import { cci } from "../indicator";

export default function () {

	let options = defaultOptions;
	let source = d => ({ open: d.open, high: d.high, low: d.low, close: d.close });

	function calculator(data) {
		const { windowSize } = options;

		const high = d => source(d).high,
			low = d => source(d).low,
			close = d => source(d).close;


		const cciAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.source(source)
			.accumulator((values) => {
				const highestHigh = max(values, low);
				const lowestLow = min(values, high);
				const currentClose = close(last(values));
				const TP = (highestHigh + lowestLow + currentClose) / 3;
				const smaTP = TP / windowSize;
				const meanDeviation = TP / smaTP;
				const cciData = (TP - smaTP) / (0.15 * meanDeviation)
				return cciData;

			});

		const newData = cciAlgorithm(data);

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
