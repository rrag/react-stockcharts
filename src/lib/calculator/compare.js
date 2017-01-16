"use strict";

import { first, path } from "../utils";
import { Change as defaultOptions } from "./defaultOptionsForComputation";

export default function() {
	var options = defaultOptions;

	function calculator(data) {
		var { basePath, mainKeys, compareKeys } = options;
		var base = path(basePath);

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
	calculator.options = function(x) {
		if (!arguments.length) {
			return options;
		}
		options = { ...defaultOptions, ...x };
		return calculator;
	};
	return calculator;
}