"use strict";

import MACalculator from "../utils/MovingAverageCalculator";
import objectAssign from "object-assign";
import { overlayColors } from "../utils/utils";

import { SMA as defaultOptions } from "./defaultOptions";


function SMAIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	if (options.pluck) options.source = options.pluck;

	var settings = objectAssign({}, defaultOptions, options);
	if (!settings.stroke) settings.stroke = overlayColors(dataSeriesProps.id);

	function indicator() {
	}

	indicator.options = function() {
		return settings;
	};
	indicator.stroke = function() {
		return settings.stroke;
	};
	indicator.calculate = function(data) {
		var setter = MACalculator.setter.bind(null, [prefix], key);

		var { source } = settings;
		var newData = MACalculator.calculateSMANew(data, settings.period, d => d[source], setter);
		return newData;
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
