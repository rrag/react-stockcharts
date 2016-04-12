"use strict";

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

import ema from "./ema";

import { isDefined, identity, zipper } from "../../utils";
import { MACD as defaultOptions } from "../defaultOptions";

export default function() {

	var { fast, slow, signal } = defaultOptions;
	var source = identity;

	function calculator(data) {

		var fastEMA = ema()
			.windowSize(fast)
			.source(source);
		var slowEMA = ema()
			.windowSize(slow)
			.source(source);
		var signalEMA = ema()
			.windowSize(signal);

		var macdCalculator = zipper()
			.combine((fastEMA, slowEMA) => (isDefined(fastEMA) && isDefined(slowEMA)) ? fastEMA - slowEMA : undefined);

		var macdArray = macdCalculator(fastEMA(data), slowEMA(data));

		var undefinedArray = new Array(slow);
		var signalArray = undefinedArray.concat(signalEMA(macdArray.slice(slow)));

		var zip = zipper()
			.combine((macd, signal) => ({
				macd,
				signal,
				divergence: (isDefined(macd) && isDefined(signal)) ? macd - signal : undefined,
			}));

		var macd = zip(macdArray, signalArray);

		return macd;
	}

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

	calculator.source = function(x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return calculator;
	};

	return calculator;
}