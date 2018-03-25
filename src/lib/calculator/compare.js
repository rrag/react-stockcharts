

import { head, path, isDefined, isNotDefined } from "../utils";
import { Change as defaultOptions } from "./defaultOptionsForComputation";

export default function() {
	let options = defaultOptions;

	function calculator(data) {
		const { basePath, mainKeys, compareKeys } = options;
		const base = path(basePath);

		const first = head(data);
		const b = base(first);

		// eslint-disable-next-line prefer-const
		let firsts = {};

		const compareData = data.map(d => {
			// eslint-disable-next-line prefer-const
			let result = {};

			mainKeys.forEach(key => {
				if (typeof d[key] === "object") {
					result[key] = {};
					Object.keys(d[key]).forEach(subkey => {
						result[key][subkey] = (d[key][subkey] - b) / b;
					});
				} else {
					result[key] = (d[key] - b) / b;
				}
			});

			compareKeys.forEach(key => {
				if (isDefined(d[key]) && isNotDefined(firsts[key])) {
					firsts[key] = d[key];
				}
				if (isDefined(d[key]) && isDefined(firsts[key])) {
					result[key] = (d[key] - firsts[key]) / firsts[key];
				}
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