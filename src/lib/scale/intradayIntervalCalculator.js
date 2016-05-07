"use strict";

import financeIntradayCalculator from "./financeIntradayCalculator";
import { first, last, isArray, isNotDefined, accumulatingWindow } from "../utils";

function accumulator(predicate) {
	return accumulatingWindow()
		.accumulateTill(predicate)
		.accumulator(values => {
			var open = first(values).open;
			var close = last(values).close;

			var rest = values.reduce((a, b) => {
				var high = Math.max(a.high, b.high);
				var low = Math.min(a.low, b.low);

				var startOfQuarterHour = a.startOfQuarterHour || b.startOfQuarterHour;
				var startOfHour = a.startOfHour || b.startOfHour;
				var startOfEighthDay = a.startOfEighthDay || b.startOfEighthDay;
				var startOfQuarterDay = a.startOfQuarterDay || b.startOfQuarterDay;
				var startOfHalfDay = a.startOfHalfDay || b.startOfHalfDay;
				var startOfDay = a.startOfDay || b.startOfDay;
				var startOfWeek = a.startOfWeek || b.startOfWeek;

				var volume = a.volume + b.volume;
				var row = {
					high,
					low,
					volume,
					startOfQuarterHour,
					startOfHour,
					startOfEighthDay,
					startOfQuarterDay,
					startOfHalfDay,
					startOfDay,
					startOfWeek
				};
				return row;
			});

			return { ...last(values), open, close, ...rest };
		});
}

function hourlyData(data) {
	return accumulator(d => d.startOfHour)(data);
}

export default function() {

	var allowedIntervals = ["1h", "1m"],
		doIt = false;

	function calculator(data) {
		var intradayMarker = financeIntradayCalculator().dateAccessor(d => d.date);

		if (isNotDefined(allowedIntervals)) return doIt ? intradayMarker(data) : data;

		var D = intradayMarker(data);

		// console.log(data.length, D.length, W.length, M.length);
		if (isArray(allowedIntervals)) {
			var response = {};
			if (allowedIntervals.indexOf("1m") > -1) response.D = D;
			if (allowedIntervals.indexOf("1h") > -1) {
				var W = hourlyData(D);
				response.W = W;
			}
			return response;
		}
		return D;
	}
	calculator.allowedIntervals = function(x) {
		if (!arguments.length) return allowedIntervals;
		allowedIntervals = x;
		return calculator;
	};
	calculator.doIt = function(x) {
		if (!arguments.length) return doIt;
		doIt = x;
		return calculator;
	};
	return calculator;
}