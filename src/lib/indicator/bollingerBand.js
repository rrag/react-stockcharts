"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {

	var base = (0, _baseIndicator2.default)().type(ALGORITHM_TYPE);

	var underlyingAlgorithm = (0, _calculator.bollingerband)();

	var mergedAlgorithm = (0, _utils.merge)().algorithm(underlyingAlgorithm).merge(function (datum, indicator) {
		datum.bollingerBand = indicator;
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
	(0, _utils.rebind)(indicator, underlyingAlgorithm, "options");
	(0, _utils.rebind)(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
};

var _utils = require("../utils");

var _baseIndicator = require("./baseIndicator");

var _baseIndicator2 = _interopRequireDefault(_baseIndicator);

var _calculator = require("../calculator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ALGORITHM_TYPE = "BollingerBand";
//# sourceMappingURL=bollingerBand.js.map