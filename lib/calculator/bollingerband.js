"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

exports.default = function () {
	var options = _defaultOptionsForComputation.BollingerBand;

	function calculator(data) {
		var _options = options,
		    windowSize = _options.windowSize,
		    multiplier = _options.multiplier,
		    movingAverageType = _options.movingAverageType,
		    sourcePath = _options.sourcePath;


		var source = (0, _utils.path)(sourcePath);
		var meanAlgorithm = movingAverageType === "ema" ? (0, _ema2.default)().options({ windowSize: windowSize, sourcePath: sourcePath }) : (0, _utils.slidingWindow)().windowSize(windowSize).accumulator(function (values) {
			return (0, _d3Array.mean)(values);
		}).sourcePath(sourcePath);

		var bollingerBandAlgorithm = (0, _utils.slidingWindow)().windowSize(windowSize).accumulator(function (values) {
			var avg = (0, _utils.last)(values).mean;
			var stdDev = (0, _d3Array.deviation)(values, function (each) {
				return source(each.datum);
			});
			return {
				top: avg + multiplier * stdDev,
				middle: avg,
				bottom: avg - multiplier * stdDev
			};
		});

		var zip = (0, _utils.zipper)().combine(function (datum, mean) {
			return { datum: datum, mean: mean };
		});

		var tuples = zip(data, meanAlgorithm(data));
		return bollingerBandAlgorithm(tuples);
	}
	calculator.undefinedLength = function () {
		var _options2 = options,
		    windowSize = _options2.windowSize;

		return windowSize - 1;
	};
	calculator.options = function (x) {
		if (!arguments.length) {
			return options;
		}
		options = _extends({}, _defaultOptionsForComputation.BollingerBand, x);
		return calculator;
	};

	return calculator;
};

var _d3Array = require("d3-array");

var _ema = require("./ema");

var _ema2 = _interopRequireDefault(_ema);

var _utils = require("../utils");

var _defaultOptionsForComputation = require("./defaultOptionsForComputation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=bollingerband.js.map