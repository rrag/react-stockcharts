"use strict";

import objectAssign from "object-assign";

import { FullStochasticOscillator as defaultOptions } from "./defaultOptions";
import { sto, merge } from "./calculator";

function FullStochasticOscillator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator(data) {
		var { K, D, ohlc, period } = settings;

		var stoAlgorithm = sto()
			.windowSize(period)
			.kWindowSize(K)
			.dWindowSize(D)
			.value(ohlc);

		var calculateSTOFor = merge()
			.algorithm(stoAlgorithm)
			.mergePath([prefix, key])

		var newData = calculateSTOFor(data);

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
