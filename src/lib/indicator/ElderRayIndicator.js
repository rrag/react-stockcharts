"use strict";

import objectAssign from "object-assign";

import { ElderRay as defaultOptions } from "./defaultOptions";

import { elderRay, merge } from "./calculator";

function ElderRayIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator(data) {
		var { period, source, movingAverageType, ohlc } = settings;
		var getter = d => d[source];

		var elderRayAlgorithm = elderRay()
			.windowSize(period)
			.ohlc(ohlc)
			.movingAverageType(movingAverageType)
			.value(getter);

		var calculateElderRayFor = merge()
			.algorithm(elderRayAlgorithm)
			.mergePath([prefix, key])

		var newData = calculateElderRayFor(data);
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
		return (d) => (d && d[prefix]) ? d[prefix][key] : undefined;
	};
	return indicator;
}

export default ElderRayIndicator;
