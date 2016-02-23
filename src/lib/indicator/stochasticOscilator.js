"use strict";

import d3 from "d3";

import { merge } from "../utils";
import { sto } from "./algorithm";

import baseIndicator from "./baseIndicator";
import { FullStochasticOscillator as defaultOptions } from "./defaultOptions";

const ALGORITHM_TYPE = "RSI";

export default function() {
	var { K, D, source, period, overSold, overBought, middle, stroke } = defaultOptions;

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.stroke(stroke)
		.accessor(d => d.sto);

	var underlyingAlgorithm = sto()
		.windowSize(period)
		.kWindowSize(K)
		.dWindowSize(D)
		.source(source);

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.sto = indicator; });

	var indicator = function(data) {
		if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
		return mergedAlgorithm(data);
	};
	base.tooltipLabel(() => `${ALGORITHM_TYPE} (${underlyingAlgorithm.windowSize()}`
			+ `, ${underlyingAlgorithm.kWindowSize()}, ${underlyingAlgorithm.dWindowSize()}): `);

	base.domain([0, 100]);
	base.tickValues([overSold, middle, overBought]);

	indicator.overSold = function(x) {
		if (!arguments.length) return overSold;
		overSold = x;
		base.tickValues([overSold, middle, overBought]);
		return indicator;
	};
	indicator.middle = function(x) {
		if (!arguments.length) return middle;
		middle = x;
		base.tickValues([overSold, middle, overBought]);
		return indicator;
	};
	indicator.overBought = function(x) {
		if (!arguments.length) return overBought;
		overBought = x;
		base.tickValues([overSold, middle, overBought]);
		return indicator;
	};

	d3.rebind(indicator, base, "id", "accessor", "stroke", "fill", "echo", "type", "tooltipLabel", "domain", "tickValues");
	d3.rebind(indicator, underlyingAlgorithm, "source", "windowSize", "kWindowSize", "dWindowSize");
	d3.rebind(indicator, mergedAlgorithm, "merge", "skipUndefined");

	return indicator;
}
