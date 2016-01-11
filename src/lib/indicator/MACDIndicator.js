/*

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
"use strict";

import d3 from "d3";
import objectAssign from "object-assign";

import * as MACalculator from "../utils/MovingAverageCalculator";
import { MACD as defaultOptions } from "./defaultOptions";
import { merge, macd } from "./calculator";

function MACDIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator() {
	}
	indicator.options = function() {
		return settings;
	};
	indicator.calculate = function(data) {
		var { fast, slow, signal, source } = settings;

		var getter = (d) => d[source];

		var macdAlgorithm = macd()
			.fast(fast)
			.slow(slow)
			.signal(signal)
			.value(getter)

		var calculateMACDFor = merge()
			.algorithm(macdAlgorithm)
			.mergePath([prefix, key])

		calculateMACDFor(data);

		console.log(data[26]);
		return data;
	};
	indicator.yAccessor = function() {
		return (d) => {
			if (d && d[prefix] && d[prefix][key]) {
				return { MACDLine: d[prefix][key].MACDLine, signalLine: d[prefix][key].signalLine, histogram: d[prefix][key].histogram };
			}
		};
	};
	indicator.isMACD = function() {
		return true;
	};
	return indicator;
}

export default MACDIndicator;
