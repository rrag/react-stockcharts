"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {

	var options = _defaultOptionsForComputation.ATR;
	var source = function source(d) {
		return { open: d.open, high: d.high, low: d.low, close: d.close };
	};

	function calculator(data) {
		var _options = options,
		    windowSize = _options.windowSize;


		var trueRangeAlgorithm = (0, _utils.slidingWindow)().windowSize(2).source(source).undefinedValue(function (d) {
			return d.high - d.low;
		}) // the first TR value is simply the High minus the Low
		.accumulator(function (values) {
			var prev = values[0];
			var d = values[1];
			return Math.max(d.high - d.low, d.high - prev.close, d.low - prev.close);
		});

		var prevATR = void 0;

		var atrAlgorithm = (0, _utils.slidingWindow)().skipInitial(1) // trueRange starts from index 1 so ATR starts from 1
		.windowSize(windowSize).accumulator(function (values) {
			var tr = (0, _utils.last)(values);
			var atr = (0, _utils.isDefined)(prevATR) ? (prevATR * (windowSize - 1) + tr) / windowSize : (0, _d3Array.sum)(values) / windowSize;

			prevATR = atr;
			return atr;
		});

		var newData = atrAlgorithm(trueRangeAlgorithm(data));

		return newData;
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
		options = _extends({}, _defaultOptionsForComputation.ATR, x);
		return calculator;
	};

	calculator.source = function (x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return calculator;
	};

	return calculator;
};

var _d3Array = require("d3-array");

var _defaultOptionsForComputation = require("./defaultOptionsForComputation");

var _utils = require("../utils");
//# sourceMappingURL=atr.js.map