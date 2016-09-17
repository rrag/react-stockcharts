"use strict";

import { timeFormat } from "d3-time-format";
import { map as d3Map } from "d3-collection";

import financeDiscontinuousScale from "./financeDiscontinuousScale";
import { head, last, slidingWindow, zipper, identity, isNotDefined } from "../utils";

const yearFormat = "%Y";
const quarterFormat = "%b %Y";
const monthFormat = "%b";
const weekFormat = "%d %b";
const dayFormat = "%a %d";
const hourFormat = "%_I %p";
const minuteFormat = "%I:%M %p";
const secondFormat = "%I:%M:%S %p";
// const milliSecondFormat = "%L";

var levelDefinition = [

	/* eslint-disable no-unused-vars */
	/* 17 */(d, date, i) => d.startOfYear && date.getFullYear() % 2 === 0 && yearFormat,
	/* 16 */(d, date, i) => d.startOfYear && yearFormat,
	/* 15 */(d, date, i) => d.startOfQuarter && quarterFormat,
	/* 14 */(d, date, i) => d.startOfMonth && monthFormat,
	/* 13 */(d, date, i) => d.startOfWeek && weekFormat,
	/* 12 */(d, date, i) => d.startOfDay && i % 2 === 0 && dayFormat,
	/* 11 */(d, date, i) => d.startOfDay && dayFormat,
	/* 10 */(d, date, i) => d.startOfHalfDay && hourFormat, // 12h
	/*  9 */(d, date, i) => d.startOfQuarterDay && hourFormat, // 6h
	/*  8 */(d, date, i) => d.startOfEighthOfADay && hourFormat, // 3h
	/*  7 */(d, date, i) => d.startOfHour && date.getHours() % 2 === 0 && hourFormat, // 2h -- REMOVE THIS
	/*  6 */(d, date, i) => d.startOfHour && hourFormat, // 1h
	/*  5 */(d, date, i) => d.startOf30Minutes && minuteFormat,
	/*  4 */(d, date, i) => d.startOf15Minutes && minuteFormat,
	/*  3 */(d, date, i) => d.startOf5Minutes && minuteFormat,
	/*  2 */(d, date, i) => d.startOfMinute && minuteFormat,
	/*  1 */(d, date, i) => d.startOf30Seconds && secondFormat,
	/*  0 */(d, date, i) => secondFormat,
	/* eslint-enable no-unused-vars */

];

function evaluateLevel(d, date, i) {
	return levelDefinition
		.map((l, idx) => ({ level: levelDefinition.length - idx - 1, format: l(d, date, i) }))
		.find(l => !!l.format);
}

var discontinuousIndexCalculator = slidingWindow()
	.windowSize(2)
	.undefinedValue((d, idx, di) => {
		var i = di;
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
			startOfYear: false,
		};
		var level = evaluateLevel(row, d, i);
		return { ...row, index: i, ...level };
	});

var discontinuousIndexCalculatorLocalTime = discontinuousIndexCalculator
	.accumulator(([prevDate, nowDate], i, idx, di) => {
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
		var startOfQuarter = startOfMonth && (nowDate.getMonth() % 3 <= prevDate.getMonth() % 3);
		// year of today != year of yesterday then today is start of year
		var startOfYear = nowDate.getYear() !== prevDate.getYear();

		var row = {
			date: nowDate.getTime(),
			startOf30Seconds,
			startOfMinute,
			startOf5Minutes,
			startOf15Minutes,
			startOf30Minutes,
			startOfHour,
			startOfEighthOfADay,
			startOfQuarterDay,
			startOfHalfDay,
			startOfDay,
			startOfWeek,
			startOfMonth,
			startOfQuarter,
			startOfYear,
		};
		var level = evaluateLevel(row, nowDate, i);
		return { ...row, index: i + di, ...level };
	});

function doStuff(realDateAccessor, inputDateAccessor, initialIndex) {
	return function(data) {
		var dateAccessor = realDateAccessor(inputDateAccessor);
		var calculate = discontinuousIndexCalculatorLocalTime.source(dateAccessor).misc(initialIndex);
		var index = calculate(data);

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
			: parseInt(entries[0].key, 10);

		return { index, interval };
	};
}

export function discontinuousTimeScaleProviderBuilder() {
	var initialIndex = 0, realDateAccessor = identity;
	var inputDateAccessor = d => d.date,
		indexAccessor = d => d.idx,
		indexMutator = (d, idx) => ({ ...d, idx }),
		withIndex, withInterval;

	var discontinuousTimeScaleProvider = function(data) {

		var index = withIndex;
		var interval = withInterval;
		if (isNotDefined(index)) {
			const response = doStuff(realDateAccessor, inputDateAccessor, initialIndex)(data);
			index = response.index;
			interval = response.interval;
		}
		// console.log(interval, entries[0].key);

		var inputIndex = index.map(each => {
			var { format } = each;
			return {
				...each,
				date: new Date(each.date),
				format: timeFormat(format),
			};
		});

		var xScale = financeDiscontinuousScale(inputIndex, interval);

		var mergedData = zipper()
			.combine(indexMutator);

		var finalData = mergedData(data, inputIndex);

		return {
			data: finalData,
			xScale,
			xAccessor: d => d && indexAccessor(d).index,
			displayXAccessor: realDateAccessor(inputDateAccessor),
		};
	};

	discontinuousTimeScaleProvider.initialIndex = function(x) {
		if (!arguments.length) {
			return initialIndex;
		}
		initialIndex = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.inputDateAccessor = function(x) {
		if (!arguments.length) {
			return inputDateAccessor;
		}
		inputDateAccessor = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.indexAccessor = function(x) {
		if (!arguments.length) {
			return indexAccessor;
		}
		indexAccessor = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.indexMutator = function(x) {
		if (!arguments.length) {
			return indexMutator;
		}
		indexMutator = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.withIndex = function(x) {
		if (!arguments.length) {
			return withIndex;
		}
		withIndex = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.withInterval = function(x) {
		if (!arguments.length) {
			return withInterval;
		}
		withInterval = x;
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.utc = function() {
		realDateAccessor = dateAccessor => d => {
			var date = dateAccessor(d);
			// The getTimezoneOffset() method returns the time-zone offset from UTC, in minutes, for the current locale.
			var offsetInMillis = date.getTimezoneOffset() * 60 * 1000;
			return new Date(date.getTime() + offsetInMillis);
		};
		return discontinuousTimeScaleProvider;
	};
	discontinuousTimeScaleProvider.indexCalculator = function() {
		return doStuff(realDateAccessor, inputDateAccessor, initialIndex);
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

export default discontinuousTimeScaleProviderBuilder();
