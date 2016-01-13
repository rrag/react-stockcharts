"use strict";

import objectAssign from "object-assign";

import { atr, merge } from "./calculator";
import { ATR as defaultOptions } from "./defaultOptions";

export default function ATRIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator(data) {
		var atrAlgorithm = atr().windowSize(settings.period)

		var atrCalculator = merge()
			.algorithm(atrAlgorithm)
			.mergePath([prefix, key])
		var newData = atrCalculator(data);

		// console.log(newData[20]);
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
			if (d && d[prefix]) return d[prefix][key];
		};
	};
	return indicator;
};