"use strict";

import first from "lodash.first";
import last from "lodash.last";
import set from "lodash.set";
import get from "lodash.get";

import financeEODScale from "./financeEODScale";

import { getClosestItemIndexes } from "../utils/utils";
import identity from "../utils/identity";
import slidingWindow from "../utils/slidingWindow";
import accumulatingWindow from "../utils/accumulatingWindow";
import zipper from "../utils/zipper";

function dailyData(dateKey, indexKey, openKey, highKey, lowKey, closeKey, volumeKey) {
	return slidingWindow()
		.windowSize(2)
		.undefinedValue((d, i) => {
			var row = { ...d, startOfWeek: false, startOfMonth: false, startOfQuarter: false, startOfYear: false };
			return set(row, indexKey, i);
		})
		.accumulator(([prev, now], i) => {
			var prevDate = get(prev, dateKey);
			var nowDate = get(now, dateKey);

			// According to ISO calendar
			// Sunday = 0, Monday = 1, ... Saturday = 6
			// day of week of today < day of week of yesterday then today is start of week
			var startOfWeek = nowDate.getDay() < prevDate.getDay();
			// month of today != month of yesterday then today is start of month
			var startOfMonth = nowDate.getMonth() !== prevDate.getMonth();
			// if start of month and month % 3 === 0 then it is start of quarter
			var startOfQuarter = startOfMonth && nowDate.getMonth() % 3 === 0;
			// year of today != year of yesterday then today is start of year
			var startOfYear = nowDate.getYear() !== prevDate.getYear();

			var row = { ...now, startOfWeek, startOfMonth, startOfQuarter, startOfYear };
			set(row, indexKey, i);
			return row;
		});
}

export default function() {
	var dateKey = "date";
	var indexKey = "idx";
	var openKey = "open";
	var highKey = "high";
	var lowKey = "low";
	var closeKey = "close";
	var volumeKey = "volume";

	function calculator(data) {

		var newData = dailyData(dateKey, indexKey, openKey, highKey, lowKey, closeKey, volumeKey)(data);
		return newData;
	}
	calculator.dateKey = function(x) {
		if (!arguments.length) {
			return dateKey;
		}
		dateKey = x;
		return calculator;
	};
	calculator.indexKey = function(x) {
		if (!arguments.length) {
			return indexKey;
		}
		indexKey = x;
		return calculator;
	};
	calculator.openKey = function(x) {
		if (!arguments.length) {
			return openKey;
		}
		openKey = x;
		return calculator;
	};
	calculator.highKey = function(x) {
		if (!arguments.length) {
			return highKey;
		}
		highKey = x;
		return calculator;
	};
	calculator.lowKey = function(x) {
		if (!arguments.length) {
			return lowKey;
		}
		lowKey = x;
		return calculator;
	};
	calculator.closeKey = function(x) {
		if (!arguments.length) {
			return closeKey;
		}
		closeKey = x;
		return calculator;
	};
	calculator.volumeKey = function(x) {
		if (!arguments.length) {
			return volumeKey;
		}
		volumeKey = x;
		return calculator;
	};
	calculator.xAccessor = function() {
		return d => get(d, indexKey);
	};
	calculator.scale = function() {
		return financeEODScale(d => get(d, indexKey), d => get(d, dateKey));
	};
	calculator.extents = function(startDate, endDate) {
		return (data) => {
			var { left: startLeft, right: startRight } = getClosestItemIndexes(data, startDate, d => get(d, dateKey));
			var { left: endLeft, right: endRight } = getClosestItemIndexes(data, endDate, d => get(d, dateKey));
			var start = (get(data[startLeft], indexKey) + get(data[startRight], indexKey)) / 2;
			var end = (get(data[endLeft], indexKey) + get(data[endRight], indexKey)) / 2;
			// console.log(start, end);
			return [start, end];
		}
	};
	return calculator;
}