"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {

	var options = _defaultOptionsForComputation.WMA;

	function calculator(data) {
		var _options = options,
		    windowSize = _options.windowSize,
		    sourcePath = _options.sourcePath;


		var weight = windowSize * (windowSize + 1) / 2;

		var waverage = (0, _utils.slidingWindow)().windowSize(windowSize).sourcePath(sourcePath).accumulator(function (values) {
			var total = (0, _d3Array.sum)(values, function (v, i) {
				return (i + 1) * v;
			});
			return total / weight;
		});

		return waverage(data);
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
		options = _extends({}, _defaultOptionsForComputation.WMA, x);
		return calculator;
	};

	return calculator;
};

var _d3Array = require("d3-array");

var _utils = require("../utils");

var _defaultOptionsForComputation = require("./defaultOptionsForComputation");
//# sourceMappingURL=wma.js.map