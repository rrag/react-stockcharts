"use strict";

import MACalculator from "../utils/MovingAverageCalculator";
import objectAssign from "object-assign";
import { overlayColors } from "../utils/utils";

var defaultOptions = {
	pluck: "close",
};

function SMAIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);
	if (typeof settings.pluck === "string") {
		var { pluck } = settings;
		settings.pluck = (d) => d[pluck];
	}
	var stroke = settings.stroke || overlayColors(dataSeriesProps.id);

	function indicator() {
	}

	indicator.options = function() {
		return settings;
	};
	indicator.stroke = function() {
		return stroke;
	};
	indicator.calculate = function(data) {
		var setter = MACalculator.setter.bind(null, [prefix], key);

		var newData = MACalculator.calculateSMANew(data, settings.period, settings.pluck, setter);
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
