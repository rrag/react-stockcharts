"use strict";

import first from "lodash.first";
import last from "lodash.last";
import set from "lodash.set";
import get from "lodash.get";

import { getClosestItemIndexes } from "../utils/utils";
import identity from "../utils/identity";
import slidingWindow from "../utils/slidingWindow";
import accumulatingWindow from "../utils/accumulatingWindow";
import zipper from "../utils/zipper";

function accumulator(dateKey, indexKey, openKey, highKey, lowKey, closeKey, volumeKey, predicate) {
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
			}, { high: Number.MIN_VALUE, low: Number.MAX_VALUE });

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

	var dataPreProcessor, foobar;
	function calculator(data) {
		var dateKey = dataPreProcessor.dateKey();
		var indexKey = dataPreProcessor.indexKey();
		var openKey = dataPreProcessor.openKey();
		var highKey = dataPreProcessor.highKey();
		var lowKey = dataPreProcessor.lowKey();
		var closeKey = dataPreProcessor.closeKey();
		var volumeKey = dataPreProcessor.volumeKey();

		var D = data;
		var W = weeklyData(dateKey, indexKey, openKey, highKey, lowKey, closeKey, volumeKey)(D);
		var M = monthlyData(dateKey, indexKey, openKey, highKey, lowKey, closeKey, volumeKey)(D);

		// console.log(data.length, D.length, W.length, M.length);
		return { D, W, M };
	}
	calculator.dataPreProcessor = function(x) {
		if (!arguments.length) {
			return dataPreProcessor;
		}
		dataPreProcessor = x;
		return calculator;
	};
	calculator.foobar = function(x) {
		if (!arguments.length) {
			return foobar;
		}
		foobar = x;
		return calculator;
	};

	return calculator;
}