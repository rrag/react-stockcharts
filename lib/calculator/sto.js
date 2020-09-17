"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

exports.default = function () {

	var options = _defaultOptionsForComputation.FullStochasticOscillator;

	var source = function source(d) {
		return { open: d.open, high: d.high, low: d.low, close: d.close };
	};

	function calculator(data) {
		var _options = options,
		    windowSize = _options.windowSize,
		    kWindowSize = _options.kWindowSize,
		    dWindowSize = _options.dWindowSize;


		var high = function high(d) {
			return source(d).high;
		},
		    low = function low(d) {
			return source(d).low;
		},
		    close = function close(d) {
			return source(d).close;
		};

		var kWindow = (0, _utils.slidingWindow)().windowSize(windowSize).accumulator(function (values) {

			var highestHigh = (0, _d3Array.max)(values, high);
			var lowestLow = (0, _d3Array.min)(values, low);

			var currentClose = close((0, _utils.last)(values));
			var k = (currentClose - lowestLow) / (highestHigh - lowestLow) * 100;

			return k;
		});

		var kSmoothed = (0, _utils.slidingWindow)().skipInitial(windowSize - 1).windowSize(kWindowSize).accumulator(function (values) {
			return (0, _d3Array.mean)(values);
		});

		var dWindow = (0, _utils.slidingWindow)().skipInitial(windowSize - 1 + kWindowSize - 1).windowSize(dWindowSize).accumulator(function (values) {
			return (0, _d3Array.mean)(values);
		});

		var stoAlgorithm = (0, _utils.zipper)().combine(function (K, D) {
			return { K: K, D: D };
		});

		var kData = kSmoothed(kWindow(data));
		var dData = dWindow(kData);

		var indicatorData = stoAlgorithm(kData, dData);

		return indicatorData;
	}
	calculator.undefinedLength = function () {
		var _options2 = options,
		    windowSize = _options2.windowSize,
		    kWindowSize = _options2.kWindowSize,
		    dWindowSize = _options2.dWindowSize;

		return windowSize + kWindowSize + dWindowSize;
	};
	calculator.source = function (x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return calculator;
	};
	calculator.options = function (x) {
		if (!arguments.length) {
			return options;
		}
		options = _extends({}, _defaultOptionsForComputation.FullStochasticOscillator, x);
		return calculator;
	};

	return calculator;
};

var _d3Array = require("d3-array");

var _utils = require("../utils");

var _defaultOptionsForComputation = require("./defaultOptionsForComputation");
//# sourceMappingURL=sto.js.map