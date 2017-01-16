"use strict";

import forceIndex from "./forceIndex";
import ema from "./ema";
import sma from "./sma";
import { zipper } from "../utils";
import { SmoothedForceIndex as defaultOptions } from "./defaultOptionsForComputation";

export default function() {

	var underlyingAlgorithm = forceIndex();
	var merge = zipper()
			.combine((force, smoothed) => {
				return { force, smoothed };
			});

	var options = defaultOptions;
	function calculator(data) {
		var { smoothingType, smoothingWindow } = options;
		var { sourcePath, volumePath } = options;

		var force = underlyingAlgorithm(data)
			.options({ sourcePath, volumePath });

		var ma = smoothingType === "ema" ? ema() : sma();
		var forceMA = ma
			.options({
				windowSize: smoothingWindow,
				sourcePath: undefined
			});

		var smoothed = forceMA(force);
		return merge(force, smoothed);
	}

	calculator.undefinedLength = function() {
		var { smoothingWindow } = options;
		return underlyingAlgorithm.undefinedLength() + smoothingWindow - 1;
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
