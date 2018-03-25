

import { rebind, isDefined, isNotDefined, merge, slidingWindow } from "../utils";

import { ElderImpulse as appearanceOptions } from "./defaultOptionsForAppearance";
import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "ElderImpulse";

export default function() {

	let macdSource, emaSource;

	const base = baseIndicator()
		.type(ALGORITHM_TYPE)
		// .stroke(d => stroke[d.elderImpulse])
		.stroke(appearanceOptions.stroke)
		.fill(undefined);

	const underlyingAlgorithm = slidingWindow()
		.windowSize(2)
		.undefinedValue("neutral")
		.accumulator(([prev, curr]) => {
			if (isNotDefined(macdSource)) throw new Error(`macdSource not defined for ${ALGORITHM_TYPE} calculator`);
			if (isNotDefined(emaSource)) throw new Error(`emaSource not defined for ${ALGORITHM_TYPE} calculator`);

			if (isDefined(macdSource(prev)) && isDefined(emaSource(prev))) {
				const prevMACDDivergence = macdSource(prev).divergence;
				const currMACDDivergence = macdSource(curr).divergence;

				const prevEMA = emaSource(prev);
				const currEMA = emaSource(curr);

				if (currMACDDivergence >= prevMACDDivergence
					&& currEMA >= prevEMA) return "up";

				if (currMACDDivergence <= prevMACDDivergence
					&& currEMA <= prevEMA) return "down";
			}
			return "neutral";
		});

	const mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.elderImpulse = indicator; });

	// eslint-disable-next-line prefer-const
	let indicator = function(data, options = { merge: true }) {
		const newData = options.merge
			? mergedAlgorithm(data)
			: underlyingAlgorithm(data);

		return newData;
	};
	indicator.macdSource = function(x) {
		if (!arguments.length) return macdSource;
		macdSource = x;
		return indicator;
	};
	indicator.emaSource = function(x) {
		if (!arguments.length) return emaSource;
		emaSource = x;
		return indicator;
	};
	rebind(indicator, base, "id", "echo", "type", "stroke");
	// rebind(indicator, underlyingAlgorithm, "windowSize", "movingAverageType", "multiplier", "source");
	rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
