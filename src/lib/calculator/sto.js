"use strict";

/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/calculator/stochasticOscillator.js

The MIT License (MIT)

Copyright (c) 2014-2015 Scott Logic Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { max, min, mean } from "d3-array";

import { last, slidingWindow, zipper } from "../utils";
import { FullStochasticOscillator as defaultOptions } from "./defaultOptionsForComputation";

export default function() {

	let options = defaultOptions;

	let source = d => ({ open: d.open, high: d.high, low: d.low, close: d.close });

	function calculator(data) {
		const { windowSize, kWindowSize, dWindowSize } = options;

		const high = d => source(d).high,
			low = d => source(d).low,
			close = d => source(d).close;

		const kWindow = slidingWindow()
			.windowSize(windowSize)
			.accumulator(values => {

				const highestHigh = max(values, high);
				const lowestLow = min(values, low);

				const currentClose = close(last(values));
				const k = (currentClose - lowestLow) / (highestHigh - lowestLow) * 100;

				return k;
			});

		const kSmoothed = slidingWindow()
			.skipInitial(windowSize - 1)
			.windowSize(kWindowSize)
			.accumulator(values => mean(values));

		const dWindow = slidingWindow()
			.skipInitial(windowSize - 1 + kWindowSize - 1)
			.windowSize(dWindowSize)
			.accumulator(values => mean(values));

		const stoAlgorithm = zipper()
			.combine((K, D) => ({ K, D }));

		const kData = kSmoothed(kWindow(data));
		const dData = dWindow(kData);

		const indicatorData = stoAlgorithm(kData, dData);

		return indicatorData;
	}
	calculator.undefinedLength = function() {
		const { windowSize, kWindowSize, dWindowSize } = options;
		return windowSize + kWindowSize + dWindowSize;
	};
	calculator.source = function(x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return calculator;
	};
	calculator.options = function(x) {
		if (!arguments.length) {
			return options;
		}
		options = { ...defaultOptions, ...x };
		return calculator;
	};

	return calculator;
}
