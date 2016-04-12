"use strict";

import { first } from "../../utils";

export default function() {
	var base = d => d.close;
	var mainKeys = [];
	var compareKeys = [];

	function calculator(data) {
		var f = first(data);
		var b = base(f);
		var compareData = data.map(d => {
			var result = {};

			mainKeys.forEach(key => {
				result[key] = (d[key] - b) / b;
			});

			compareKeys.forEach(key => {
				result[key] = (d[key] - f[key]) / f[key];
			});
			return result;
		});
		// console.log(compareData[20]);
		return compareData;
	}
	calculator.base = function(x) {
		if (!arguments.length) {
			return base;
		}
		base = x;
		return calculator;
	};
	calculator.mainKeys = function(x) {
		if (!arguments.length) {
			return mainKeys;
		}
		mainKeys = x;
		return calculator;
	};
	calculator.compareKeys = function(x) {
		if (!arguments.length) {
			return compareKeys;
		}
		compareKeys = x;
		return calculator;
	};
	return calculator;
}