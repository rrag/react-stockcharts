"use strict";

import { slidingWindow } from "../utils";

export default function() {
	var dateAccessor = d => d.date;

	function calculator(data) {
		var eodScaleCalculator = slidingWindow()
		.windowSize(2)
		.undefinedValue(d => {
			var row = { ...d, startOfWeek: false, startOfMonth: false, startOfQuarter: false, startOfYear: false };
			return row;
		})
		.accumulator(([prev, now]) => {
			var prevDate = dateAccessor(prev);
			var nowDate = dateAccessor(now);

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
			return row;
		});
		var newData = eodScaleCalculator(data);
		return newData;
	}
	calculator.dateAccessor = function(x) {
		if (!arguments.length) {
			return dateAccessor;
		}
		dateAccessor = x;
		return calculator;
	};
	return calculator;
}