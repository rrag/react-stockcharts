"use strict";

import objectAssign from "object-assign";
import d3 from "d3";

import { get, overlayColors } from "../utils/utils";

import { SMA as defaultOptions } from "./defaultOptions";
import { slidingWindow, merge } from "./calculator";


function SMAIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	if (options.pluck) options.source = options.pluck;

	var settings = objectAssign({}, defaultOptions, options);
	if (!settings.stroke) settings.stroke = overlayColors(dataSeriesProps.id);

	function indicator(data) {
		var { period, source } = settings;
		var value = (typeof source === "function") ? source : d => get(d, source)

		var smaAlgorithm = slidingWindow()
			.windowSize(period)
			.accumulator(d3.mean)
			.value(value);

		var evaluator = merge()
			.algorithm(smaAlgorithm)
			.mergePath([prefix, key])

		return evaluator(data);
	}

	indicator.options = function() {
		return settings;
	};
	indicator.stroke = function() {
		return settings.stroke;
	};
	indicator.calculate = function(data) {

		return indicator(data)
	};
	indicator.yAccessor = function() {
		return (d) => (d && d[prefix]) ? d[prefix][key] : undefined;
	};
	indicator.tooltipLabel = function() {
		return `SMA (${ settings.period })`;
	};
	indicator.isMovingAverage = function() {
		return true;
	};
	return indicator;
}

export default SMAIndicator;
