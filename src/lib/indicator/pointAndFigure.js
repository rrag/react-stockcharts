"use strict";

import d3 from "d3";

import { pointAndFigure } from "./algorithm";
import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "PointAndFigure";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE);

	var underlyingAlgorithm = pointAndFigure();

	var indicator = function(data) {
		return underlyingAlgorithm(data);
	};

	d3.rebind(indicator, base, "id", "stroke", "fill", "echo", "type", "tooltipLabel");
	d3.rebind(indicator, underlyingAlgorithm, "dateAccessor", "dateMutator", "indexMutator", "indexAccessor");
	d3.rebind(indicator, underlyingAlgorithm, "reversal", "boxSize", "source");
	// d3.rebind(indicator, mergedAlgorithm, "merge"/*, "skipUndefined"*/);

	return indicator;
}