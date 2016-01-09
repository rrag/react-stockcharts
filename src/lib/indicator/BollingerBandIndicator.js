"use strict";

import objectAssign from "object-assign";
import get from "lodash.get";
import last from "lodash.last";

import * as MACalculator from "../utils/MovingAverageCalculator";
import { BollingerBand as defaultOptions } from "./defaultOptions";

import { slidingWindow, merge, ema } from "./calculator";

function BollingerBandIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator(data) {
		var { period } = settings;
		var source = d => d[settings.source];

		if (settings.movingAverageType === "ema") {
			var emaAlgorithm = ema().windowSize(period).value(source);

			var calculateEMAFor = merge()
				.algorithm(emaAlgorithm)
				.mergePath([prefix, key, "middle"])
		}

		var bollingerBandAlgorithm = slidingWindow()
			.windowSize(period)
			.accumulator(function(values) {
				var end = last(values);
				var avg = get(end, [prefix, key, "middle"]) || d3.mean(values, source);
				var stdDev = d3.deviation(values, source);
				return {
					top: avg + settings.multiplier * stdDev,
					middle: avg,
					bottom: avg - settings.multiplier * stdDev
				};
			});

		var calculateBBFor = merge()
			.algorithm(bollingerBandAlgorithm)
			.mergePath([prefix, key])

		if (calculateEMAFor) calculateEMAFor(data);
		calculateBBFor(data);
		// console.log(period, data.slice(0, 20));

		// console.log(newData[newData.length - 1]);
		return data;
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
	indicator.isBollingerBand = function() {
		return true;
	};
	return indicator;
}

export default BollingerBandIndicator;
