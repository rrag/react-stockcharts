"use strict";

import MACalculator from "../utils/MovingAverageCalculator";
import Utils from "../utils/utils.js";
import objectAssign from "object-assign";

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

function MACDIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator() {
	}
	indicator.options = function() {
		return settings;
	};
	indicator.calculate = function(data) {
		// console.log(prefix, options);
		var fastKey = "ema" + settings.fast;
		var slowKey = "ema" + settings.slow;
		var source = settings.pluck;

		var setter = (setKey, d, value) => { 
			if (d[prefix] === undefined) d[prefix] = {};
			if (d[prefix][key] === undefined) d[prefix][key] = {};
			d[prefix][key][setKey] = value;
			return d;
		};
		var getter = (d) => d[settings.pluck];

		var newData = MACalculator.calculateEMANew(data, settings.fast, getter, setter.bind(null, fastKey));
		newData = MACalculator.calculateEMANew(newData, settings.slow, getter, setter.bind(null, slowKey));

		newData.forEach(each => {
			if (each[prefix]) {
				if (each[prefix][key][slowKey] && each[prefix][key][fastKey]) {
					// each[prefix][key] = {};
					each[prefix][key].MACDLine = each[prefix][key][fastKey] - each[prefix][key][slowKey];
				}
			}
		});
		newData = MACalculator.calculateEMANew(newData.slice(settings.slow), settings.signal,
			(d) => d[prefix][key].MACDLine, setter.bind(null, "signalLine"));

		newData.forEach(each => {
			if (each[prefix] && each[prefix][key]) {
				if (each[prefix][key].MACDLine && each[prefix][key].signalLine) {
					each[prefix][key].histogram = each[prefix][key].MACDLine - each[prefix][key].signalLine;
				}
			}
		});

		// console.table(newData);
		// console.log(newData[newData.length - 3]);
		return newData;
	};
	indicator.yAccessor = function() {
		return (d) => {
			if (d && d[prefix] && d[prefix][key]) { 
				return { MACDLine: d[prefix][key].MACDLine, signalLine: d[prefix][key].signalLine, histogram: d[prefix][key].histogram };
			}
		};
	};
	indicator.isMACD = function() {
		return true;
	};
	return indicator;
}

export default MACDIndicator;
