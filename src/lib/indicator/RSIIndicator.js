"use strict";

import objectAssign from "object-assign";

import { RSI as defaultOptions } from "./defaultOptions";
import { rsi, merge } from "./calculator";


function RSIIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);
	function indicator(data) {
		var { period, source } = settings;

		var getter = d => d[source];
		var rsiAlgorithm = rsi()
			.windowSize(period)
			.value(getter);

		var calculateRSIFor = merge()
			.algorithm(rsiAlgorithm)
			.mergePath([prefix, key, "rsi"])

		var newData = calculateRSIFor(data);

		return newData;
	}
	indicator.options = function() {
		return settings;
	};
	indicator.calculate = function(data) {
		return indicator(data);
	};
	indicator.yAccessor = function() {
		return (d) => {
			// console.log(d[prefix][key]);
			if (d && d[prefix]) return d[prefix][key].rsi;
		};
	};
	indicator.domain = function() {
		return [0, 100];
	};
	indicator.yTicks = function() {
		return [settings.overSold, 50, settings.overBought];
	};
	indicator.isRSI = function() {
		return true;
	};
	return indicator;
}

export default RSIIndicator;
