"use strict";

import MACalculator from "../utils/MovingAverageCalculator";
import Utils from "../utils/utils.js";

var defaultOptions = {
	fast: 12,
	slow: 26,
	signal: 9,
	pluck: "close",
	fill: {
		MACDLine: 'none',
		signalLine: 'none',
		histogram: 'steelblue'
	},
	stroke: {
		MACDLine: 'red',
		signalLine: 'green',
		histogram: 'steelblue'
	}
};

function MACDIndicator(options, chartProps) {

	var prefix = "chart_" + chartProps.id;
	var MACDOption = Utils.mergeRecursive(options, defaultOptions);
	function MACD() {
	}
	MACD.options = function() {
		return MACDOption;
	};
	MACD.calculate = function(data) {
		// console.log(prefix, options);
		var fastKey = "ema" + MACDOption.fast;
		var slowKey = "ema" + MACDOption.slow;
		var source = MACDOption.pluck || defaultOptions.pluck;

		var newData = MACalculator.calculateEMA(data, MACDOption.fast, fastKey, source, prefix);
		newData = MACalculator.calculateEMA(newData, MACDOption.slow, slowKey, source, prefix);

		newData.forEach(each => {
			if (each[prefix]) {
				if (each[prefix][slowKey] && each[prefix][fastKey]) {
					each[prefix].MACDLine = each[prefix][fastKey] - each[prefix][slowKey];
				}
			}
		});

		MACalculator.calculateEMA(newData.slice(MACDOption.slow), MACDOption.signal, "signalLine", prefix + ".MACDLine", prefix);

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
		return function(d) {
			if (d && d[prefix]) return { MACDLine: d[prefix].MACDLine, signalLine: d[prefix].signalLine, histogram: d[prefix].histogram };
		};
	};
	return MACD;
}

module.exports = MACDIndicator;
