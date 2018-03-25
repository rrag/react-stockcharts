

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

import { isDefined, zipper } from "../utils";
import { MACD as defaultOptions } from "./defaultOptionsForComputation";

export default function() {
	let options = defaultOptions;

	function calculator(data) {
		const { fast, slow, signal, sourcePath } = options;

		const fastEMA = ema()
			.options({ windowSize: fast, sourcePath });

		const slowEMA = ema()
			.options({ windowSize: slow, sourcePath });

		const signalEMA = ema()
			.options({ windowSize: signal, sourcePath: undefined });

		const macdCalculator = zipper()
			.combine((fastEMA, slowEMA) => (isDefined(fastEMA) && isDefined(slowEMA)) ? fastEMA - slowEMA : undefined);

		const macdArray = macdCalculator(fastEMA(data), slowEMA(data));

		const undefinedArray = new Array(slow);
		const signalArray = undefinedArray.concat(signalEMA(macdArray.slice(slow)));

		const zip = zipper()
			.combine((macd, signal) => ({
				macd,
				signal,
				divergence: (isDefined(macd) && isDefined(signal)) ? macd - signal : undefined,
			}));

		const macd = zip(macdArray, signalArray);

		return macd;
	}

	calculator.undefinedLength = function() {
		const { slow, signal } = options;
		return slow + signal - 1;
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
