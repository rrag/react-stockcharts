"use strict";

import MACalculator from "../utils/MovingAverageCalculator";
import objectAssign from "object-assign";
import { overlayColors } from "../utils/utils";

var defaultOptions = {
	pluck: "close",
};

function SMAIndicator(options, chartProps, elementProps) {

	var prefix = "chart_" + chartProps.id;
	var settings = objectAssign({}, defaultOptions, options);
	if (typeof settings.pluck === "string") {
		var { pluck } = settings;
		settings.pluck = (d) => d[pluck];
	}
	var key = "overlay_" + (elementProps.id !== undefined ? elementProps.id : "default");
	var stroke = settings.stroke || overlayColors(elementProps.id);

	function MA() {
	}

	MA.options = function() {
		return settings;
	};
	MA.stroke = function() {
		return stroke;
	};
	MA.calculate = function(data) {
		var setter = MACalculator.setter.bind(null, [prefix], key);

		var newData = MACalculator.calculateSMANew(data, settings.period, settings.pluck, setter);
		return newData;
	};
	MA.yAccessor = function() {
		return (d) => {
			if (d && d[prefix]) return d[prefix][key];
		};
	};
	MA.tooltipLabel = function() {
		return `SMA (${ settings.period })`;
	};
	MA.isMovingAverage = function() {
		return true;
	};
	return MA;
}

export default SMAIndicator;
