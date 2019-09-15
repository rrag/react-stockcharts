"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {

	var undefinedValue = undefined,
	    windowSize = 10,
	    accumulator = _noop2.default,
	    source = _identity2.default,
	    skipInitial = 0;

	// eslint-disable-next-line prefer-const
	var mappedSlidingWindow = function mappedSlidingWindow(data) {
		var size = (0, _index.functor)(windowSize).apply(this, arguments);
		var windowData = [];
		var accumulatorIdx = 0;
		var undef = (0, _index.functor)(undefinedValue);
		// console.log(skipInitial, size, data.length, windowData.length);
		var result = [];
		data.forEach(function (d, i) {
			// console.log(d, i, windowData.length);
			var mapped = void 0;
			if (i < skipInitial + size - 1) {
				mapped = undef(d, i);
				result.push(mapped);
				windowData.push(mapped);
				return;
			}
			if (i >= skipInitial + size) {
				// Treat windowData as FIFO rolling buffer
				windowData.shift();
			}
			windowData.push(source(d, i));
			mapped = accumulator(windowData, i, accumulatorIdx++);
			result.push(mapped);
			windowData.pop();
			windowData.push(mapped);
			return;
		});
		return result;
	};

	mappedSlidingWindow.undefinedValue = function (x) {
		if (!arguments.length) {
			return undefinedValue;
		}
		undefinedValue = x;
		return mappedSlidingWindow;
	};
	mappedSlidingWindow.windowSize = function (x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return mappedSlidingWindow;
	};
	mappedSlidingWindow.accumulator = function (x) {
		if (!arguments.length) {
			return accumulator;
		}
		accumulator = x;
		return mappedSlidingWindow;
	};
	mappedSlidingWindow.skipInitial = function (x) {
		if (!arguments.length) {
			return skipInitial;
		}
		skipInitial = x;
		return mappedSlidingWindow;
	};
	mappedSlidingWindow.source = function (x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return mappedSlidingWindow;
	};

	return mappedSlidingWindow;
};

var _noop = require("./noop");

var _noop2 = _interopRequireDefault(_noop);

var _identity = require("./identity");

var _identity2 = _interopRequireDefault(_identity);

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=mappedSlidingWindow.js.map