'use strict';

var Utils = require('./utils');

var pluck = Utils.pluck;
var sum = Utils.sum;

function MACalculator() {

};
MACalculator.calculateSMA = function(data, period, key, pluckKey) {
	// console.log('calculateSMA');

	var l = data.length - 1;//, key = 'sma' + period;
	var maKey = pluckKey || 'close';

	data.map((each, i) => data.slice(i - period, i))
		.filter((array) => array.length === period && array.length > 0)
		.map((array) => pluck(array, maKey))
		.map((array) => sum(array))
		.map((sum) => sum / period)
		.reverse()
		.forEach((avg, i) => {
			// Object.defineProperty(data[l - i], key, { value: avg });
			data[l - i][key] = avg;
			// console.log(data[l - i][key]);
		})

	return data;
}

MACalculator.calculateEMA = function (data, period, key, pluckKey) {
	// console.log('calculating EMA', period, key, pluckKey);
	/*
	EMA = Price(t) * k + EMA(y) * (1 – k)
	t = today, y = yesterday, N = number of days in EMA (or period), k = 2/(N+1)
	*/

	if (data.length > period) {
		var firstSMA = data.slice(0, period)
			.map((each) => each[pluckKey])
			.reduce((a, b) => a + b) / period;

		data[period][key] = firstSMA;

		var k = 2 / (period + 1), prevEMA = firstSMA;

		for (var i = period; i < data.length; i++) {
			data[i][key] = data[i][pluckKey] * k + prevEMA * (1 - k)
			prevEMA = data[i][key];
		}
	}

	return data;
}

module.exports = MACalculator;
