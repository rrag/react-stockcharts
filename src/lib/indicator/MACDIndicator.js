"use strict";

import d3 from "d3";
import objectAssign from "object-assign";

import { MACD as defaultOptions } from "./defaultOptions";
import { merge, macd } from "./calculator";

function MACDIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator(data) {
		var { fast, slow, signal, source } = settings;

		var getter = (d) => d[source];

		var macdAlgorithm = macd()
			.fast(fast)
			.slow(slow)
			.signal(signal)
			.value(getter)

		var calculateMACDFor = merge()
			.algorithm(macdAlgorithm)
			.mergePath([prefix, key])

		calculateMACDFor(data);
		return data;
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
