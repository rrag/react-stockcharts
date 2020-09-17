"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function () {

	var macdSource = void 0,
	    emaSource = void 0;

	var base = (0, _baseIndicator2.default)().type(ALGORITHM_TYPE)
	// .stroke(d => stroke[d.elderImpulse])
	.stroke(_defaultOptionsForAppearance.ElderImpulse.stroke).fill(undefined);

	var underlyingAlgorithm = (0, _utils.slidingWindow)().windowSize(2).undefinedValue("neutral").accumulator(function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
		    prev = _ref2[0],
		    curr = _ref2[1];

		if ((0, _utils.isNotDefined)(macdSource)) throw new Error("macdSource not defined for " + ALGORITHM_TYPE + " calculator");
		if ((0, _utils.isNotDefined)(emaSource)) throw new Error("emaSource not defined for " + ALGORITHM_TYPE + " calculator");

		if ((0, _utils.isDefined)(macdSource(prev)) && (0, _utils.isDefined)(emaSource(prev))) {
			var prevMACDDivergence = macdSource(prev).divergence;
			var currMACDDivergence = macdSource(curr).divergence;

			var prevEMA = emaSource(prev);
			var currEMA = emaSource(curr);

			if (currMACDDivergence >= prevMACDDivergence && currEMA >= prevEMA) return "up";

			if (currMACDDivergence <= prevMACDDivergence && currEMA <= prevEMA) return "down";
		}
		return "neutral";
	});

	var mergedAlgorithm = (0, _utils.merge)().algorithm(underlyingAlgorithm).merge(function (datum, indicator) {
		datum.elderImpulse = indicator;
	});

	// eslint-disable-next-line prefer-const
	var indicator = function indicator(data) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { merge: true };

		var newData = options.merge ? mergedAlgorithm(data) : underlyingAlgorithm(data);

		return newData;
	};
	indicator.macdSource = function (x) {
		if (!arguments.length) return macdSource;
		macdSource = x;
		return indicator;
	};
	indicator.emaSource = function (x) {
		if (!arguments.length) return emaSource;
		emaSource = x;
		return indicator;
	};
	(0, _utils.rebind)(indicator, base, "id", "echo", "type", "stroke");
	// rebind(indicator, underlyingAlgorithm, "windowSize", "movingAverageType", "multiplier", "source");
	(0, _utils.rebind)(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
};

var _utils = require("../utils");

var _defaultOptionsForAppearance = require("./defaultOptionsForAppearance");

var _baseIndicator = require("./baseIndicator");

var _baseIndicator2 = _interopRequireDefault(_baseIndicator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ALGORITHM_TYPE = "ElderImpulse";
//# sourceMappingURL=elderImpulse.js.map