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
	if (key === 'sma53_chart_2') {
		console.table(data);
	}
	return data;
}

MACalculator.calculateEMA = function (data, period) {
	console.log('calculating EMA');
	return false;
}

module.exports = MACalculator;
