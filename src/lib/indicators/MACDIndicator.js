'use strict';

var MACalculator = require('../utils/MovingAverageCalculator');


var defaultOptions = { fast: 12, slow: 26, signal: 9, pluck: 'close',  }

function MACDIndicator(options, chartProps) {
	var name = "MACD";
	var prefix = 'chart_' + chartProps.id;
	function MACD() {
	}
	MACD.calculate = function(data) {
		// console.log(prefix, options);
		var fastKey = 'ema' + options.fast;
		var slowKey = 'ema' + options.slow;
		var source = options.pluck || defaultOptions.pluck;

		var newData = MACalculator.calculateEMA(data, options.fast, fastKey, source, prefix);
		newData = MACalculator.calculateEMA(newData, options.slow, slowKey, source, prefix);

		newData.forEach(each => {
			if (each[prefix]) {
				if (each[prefix][slowKey] && each[prefix][fastKey]) {
					each[prefix].MACDLine = each[prefix][fastKey] - each[prefix][slowKey];
				}
			}
		});

		MACalculator.calculateEMA(newData.slice(options.slow), options.signal, 'signalLine', prefix + '.MACDLine', prefix);

		newData.forEach(each => {
			if (each[prefix]) {
				if (each[prefix].MACDLine && each[prefix].signalLine) {
					each[prefix].histogram = each[prefix].MACDLine - each[prefix].signalLine;
				}
			}
		});

		// console.table(newData);
		// console.log(newData[newData.length - 3]);
		return newData;
	};
	MACD.yAccessor = function() {
		return function (d) {
			if (d && d[prefix]) return { MACDLine: d[prefix].MACDLine, signalLine: d[prefix].signalLine, histogram: d[prefix].histogram }
			else return;
		};
	}
	return MACD;
}

module.exports = MACDIndicator