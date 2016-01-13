"use strict";

import objectAssign from "object-assign";
import d3 from "d3";

import { overlayColors } from "../utils/utils";

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

		var smaAlgorithm = slidingWindow()
			.windowSize(period)
			.accumulator(d3.mean)
			.value(d => d[source]);

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
		return (d) => {
			if (d && d[prefix]) return d[prefix][key];
		};
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
