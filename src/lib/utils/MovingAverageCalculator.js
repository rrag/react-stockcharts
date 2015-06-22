'use strict';

var Utils = require('./utils');

var pluck = Utils.pluck;
var sum = Utils.sum;

function MACalculator() {

};
MACalculator.calculateSMA = function(data, period, key, pluckKey, subObjectKey) {
	// console.log('calculateSMA');

	var l = data.length - 1;//, key = 'sma' + period;

	data.map((each, i) => data.slice(i - period, i))
		.filter((array) => array.length === period && array.length > 0)
		.map((array) => pluck(array, pluckKey))
		.map((array) => sum(array))
		.map((sum) => sum / period)
		.reverse()
		.forEach((avg, i) => {
			// data[l - i][key] = avg;
			setter(data[l - i], subObjectKey, key, avg);
		})

	return data;
}

MACalculator.calculateEMA = function (data, period, key, pluckKey, subObjectKey) {
	// console.log('calculating EMA', period, key, pluckKey);
	/*
	EMA = Price(t) * k + EMA(y) * (1 – k)
	t = today, y = yesterday, N = number of days in EMA (or period), k = 2/(N+1)
	*/
	if (data.length > period) {
		var firstSMA = data.slice(0, period)
			.map((each) => getter(each, pluckKey))
			//.map((each) => each[pluckKey])
			.reduce((a, b) => a + b) / period;

		setter(data[period], subObjectKey, key, firstSMA)

		// console.log(period, key, pluckKey, subObjectKey, firstSMA);
		var k = 2 / (period + 1), prevEMA = firstSMA, ema;

		for (var i = period; i < data.length; i++) {
			ema = getter(data[i], pluckKey) * k + prevEMA * (1 - k);
			setter(data[i], subObjectKey, key, ema);

			prevEMA = ema;
		}
	}
	return data;
}

function setter(obj, subObjectKey, key, value) {
	if (subObjectKey) {
		if (obj[subObjectKey] === undefined) obj[subObjectKey] = {};
		obj[subObjectKey][key] = value;
	} else
		obj[key] = value;
}

function getter(obj, pluckKey) {
	var keys = pluckKey.split('.');
	var value;
	keys.forEach(key => {
		if (!value) value = obj[key];
		else value = value[key];
	})
	return value;
}

module.exports = MACalculator;
