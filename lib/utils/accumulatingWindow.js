"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {

	var accumulateTill = (0, _index.functor)(false),
	    accumulator = _noop2.default,
	    value = _identity2.default,
	    discardTillStart = false,
	    discardTillEnd = false;

	// eslint-disable-next-line prefer-const
	var accumulatingWindow = function accumulatingWindow(data) {
		var accumulatedWindow = discardTillStart ? undefined : [];
		var response = [];
		var accumulatorIdx = 0;
		var i = 0;
		for (i = 0; i < data.length; i++) {
			var d = data[i];
			// console.log(d, accumulateTill(d));
			if (accumulateTill(d, i, accumulatedWindow || [])) {
				if (accumulatedWindow && accumulatedWindow.length > 0) response.push(accumulator(accumulatedWindow, i, accumulatorIdx++));
				accumulatedWindow = [value(d)];
			} else {
				if (accumulatedWindow) accumulatedWindow.push(value(d));
			}
		}
		if (!discardTillEnd) response.push(accumulator(accumulatedWindow, i, accumulatorIdx));
		return response;
	};

	accumulatingWindow.accumulateTill = function (x) {
		if (!arguments.length) {
			return accumulateTill;
		}
		accumulateTill = (0, _index.functor)(x);
		return accumulatingWindow;
	};
	accumulatingWindow.accumulator = function (x) {
		if (!arguments.length) {
			return accumulator;
		}
		accumulator = x;
		return accumulatingWindow;
	};
	accumulatingWindow.value = function (x) {
		if (!arguments.length) {
			return value;
		}
		value = x;
		return accumulatingWindow;
	};
	accumulatingWindow.discardTillStart = function (x) {
		if (!arguments.length) {
			return discardTillStart;
		}
		discardTillStart = x;
		return accumulatingWindow;
	};
	accumulatingWindow.discardTillEnd = function (x) {
		if (!arguments.length) {
			return discardTillEnd;
		}
		discardTillEnd = x;
		return accumulatingWindow;
	};
	return accumulatingWindow;
};

var _noop = require("./noop");

var _noop2 = _interopRequireDefault(_noop);

var _identity = require("./identity");

var _identity2 = _interopRequireDefault(_identity);

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=accumulatingWindow.js.map