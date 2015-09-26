"use strict";

import MACalculator from "../utils/MovingAverageCalculator";
import Utils from "../utils/utils.js";
import objectAssign from "object-assign";

var defaultOptions = {
	period: 12,
	K: 3,
	D: 3,
	ohlc: (d) => ({open: d.open, high: d.high, low: d.low, close: d.close}),
	stroke: {
		D: 'green',
		K: 'red',
	},
	overSold: 80,
	overBought: 20,
};

function FullStochasticOscillator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator() {
	}
	indicator.options = function() {
		return settings;
	};
	indicator.calculate = function(data) {
		var arr, highAndLow, ohlc;

		var setter = (setKey, d, value) => { 
			if (d[prefix] === undefined) d[prefix] = {};
			if (d[prefix][key] === undefined) d[prefix][key] = {};
			d[prefix][key][setKey] = value;
			return d;
		};

		for (var i = settings.period - 1; i < data.length; i++) {
			arr = data.slice(i - settings.period + 1, i + 1);
			highAndLow = arr.map(settings.ohlc)
				.map(ohlc => [ohlc.high, ohlc.low])
				.reduce((a, b) => [Math.max(a[0], b[0]), Math.min(a[1], b[1])]);
			ohlc = settings.ohlc(data[i]);

			var oscilator = (ohlc.close - highAndLow[1]) / (highAndLow[0] - highAndLow[1]) * 100;

			setter("stochasticOscillatorBase", data[i], oscilator);
		}

		var newData = MACalculator.calculateSMANew(data.slice(settings.period), settings.K,
			(d) => d[prefix][key].stochasticOscillatorBase, setter.bind(null, "K"));

		newData = MACalculator.calculateSMANew(newData.slice(settings.period), settings.D,
			(d) => d[prefix][key].K, setter.bind(null, "D"));

		// console.log(newData[newData.length - 1]);
		return newData;
	};
	indicator.yAccessor = function() {
		return (d) => {
			if (d && d[prefix] && d[prefix][key]) { 
				return { K: d[prefix][key].K, D: d[prefix][key].D };
				// return d[prefix][key].K;
			}
		};
	};
	indicator.domain = function() {
		return [0, 100];
	};
	indicator.yTicks = function() {
		return [settings.overSold, 50, settings.overBought];
	};
	indicator.isStochastic = function() {
		return true;
	};
	return indicator;
}

export default FullStochasticOscillator;
