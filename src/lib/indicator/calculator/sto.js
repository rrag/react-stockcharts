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

import d3 from "d3";
import last from "lodash.last";

import identity from "./identity";
import slidingWindow from "./slidingWindow";
import zipper from "./zipper";

import { isDefined } from "../../utils/utils";
import { FullStochasticOscillator as defaultOptions } from "../defaultOptions";

export default function() {

	var { period: windowSize, K: kWindowSize, D: dWindowSize, ohlc: value } = defaultOptions;

	var high = d => value(d).high,
		low = d => value(d).low,
		close = d => value(d).close;

	function calculator(data) {
		var kWindow = slidingWindow()
			.windowSize(windowSize)
			.accumulator(values => {

				var highestHigh = d3.max(values, high);
				var lowestLow = d3.min(values, low);

				var currentClose = close(last(values));
				var k = (currentClose - lowestLow) / (highestHigh - lowestLow) * 100

				return k;
			});

		var kSmoothed = slidingWindow()
			.skipInitial(windowSize - 1)
			.windowSize(kWindowSize)
			.accumulator(d3.mean);

		var dWindow = slidingWindow()
			.skipInitial(windowSize -1 + kWindowSize - 1)
			.windowSize(dWindowSize)
			.accumulator(d3.mean);

		var stoAlgorithm = zipper()
			.combine((K, D) => ({ K, D }));

		var kData = kSmoothed(kWindow(data));
		var dData = dWindow(kData);

		var newData = stoAlgorithm(kData, dData);

		return newData;
	};

	calculator.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return calculator;
	};
	calculator.kWindowSize = function(x) {
		if (!arguments.length) {
			return kWindowSize;
		}
		kWindowSize = x;
		return calculator;
	};
	calculator.dWindowSize = function(x) {
		if (!arguments.length) {
			return dWindowSize;
		}
		dWindowSize = x;
		return calculator;
	};
	calculator.value = function(x) {
		if (!arguments.length) {
			return value;
		}
		value = x;
		return calculator;
	};

	return calculator;
}