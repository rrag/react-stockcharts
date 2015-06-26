"use strict";

import Utils from "./utils";

var pluck = Utils.pluck;
var sum = Utils.sum;

var MACalculator = {
	calculateSMA(data, period, key, pluckKey, subObjectKey) {
		// console.log("calculateSMA");

		var l = data.length - 1;

		data.map((each, i) => data.slice(i - period, i))
			.filter((array) => array.length === period && array.length > 0)
			.map((array) => pluck(array, pluckKey))
			.map((array) => sum(array))
			.map((total) => total / period)
			.reverse()
			.forEach((avg, i) => {
				// data[l - i][key] = avg;
				Utils.setter(data[l - i], subObjectKey, key, avg);
			});

		return data;
	},
	calculateEMA(data, period, key, pluckKey, subObjectKey) {
		// console.log("calculating EMA", period, key, pluckKey);
		/*
		EMA = Price(t) * k + EMA(y) * (1 – k)
		t = today, y = yesterday, N = number of days in EMA (or period), k = 2/(N+1)
		*/
		if (data.length > period) {
			var firstSMA = data.slice(0, period)
				.map((each) => Utils.getter(each, pluckKey))
				.reduce((a, b) => a + b) / period;

			Utils.setter(data[period], subObjectKey, key, firstSMA);

			// console.log(period, key, pluckKey, subObjectKey, firstSMA);
			var k = 2 / (period + 1), prevEMA = firstSMA, ema;

			for (var i = period; i < data.length; i++) {
				ema = Utils.getter(data[i], pluckKey) * k + prevEMA * (1 - k);
				Utils.setter(data[i], subObjectKey, key, ema);

				prevEMA = ema;
			}
		}
		return data;
	}
};
/*
function setter(obj, subObjectKey, key, value) {
	if (subObjectKey) {
		if (obj[subObjectKey] === undefined) obj[subObjectKey] = {};
		obj[subObjectKey][key] = value;
	} else {
		obj[key] = value;
	}
}

function getter(obj, pluckKey) {
	var keys = pluckKey.split(".");
	var value;
	keys.forEach(key => {
		if (!value) value = obj[key];
		else value = value[key];
	})
	return value;
}
*/
module.exports = MACalculator;
