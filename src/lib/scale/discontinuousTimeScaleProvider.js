"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import { map as d3Map } from "d3-collection";

exports.discontinuousTimeScaleProviderBuilder = discontinuousTimeScaleProviderBuilder;

var _d3TimeFormat = require("d3-time-format");

var _financeDiscontinuousScale = require("./financeDiscontinuousScale");

var _financeDiscontinuousScale2 = _interopRequireDefault(_financeDiscontinuousScale);

var _utils = require("../utils");

var _levels = require("./levels");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function evaluateLevel(d, date, i, formatters) {
	return _levels.levelDefinition.map(function (eachLevel, idx) {
		return {
			level: _levels.levelDefinition.length - idx - 1,
			format: formatters[eachLevel(d, date, i)]
		};
	}).find(function (l) {
		return !!l.format;
	});
}

var discontinuousIndexCalculator = (0, _utils.slidingWindow)().windowSize(2).undefinedValue(function (d, idx, _ref) {
	var initialIndex = _ref.initialIndex,
	    formatters = _ref.formatters;

	var i = initialIndex;
	var row = {
		date: d.getTime(),
		startOf30Seconds: false,
		startOfMinute: false,
		startOf5Minutes: false,
		startOf15Minutes: false,
		startOf30Minutes: false,
		startOfHour: false,
		startOfEighthOfADay: false,
		startOfQuarterDay: false,
		startOfHalfDay: false,
		startOfDay: true,
		startOfWeek: false,
		startOfMonth: false,
		startOfQuarter: false,
		startOfYear: false
	};
	var level = evaluateLevel(row, d, i, formatters);
	return _extends({}, row, { index: i }, level);
});

var discontinuousIndexCalculatorLocalTime = discontinuousIndexCalculator.accumulator(function (_ref2, i, idx, _ref3) {
	var _ref4 = _slicedToArray(_ref2, 2),
	    prevDate = _ref4[0],
	    nowDate = _ref4[1];

	var initialIndex = _ref3.initialIndex,
	    formatters = _ref3.formatters;

	var startOf30Seconds = nowDate.getSeconds() % 30 === 0;

	var startOfMinute = nowDate.getMinutes() !== prevDate.getMinutes();
	var startOf5Minutes = startOfMinute && nowDate.getMinutes() % 5 <= prevDate.getMinutes() % 5;
	var startOf15Minutes = startOfMinute && nowDate.getMinutes() % 15 <= prevDate.getMinutes() % 15;
	var startOf30Minutes = startOfMinute && nowDate.getMinutes() % 30 <= prevDate.getMinutes() % 30;

	var startOfHour = nowDate.getHours() !== prevDate.getHours();

	var startOfEighthOfADay = startOfHour && nowDate.getHours() % 3 === 0;
	var startOfQuarterDay = startOfHour && nowDate.getHours() % 6 === 0;
	var startOfHalfDay = startOfHour && nowDate.getHours() % 12 === 0;

	var startOfDay = nowDate.getDay() !== prevDate.getDay();
	// According to ISO calendar
	// Sunday = 0, Monday = 1, ... Saturday = 6
	// day of week of today < day of week of yesterday then today is start of week
	var startOfWeek = nowDate.getDay() < prevDate.getDay();
	// month of today != month of yesterday then today is start of month
	var startOfMonth = nowDate.getMonth() !== prevDate.getMonth();
	// if start of month and month % 3 === 0 then it is start of quarter
	var startOfQuarter = startOfMonth && nowDate.getMonth() % 3 <= prevDate.getMonth() % 3;
	// year of today != year of yesterday then today is start of year
	var startOfYear = nowDate.getFullYear() !== prevDate.getFullYear();

	var row = {
		date: nowDate.getTime(),
		startOf30Seconds: startOf30Seconds,
		startOfMinute: startOfMinute,
		startOf5Minutes: startOf5Minutes,
		startOf15Minutes: startOf15Minutes,
		startOf30Minutes: startOf30Minutes,
		startOfHour: startOfHour,
		startOfEighthOfADay: startOfEighthOfADay,
		startOfQuarterDay: startOfQuarterDay,
		startOfHalfDay: startOfHalfDay,
		startOfDay: startOfDay,
		startOfWeek: startOfWeek,
		startOfMonth: startOfMonth,
		startOfQuarter: startOfQuarter,
		startOfYear: startOfYear
	};
	var level = evaluateLevel(row, nowDate, i, formatters);
	if (level == null) {
		console.log(row);
	}
	return _extends({}, row, { index: i + initialIndex }, level);
});

function doStuff(realDateAccessor, inputDateAccessor, initialIndex, formatters) {
	return function (data) {
		var dateAccessor = realDateAccessor(inputDateAccessor);
		var calculate = discontinuousIndexCalculatorLocalTime.source(dateAccessor).misc({ initialIndex: initialIndex, formatters: formatters });

		var index = calculate(data).map(function (each) {
			var format = each.format;

			return {
				// ...each,
				index: each.index,
				level: each.level,
				date: new Date(each.date),
				format: (0, _d3TimeFormat.timeFormat)(format)
			};
		});
		/*
  var map = d3Map();
  for (var i = 0; i < data.length - 1; i++) {
  		var nextDate = dateAccessor(data[i + 1]);
  	var nowDate = dateAccessor(data[i]);
  	var diff = nextDate - nowDate;
  		if (map.has(diff)) {
  		var count = parseInt(map.get(diff), 10) + 1;
  		map.set(diff, count);
  	} else {
  		map.set(diff, 1);
  	}
  }
  	var entries = map.entries().sort((a, b) => a.value < b.value);
  	// For Renko/p&f
  	var interval = entries[0].value === 1
  	? Math.round((dateAccessor(last(data)) - dateAccessor(head(data))) / data.length)
  	: parseInt(entries[0].key, 10); */

		// return { index, interval };
		return { index: index };
	};
}

function discontinuousTimeScaleProviderBuilder() {
	var initialIndex = 0,
	    realDateAccessor = _utils.identity;
	var inputDateAccessor = function inputDateAccessor(d) {
		return d.date;
	},
	    indexAccessor = function indexAccessor(d) {
		return d.idx;
	},
	    indexMutator = function indexMutator(d, idx) {
		return _extends({}, d, { idx: idx });
	},
	    withIndex = void 0;

	var currentFormatters = _levels.defaultFormatters;

	// eslint-disable-next-line prefer-const
	var discontinuousTimeScaleProvider = function discontinuousTimeScaleProvider(data) {
		/*
  console.warn("Are you sure you want to use a discontinuousTimeScale?"
  	+ " Use this only if you have discontinuous data which"
  	+ " needs to be displayed as continuous."
  	+ " If you have continuous data use a d3 scale like"
  	+ " `d3.scaleTime`"
  );
  */

		var index = withIndex;

		if ((0, _utils.isNotDefined)(index)) {
			var response = doStuff(realDateAccessor, inputDateAccessor, initialIndex, currentFormatters)(data);

			index = response.index;
		}
		// console.log(interval, entries[0].key);

		var inputIndex = index;
		var xScale = (0, _financeDiscontinuousScale2.default)(inputIndex);

		var mergedData = (0, _utils.zipper)().combine(indexMutator);

		var finalData = mergedData(data, inputIndex);

		return {
			data: finalData,
			xScale: xScale,
			xAccessor: function xAccessor(d) {
				return d && indexAccessor(d).index;
			},
			displayXAccessor: realDateAccessor(inputDateAccessor)
		};
	};

	discontinuousTimeScaleProvider.initialIndex = function (x) {
		if (!arguments.length) {
			return initialIndex;
		}
		initialIndex = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.inputDateAccessor = function (x) {
		if (!arguments.length) {
			return inputDateAccessor;
		}
		inputDateAccessor = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.indexAccessor = function (x) {
		if (!arguments.length) {
			return indexAccessor;
		}
		indexAccessor = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.indexMutator = function (x) {
		if (!arguments.length) {
			return indexMutator;
		}
		indexMutator = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.withIndex = function (x) {
		if (!arguments.length) {
			return withIndex;
		}
		withIndex = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.utc = function () {
		realDateAccessor = function realDateAccessor(dateAccessor) {
			return function (d) {
				var date = dateAccessor(d);
				// The getTimezoneOffset() method returns the time-zone offset from UTC, in minutes, for the current locale.
				var offsetInMillis = date.getTimezoneOffset() * 60 * 1000;
				return new Date(date.getTime() + offsetInMillis);
			};
		};
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.setLocale = function (locale) {
		var formatters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		if (locale) {
			(0, _d3TimeFormat.timeFormatDefaultLocale)(locale);
		}
		if (formatters) {
			currentFormatters = formatters;
		}
		return discontinuousTimeScaleProvider;
	};

	discontinuousTimeScaleProvider.indexCalculator = function () {
		return doStuff(realDateAccessor, inputDateAccessor, initialIndex, currentFormatters);
	};

	return discontinuousTimeScaleProvider;
}

/* discontinuousTimeScaleProvider.utc = function(data,
		dateAccessor,
		indexAccessor,
		indexMutator) {
	var utcDateAccessor = d => {
		var date = dateAccessor(d);
		// The getTimezoneOffset() method returns the time-zone offset from UTC, in minutes, for the current locale.
		var offsetInMillis = date.getTimezoneOffset() * 60 * 1000;
		return new Date(date.getTime() + offsetInMillis);
	};
	return discontinuousTimeScaleProvider(data, utcDateAccessor, indexAccessor, indexMutator);
};*/

exports.default = discontinuousTimeScaleProviderBuilder();
//# sourceMappingURL=discontinuousTimeScaleProvider.js.map