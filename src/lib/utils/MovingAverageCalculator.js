"use strict";

import Utils from "./utils";

var pluck = Utils.pluck;
var sum = Utils.sum;

var MACalculator = {
	setter(path, key, d, value) { 
		var newD = d, i = 0;
		for (i = 0; i < path.length; i++) {
			if (newD[path[i]] === undefined) newD[path[i]] = {};
			newD = newD[path[i]];
		}
		newD[key] = value;
		return d;
	},
	calculateEMANew(data, period, pluckFunc, setFunc) {
		// console.log("calculating EMA", period, key, pluckKey);
		/*
		EMA = Price(t) * k + EMA(y) * (1 – k)
		t = today, y = yesterday, N = number of days in EMA (or period), k = 2/(N+1)
		*/
		if (data.length > period) {
			var firstSMA = data.slice(0, period)
				.map(pluckFunc)
				.reduce((a, b) => a + b) / period;

			setFunc(data[period], firstSMA);

			// console.log(period, key, pluckKey, subObjectKey, firstSMA);
			var k = 2 / (period + 1), prevEMA = firstSMA, ema;
			// index of array starts with 0, so i starts with period - 1
			for (var i = period - 1; i < data.length; i++) {
				ema = pluckFunc(data[i]) * k + prevEMA * (1 - k);
				setFunc(data[i], ema);
				prevEMA = ema;
			}
		}
		return data;
	},
	calculateSMANew(data, period, pluckFunc, setFunc) {
		// console.log("calculateSMA");

		var l = data.length - 1;

		data.map((each, i) => data.slice(i - period + 1, i + 1))
			.filter((array) => array.length === period && array.length > 0)
			.map((array) => array.map(pluckFunc))
			.map((array) => array.reduce((a, b) => a + b))
			.map((total) => total / period)
			.reverse()
			.forEach((avg, i) => {
				setFunc(data[l - i], avg);
			});

		return data;
	},
};

export default MACalculator;
