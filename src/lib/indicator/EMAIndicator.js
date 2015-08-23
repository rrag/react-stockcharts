"use strict";

import MACalculator from "../utils/MovingAverageCalculator";
import objectAssign from "object-assign";

var defaultOptions = {
	pluck: (d) => d.close,
};

function EMAIndicator(options, chartProps, elementProps) {

	var prefix = "chart_" + chartProps.id;
	var settings = objectAssign({}, defaultOptions, options);
	if (typeof settings.pluck === "string") {
		var { pluck } = settings;
		settings.pluck = (d) => d[pluck];
	}
	var key = "ema" + settings.period;
	function MA() {
	}
	MA.options = function() {
		return settings;
	};
	MA.calculate = function(data) {

		var setter = MACalculator.setter.bind(null, [prefix], key);

		var newData = MACalculator.calculateEMANew(data, settings.period, settings.pluck, setter);
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
