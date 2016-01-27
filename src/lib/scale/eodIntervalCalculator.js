"use strict";

import first from "lodash.first";
import last from "lodash.last";
import set from "lodash.set";
import get from "lodash.get";

import financeEODCalculator from "./financeEODCalculator";
import { isArray, isNotDefined } from "../utils/utils";
import accumulatingWindow from "../utils/accumulatingWindow";

function accumulator(dateKey, openKey, highKey, lowKey, closeKey, volumeKey, predicate) {
	return accumulatingWindow()
		.accumulateTill(predicate)
		.accumulator(values => {
			var open = get(first(values), openKey);
			var close = get(last(values), closeKey);

			var rest = values.reduce((a, b) => {
				var high = Math.max(get(a, highKey), get(b, highKey));
				var low = Math.min(get(a, lowKey), get(b, lowKey));

				var startOfWeek = a.startOfWeek || b.startOfWeek;
				var startOfMonth = a.startOfMonth || b.startOfMonth;
				var startOfQuarter = a.startOfQuarter || b.startOfQuarter;
				var startOfYear = a.startOfYear || b.startOfYear;

				var volume = get(a, volumeKey) + get(b, volumeKey);
				var row = { startOfWeek, startOfMonth, startOfQuarter, startOfYear };
				return set(set(set(row, highKey, high), lowKey, low), volumeKey, volume);
			});

			return { ...last(values), open, close, ...rest };
		});
}

function weeklyData() {
	return accumulator.call(null, ...arguments, d => d.startOfWeek);
}

function monthlyData() {
	return accumulator.call(null, ...arguments, d => d.startOfMonth);
}


export default function() {

	var allowedIntervals = ["D", "W", "M"],
		dateKey = "date",
		openKey = "open",
		highKey = "high",
		lowKey = "low",
		closeKey = "close",
		volumeKey = "volume",
		doIt = false;

	function calculator(data) {
		var eodMarker = financeEODCalculator().dateAccessor(d => get(d, dateKey));

		if (isNotDefined(allowedIntervals)) return doIt ? eodMarker(data) : data;

		var D = eodMarker(data);
		var W = weeklyData(dateKey, openKey, highKey, lowKey, closeKey, volumeKey)(D);
		var M = monthlyData(dateKey, openKey, highKey, lowKey, closeKey, volumeKey)(D);

		// console.log(data.length, D.length, W.length, M.length);
		if (isArray(allowedIntervals)) {
			return { D, W, M }
		}
		return D;
	}
	calculator.allowedIntervals = function(x) {
		if (!arguments.length) return allowedIntervals;
		allowedIntervals = x;
		return calculator;
	};
	calculator.dateKey = function(x) {
		if (!arguments.length) return dateKey;
		dateKey = x;
		return calculator;
	};
	calculator.openKey = function(x) {
		if (!arguments.length) return openKey;
		openKey = x;
		return calculator;
	};
	calculator.highKey = function(x) {
		if (!arguments.length) return highKey;
		highKey = x;
		return calculator;
	};
	calculator.lowKey = function(x) {
		if (!arguments.length) return lowKey;
		lowKey = x;
		return calculator;
	};
	calculator.closeKey = function(x) {
		if (!arguments.length) return closeKey;
		closeKey = x;
		return calculator;
	};
	calculator.volumeKey = function(x) {
		if (!arguments.length) return volumeKey;
		volumeKey = x;
		return calculator;
	};
	calculator.doIt = function(x) {
		if (!arguments.length) return doIt;
		doIt = x;
		return calculator;
	};
	return calculator;
}