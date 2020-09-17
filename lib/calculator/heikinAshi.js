"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function () {

	var source = _utils.identity;

	function calculator(data) {
		var algorithm = (0, _utils.mappedSlidingWindow)().windowSize(2).undefinedValue(function (_ref) {
			var open = _ref.open,
			    high = _ref.high,
			    low = _ref.low,
			    close = _ref.close;

			close = (open + high + low + close) / 4;
			return { open: open, high: high, low: low, close: close };
		}).accumulator(function (_ref2) {
			var _ref3 = _slicedToArray(_ref2, 2),
			    prev = _ref3[0],
			    now = _ref3[1];

			// console.log(prev, now);
			var date = now.date,
			    volume = now.volume;

			var close = (now.open + now.high + now.low + now.close) / 4;
			var open = (prev.open + prev.close) / 2;
			var high = Math.max(open, now.high, close);
			var low = Math.min(open, now.low, close);
			return { date: date, open: open, high: high, low: low, close: close, volume: volume };
		});

		return algorithm(data);
	}
	calculator.source = function (x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return calculator;
	};

	return calculator;
};

var _utils = require("../utils");
//# sourceMappingURL=heikinAshi.js.map