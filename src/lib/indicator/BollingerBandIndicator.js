"use strict";

import objectAssign from "object-assign";

import { BollingerBand as defaultOptions } from "./defaultOptions";

import { bollingerband, merge } from "./calculator";

function BollingerBandIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator(data) {
		var { period, source, movingAverageType, multiplier } = settings;
		var getter = d => d[source];

		var bollingerBandAlgorithm = bollingerband()
			.windowSize(period)
			.movingAverageType(movingAverageType)
			.multiplier(multiplier)
			.value(getter);

		var calculateBBFor = merge()
			.algorithm(bollingerBandAlgorithm)
			.mergePath([prefix, key])

		// console.log(period, data.slice(0, 20));

		// console.log(newData[newData.length - 1]);
		return calculateBBFor(data);
	}
	indicator.options = function() {
		return settings;
	};
	indicator.calculate = function(data) {
		return indicator(data);
	};
	indicator.yAccessor = function() {
		return (d) => (d && d[prefix]) ? d[prefix][key] : undefined;
	};
	indicator.isBollingerBand = function() {
		return true;
	};
	return indicator;
}

export default BollingerBandIndicator;
