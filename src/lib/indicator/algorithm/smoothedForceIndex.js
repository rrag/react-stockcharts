"use strict";

import { rebind } from "d3fc-rebind";

import forceIndex from "./forceIndex";
import ema from "./ema";
import sma from "./sma";
import { zipper } from "../../utils";

export default function() {

	var underlyingAlgorithm = forceIndex();
	var smoothing, smoothingType, smoothingWindow;
	var merge = zipper()
			.combine((force, smoothed) => {
				return { force, smoothed };
			});

	function calculator(data) {
		var force = underlyingAlgorithm(data);
		var ma = smoothingType === "ema" ? ema() : sma();
		var forceMA = ma
			.windowSize(smoothingWindow)
			.sourcePath(undefined);

		var smoothed = forceMA(force);
		return merge(force, smoothed);
	}

	rebind(calculator, underlyingAlgorithm, "sourcePath", "volumePath");

	calculator.undefinedLength = function() {
		return underlyingAlgorithm.undefinedLength() + smoothingWindow;
	};
	calculator.smoothing = function(x) {
		if (!arguments.length) {
			return smoothing;
		}
		smoothing = x;
		return calculator;
	};
	calculator.smoothingType = function(x) {
		if (!arguments.length) {
			return smoothingType;
		}
		smoothingType = x;
		return calculator;
	};
	calculator.smoothingWindow = function(x) {
		if (!arguments.length) {
			return smoothingWindow;
		}
		smoothingWindow = x;
		return calculator;
	};

	return calculator;
}
