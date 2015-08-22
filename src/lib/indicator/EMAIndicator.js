"use strict";

import MACalculator from "../utils/MovingAverageCalculator";
import objectAssign from "object-assign";

var defaultOptions = {
	pluck: "close",
};

function EMAIndicator(options, chartProps) {

	var prefix = "chart_" + chartProps.id;
	var settings = objectAssign({}, defaultOptions, options);
	var key = "ema" + settings.period;
	function MA() {
	}
	MA.options = function() {
		return settings;
	};
	MA.calculate = function(data) {
		var newData = MACalculator.calculateEMA(data, settings.period, key, settings.pluck, prefix);
		return newData;
	};
	MA.yAccessor = function() {
		return (d) => {
			if (d && d[prefix]) return d[prefix][key];
		};
	};
	MA.tooltipLabel = function() {
		return `EMA (${ settings.period })`;
	}
	return MA;
}

module.exports = EMAIndicator;
