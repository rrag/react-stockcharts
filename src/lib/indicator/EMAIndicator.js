"use strict";

import MACalculator from "../utils/MovingAverageCalculator";
import objectAssign from "object-assign";

import { overlayColors } from "../utils/utils";

var defaultOptions = {
	pluck: "close",
};

function EMAIndicator(options, chartProps, dataSeriesProps) {

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

		var newData = MACalculator.calculateEMANew(data, settings.period, settings.pluck, setter);
		// console.log(newData[newData.length - 3]);

		return newData;
	};
	indicator.yAccessor = function() {
		return (d) => {
			if (d && d[prefix]) return d[prefix][key];
		};
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
