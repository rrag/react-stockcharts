"use strict";

/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/calculator/bollingerBands.js

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

import last from "lodash.last";
import d3 from "d3";

import identity from "./identity";
import slidingWindow from "./slidingWindow";
import ema from "./ema";
import zipper from "./zipper";

import { BollingerBand as defaultOptions } from "../defaultOptions";

export default function() {

	var { period: windowSize, multiplier, movingAverageType } = defaultOptions;
	var value = identity;

	function calculator(data) {

		var meanAlgorithm = movingAverageType === "ema"
			? ema().windowSize(windowSize).value(value)
			: slidingWindow().windowSize(windowSize).accumulator(d3.mean).value(value);

		var bollingerBandAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.accumulator((values) => {
				var avg = last(values).mean;
				var stdDev = d3.deviation(values, (each) => value(each.datum));
				return {
					top: avg + multiplier * stdDev,
					middle: avg,
					bottom: avg - multiplier * stdDev
				};
			});

		var zip = zipper()
			.combine((datum, mean) => ({ datum, mean }));

		var tuples = zip(data, meanAlgorithm(data));
		return bollingerBandAlgorithm(tuples);
	};

	calculator.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return calculator;
	};

	calculator.multiplier = function(x) {
		if (!arguments.length) {
			return multiplier;
		}
		multiplier = x;
		return calculator;
	};

	calculator.movingAverageType = function(x) {
		if (!arguments.length) {
			return movingAverageType;
		}
		movingAverageType = x;
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