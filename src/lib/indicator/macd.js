"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {

	var base = (0, _baseIndicator2.default)().type(ALGORITHM_TYPE).fill(_defaultOptionsForAppearance.MACD.fill).stroke(_defaultOptionsForAppearance.MACD.stroke).accessor(function (d) {
		return d.macd;
	});

	var underlyingAlgorithm = (0, _calculator.macd)();

	var mergedAlgorithm = (0, _utils.merge)().algorithm(underlyingAlgorithm).merge(function (datum, indicator) {
		datum.macd = indicator;
	});

	var indicator = function indicator(data) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { merge: true };

		if (options.merge) {
			if (!base.accessor()) throw new Error("Set an accessor to " + ALGORITHM_TYPE + " before calculating");
			return mergedAlgorithm(data);
		}
		return underlyingAlgorithm(data);
	};

	(0, _utils.rebind)(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type");
	(0, _utils.rebind)(indicator, underlyingAlgorithm, "options", "undefinedLength");
	(0, _utils.rebind)(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
};

var _utils = require("../utils");

var _calculator = require("../calculator");

var _baseIndicator = require("./baseIndicator");

var _baseIndicator2 = _interopRequireDefault(_baseIndicator);

var _defaultOptionsForAppearance = require("./defaultOptionsForAppearance");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ALGORITHM_TYPE = "MACD";
//# sourceMappingURL=macd.js.map