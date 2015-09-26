"use strict";

import MACalculator from "../utils/MovingAverageCalculator";
import objectAssign from "object-assign";

var defaultOptions = {
	period: 20,
	pluck: "close",
	multiplier: 2,
	maType: "sma"
};

function BollingerBandIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator() {
	}
	indicator.options = function() {
		return settings;
	};
	indicator.calculate = function(data) {
		var { period } = settings;

		var ma = settings.maType === "sma" ? MACalculator.calculateSMANew : MACalculator.calculateEMANew;
		var getter = (d) => d[settings.pluck];
		var setter = MACalculator.setter.bind(null, [prefix, key], "middle");
		var newData = ma(data, period, getter, setter);

		// console.log(period, newData.slice(0, 20));

		newData.map((each, i) => newData.slice(i - period + 1, i + 1))
			.filter((array) => array.length === period && array.length > 0)
			.map(array => ({
					array: array,
					mean: array[array.length - 1][prefix][key].middle
				}))
			.forEach((meanAndArray) => {
					var averageOfDeviationSquared = meanAndArray.array
						.map(getter)
						.map(val => val - meanAndArray.mean)
						.map(val => val * val)
						.reduce((a, b) => a + b) / meanAndArray.array.length;
					var standardDev = Math.sqrt(averageOfDeviationSquared);
					var item = meanAndArray.array[meanAndArray.array.length - 1][prefix][key];
					item.top = item.middle + settings.multiplier * standardDev;
					item.bottom = item.middle - settings.multiplier * standardDev;
					// console.log(meanAndArray.array[meanAndArray.array.length - 1]);
				});
		// console.log(newData[newData.length - 1]);
		return newData;
	};
	indicator.yAccessor = function() {
		return (d) => {
			// console.log(d[prefix][key]);
			if (d && d[prefix]) return d[prefix][key];
		};
	};
	indicator.isBollingerBand = function() {
		return true;
	};
	return indicator;
}

export default BollingerBandIndicator;
