/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/calculator/macd.js

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

import identity from "./identity";
import ema from "./ema";

import { isDefined, isNotDefined } from "../../utils/utils";
import { MACD as defaultOptions } from "../defaultOptions";

export default function() {

	var { fast, slow, signal } = defaultOptions;
	var value = identity;

	var calculator = function(data) {

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
		var signalLine = undefinedArray.concat(signalEMA(macdLine.slice(slow)));

		var macd = d3.zip(macdLine, signalLine)
			.map(tuple => ({
				MACDLine: tuple[0],
				signalLine: tuple[1],
				histogram: (isDefined(tuple[0]) && isDefined(tuple[1])) ? tuple[0] - tuple[1] : undefined,
			}));

		return macd;
	};

	calculator.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return calculator;
	};

	calculator.fast = function(x) {
		if (!arguments.length) {
			return fast;
		}
		fast = x;
		return calculator;
	};

	calculator.slow = function(x) {
		if (!arguments.length) {
			return slow;
		}
		slow = x;
		return calculator;
	};

	calculator.signal = function(x) {
		if (!arguments.length) {
			return signal;
		}
		signal = x;
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