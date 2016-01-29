"use strict";

import d3 from "d3";
import objectAssign from "object-assign";

import { zipper, slidingWindow, merge } from "./calculator";
import { ElderImpulse as defaultOptions } from "./defaultOptions";
import { get, set, sourceFunctor } from "../utils/utils";

function ElderImpulseIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator(data) {
		var allSources = settings.source.map(sourceFunctor);
		var algorithm = slidingWindow()
			.windowSize(2)
			.undefinedValue(d => set(d, [prefix, key], "neutral"))
			.accumulator(([prev, curr]) => {
				var prevValue = allSources.map(eachSource => eachSource(prev));
				var currValue = allSources.map(eachSource => eachSource(curr));
				
				var zip = zipper()
					.combine((prev, curr) => curr >= prev ? "up" : "down")

				return zip(prevValue, currValue).reduce((a, b) => a === b ? a : "neutral");
			});

		var calculator = merge()
			.algorithm(algorithm)
			.mergePath([prefix, key]);

		var newData = calculator(data);

		// console.log(newData[20]);

		return newData;
	}
	indicator.options = function() {
		return settings;
	};
	indicator.strokeProvider = function() {
		return d => settings.stroke[get(d, [prefix, key])];
	}
	indicator.calculate = function(data) {
		return indicator(data);
	};
	indicator.yAccessor = function() {
		return (d) => ({ open: d.open, high: d.high, low: d.low, close: d.close });
	};
	return indicator;
}

export default ElderImpulseIndicator;
