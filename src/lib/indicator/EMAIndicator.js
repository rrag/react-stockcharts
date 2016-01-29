"use strict";

import objectAssign from "object-assign";

import { get, overlayColors } from "../utils/utils";

import { EMA as defaultOptions } from "./defaultOptions";
import { merge, ema } from "./calculator";

function EMAIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	if (options.pluck) options.source = options.pluck;

	var settings = objectAssign({}, defaultOptions, options);
	if (!settings.stroke) settings.stroke = overlayColors(dataSeriesProps.id);

	function indicator(data) {
		var { period, source } = settings;
		var value = (typeof source === "function") ? source : d => get(d, source)

		// console.log(data[20], period, getter(data[20], source));
		var emaAlgorithm = ema().windowSize(period).value(value);

		var calculateEMAFor = merge()
			.algorithm(emaAlgorithm)
			.mergePath([prefix, key]);

		var newData = calculateEMAFor(data);

		return newData;
	}
	indicator.options = function() {
		return settings;
	};
	indicator.stroke = function() {
		return settings.stroke;
	};
	indicator.calculate = function(data) {

		return indicator(data);
	};
	indicator.yAccessor = function() {
		return (d) => (d && d[prefix]) ? d[prefix][key] : undefined;
	};
	indicator.tooltipLabel = function() {
		return `EMA (${ settings.period })`;
	};
	indicator.isMovingAverage = function() {
		return true;
	};
	return indicator;
}

export default EMAIndicator;
