"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {

	var underlyingAlgorithm = (0, _forceIndex2.default)();
	var merge = (0, _utils.zipper)().combine(function (force, smoothed) {
		return { force: force, smoothed: smoothed };
	});

	var options = _defaultOptionsForComputation.SmoothedForceIndex;
	function calculator(data) {
		var _options = options,
		    smoothingType = _options.smoothingType,
		    smoothingWindow = _options.smoothingWindow;
		var _options2 = options,
		    sourcePath = _options2.sourcePath,
		    volumePath = _options2.volumePath;


		var algo = underlyingAlgorithm.options({ sourcePath: sourcePath, volumePath: volumePath });

		var force = algo(data);

		var ma = smoothingType === "ema" ? (0, _ema2.default)() : (0, _sma2.default)();
		var forceMA = ma.options({
			windowSize: smoothingWindow,
			sourcePath: undefined
		});

		var smoothed = forceMA(force);
		return merge(force, smoothed);
	}

	calculator.undefinedLength = function () {
		var _options3 = options,
		    smoothingWindow = _options3.smoothingWindow;

		return underlyingAlgorithm.undefinedLength() + smoothingWindow - 1;
	};
	calculator.options = function (x) {
		if (!arguments.length) {
			return options;
		}
		options = _extends({}, _defaultOptionsForComputation.SmoothedForceIndex, x);
		return calculator;
	};

	return calculator;
};

var _forceIndex = require("./forceIndex");

var _forceIndex2 = _interopRequireDefault(_forceIndex);

var _ema = require("./ema");

var _ema2 = _interopRequireDefault(_ema);

var _sma = require("./sma");

var _sma2 = _interopRequireDefault(_sma);

var _utils = require("../utils");

var _defaultOptionsForComputation = require("./defaultOptionsForComputation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=smoothedForceIndex.js.map