"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function () {

	var options = _defaultOptionsForComputation.SAR;

	function calculator(data) {
		var _options = options,
		    accelerationFactor = _options.accelerationFactor,
		    maxAccelerationFactor = _options.maxAccelerationFactor;


		var algorithm = (0, _utils.mappedSlidingWindow)().windowSize(2).undefinedValue(function (_ref) {
			var high = _ref.high,
			    low = _ref.low;

			return {
				risingSar: low,
				risingEp: high,
				fallingSar: high,
				fallingEp: low,
				af: accelerationFactor
			};
		}).accumulator(function (_ref2) {
			var _ref3 = _slicedToArray(_ref2, 2),
			    prev = _ref3[0],
			    now = _ref3[1];

			var _calc = calc(prev, now),
			    risingSar = _calc.risingSar,
			    fallingSar = _calc.fallingSar,
			    risingEp = _calc.risingEp,
			    fallingEp = _calc.fallingEp;

			if ((0, _utils.isNotDefined)(prev.use) && risingSar > now.low && fallingSar < now.high) {
				return {
					risingSar: risingSar,
					fallingSar: fallingSar,
					risingEp: risingEp,
					fallingEp: fallingEp
				};
			}

			var use = (0, _utils.isDefined)(prev.use) ? prev.use === "rising" ? risingSar > now.low ? "falling" : "rising" : fallingSar < now.high ? "rising" : "falling" : risingSar > now.low ? "falling" : "rising";

			var current = prev.use === use ? {
				af: Math.min(maxAccelerationFactor, prev.af + accelerationFactor),
				fallingEp: fallingEp,
				risingEp: risingEp,
				fallingSar: fallingSar,
				risingSar: risingSar
			} : {
				af: accelerationFactor,
				fallingEp: now.low,
				risingEp: now.high,
				fallingSar: Math.max(prev.risingEp, now.high),
				risingSar: Math.min(prev.fallingEp, now.low)
			};

			var date = now.date,
			    high = now.high,
			    low = now.low;

			return _extends({
				date: date,
				high: high,
				low: low
			}, current, {
				use: use,
				sar: use === "falling" ? current.fallingSar : current.risingSar
			});
		});

		var calculatedData = algorithm(data).map(function (d) {
			return d.sar;
		});
		// console.log(calculatedData);

		return calculatedData;
	}
	calculator.undefinedLength = function () {
		return 1;
	};
	calculator.options = function (x) {
		if (!arguments.length) {
			return options;
		}
		options = _extends({}, _defaultOptionsForComputation.SAR, x);
		return calculator;
	};

	return calculator;
};

var _utils = require("../utils");

var _defaultOptionsForComputation = require("./defaultOptionsForComputation");

function calc(prev, now) {
	var risingSar = prev.risingSar + prev.af * (prev.risingEp - prev.risingSar);

	var fallingSar = prev.fallingSar - prev.af * (prev.fallingSar - prev.fallingEp);

	var risingEp = Math.max(prev.risingEp, now.high);
	var fallingEp = Math.min(prev.fallingEp, now.low);

	return {
		risingSar: risingSar,
		fallingSar: fallingSar,
		risingEp: risingEp,
		fallingEp: fallingEp
	};
}
//# sourceMappingURL=sar.js.map