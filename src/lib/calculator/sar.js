"use strict";

import { mappedSlidingWindow, isNotDefined, isDefined } from "../utils";
import { SAR as defaultOptions } from "./defaultOptionsForComputation";

function calc(prev, now) {
	const risingSar = prev.risingSar
		+ prev.af * (prev.risingEp - prev.risingSar);

	const fallingSar = prev.fallingSar
		- prev.af * (prev.fallingSar - prev.fallingEp);

	const risingEp = Math.max(prev.risingEp, now.high);
	const fallingEp = Math.min(prev.fallingEp, now.low);

	return {
		risingSar,
		fallingSar,
		risingEp,
		fallingEp,
	};
}

export default function() {

	let options = defaultOptions;

	function calculator(data) {
		const { accelerationFactor, maxAccelerationFactor } = options;

		const algorithm = mappedSlidingWindow()
			.windowSize(2)
			.undefinedValue(({ high, low }) => {
				return {
					risingSar: low,
					risingEp: high,
					fallingSar: high,
					fallingEp: low,
					af: accelerationFactor,
				};
			})
			.accumulator(([prev, now]) => {

				const {
					risingSar,
					fallingSar,
					risingEp,
					fallingEp,
				} = calc(prev, now);

				if (isNotDefined(prev.use)
						&& risingSar > now.low
						&& fallingSar < now.high) {
					return {
						risingSar,
						fallingSar,
						risingEp,
						fallingEp,
					};
				}

				const use = isDefined(prev.use)
					? prev.use === "rising"
						? risingSar > now.low ? "falling" : "rising"
						: fallingSar < now.high ? "rising" : "falling"
					: risingSar > now.low
						? "falling"
						: "rising";

				const current = prev.use === use
					? {
						af: Math.min(maxAccelerationFactor, prev.af + accelerationFactor),
						fallingEp,
						risingEp,
						fallingSar,
						risingSar,
					}
					: {
						af: accelerationFactor,
						fallingEp: now.low,
						risingEp: now.high,
						fallingSar: Math.max(prev.risingEp, now.high),
						risingSar: Math.min(prev.fallingEp, now.low),
					};

				const { date, high, low } = now;
				return {
					date,
					high,
					low,
					...current,
					use,
					sar: use === "falling" ? current.fallingSar : current.risingSar,
				};
			});

		const calculatedData = algorithm(data).map(d => d.sar);
		// console.log(calculatedData);

		return calculatedData;
	}
	calculator.undefinedLength = function() {
		return 1;
	};
	calculator.options = function(x) {
		if (!arguments.length) {
			return options;
		}
		options = { ...defaultOptions, ...x };
		return calculator;
	};

	return calculator;
}
