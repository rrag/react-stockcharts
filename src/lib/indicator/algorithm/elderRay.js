"use strict";

/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/calculator/elderRay.js

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

import ema from "./ema";

import { ElderRay as defaultOptions } from "../defaultOptions";
import { isDefined, zipper, slidingWindow } from "../../utils";

export default function() {

	var { period: windowSize, source: src, movingAverageType, ohlc } = defaultOptions;
	var source = d3.functor(src);

	function calculator(data) {

		var meanAlgorithm = movingAverageType === "ema"
			? ema().windowSize(windowSize).source(source)
			: slidingWindow().windowSize(windowSize).accumulator(values => d3.mean(values)).source(source);

		var zip = zipper()
			.combine((datum, mean) => {
				var bullPower = isDefined(mean) ? ohlc(datum).high - mean : undefined;
				var bearPower = isDefined(mean) ? ohlc(datum).low - mean : undefined;
				return { bullPower, bearPower };
			});

		var newData = zip(data, meanAlgorithm(data));
		return newData;
	}

	calculator.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return calculator;
	};

	calculator.ohlc = function(x) {
		if (!arguments.length) {
			return ohlc;
		}
		ohlc = x;
		return calculator;
	};

	calculator.movingAverageType = function(x) {
		if (!arguments.length) {
			return movingAverageType;
		}
		movingAverageType = x;
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