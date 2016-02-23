"use strict";

import financeEODCalculator from "./financeEODCalculator";
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

				var startOfWeek = a.startOfWeek || b.startOfWeek;
				var startOfMonth = a.startOfMonth || b.startOfMonth;
				var startOfQuarter = a.startOfQuarter || b.startOfQuarter;
				var startOfYear = a.startOfYear || b.startOfYear;

				var volume = a.volume + b.volume;
				var row = { high, low, volume, startOfWeek, startOfMonth, startOfQuarter, startOfYear };
				return row;
			});

			return { ...last(values), open, close, ...rest };
		});
}

function weeklyData(data) {
	return accumulator(d => d.startOfWeek)(data);
}

function monthlyData(data) {
	return accumulator(d => d.startOfMonth)(data);
}

export default function() {

	var allowedIntervals = ["D", "W", "M"],
		doIt = false;

	function calculator(data) {
		var eodMarker = financeEODCalculator().dateAccessor(d => d.date);

		if (isNotDefined(allowedIntervals)) return doIt ? eodMarker(data) : data;

		var D = eodMarker(data);

		// console.log(data.length, D.length, W.length, M.length);
		if (isArray(allowedIntervals)) {
			var response = {};
			if (allowedIntervals.indexOf("D") > -1) response.D = D;
			if (allowedIntervals.indexOf("W") > -1) {
				var W = weeklyData(D);
				response.W = W;
			}
			if (allowedIntervals.indexOf("M") > -1) {
				var M = monthlyData(D);
				response.M = M;
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