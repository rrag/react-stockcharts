'use strict';

var Utils = require('./utils');

var pluck = Utils.pluck;
var sum = Utils.sum;

function MACalculator() {

};
MACalculator.calculateSMA = function(data, period) {

	var l = data.length - 1, key = 'sma' + period;

	data.map((each, i) => data.slice(i - period, i))
		.filter((array) => array.length > 0)
		.map((array) => pluck(array, "close"))
		.map((array) => sum(array))
		.map((sum) => sum / period)
		.reverse()
		.forEach((avg, i) => data[l - i][key] = avg);

	return data;
}

MACalculator.calculateEMA = function (data, period) {
	console.log('calculating EMA');
	return false;
}

module.exports = MACalculator;
