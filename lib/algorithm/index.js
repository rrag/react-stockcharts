"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {

	var windowSize = 1,
	    accumulator = _utils.identity,
	    mergeAs = _utils.identity;

	function algorithm(data) {

		var defaultAlgorithm = (0, _utils.slidingWindow)().windowSize(windowSize).accumulator(accumulator);

		var calculator = (0, _utils.merge)().algorithm(defaultAlgorithm).merge(mergeAs);

		var newData = calculator(data);

		return newData;
	}

	algorithm.accumulator = function (x) {
		if (!arguments.length) {
			return accumulator;
		}
		accumulator = x;
		return algorithm;
	};

	algorithm.windowSize = function (x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return algorithm;
	};
	algorithm.merge = function (x) {
		if (!arguments.length) {
			return mergeAs;
		}
		mergeAs = x;
		return algorithm;
	};

	return algorithm;
};

var _utils = require("../utils");
//# sourceMappingURL=index.js.map