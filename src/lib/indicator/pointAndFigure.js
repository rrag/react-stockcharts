"use strict";

import { rebind } from "d3fc-rebind";

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

	rebind(indicator, base, "id", "stroke", "fill", "echo", "type", "tooltipLabel");
	rebind(indicator, underlyingAlgorithm, "dateAccessor", "dateMutator");
	rebind(indicator, underlyingAlgorithm, "reversal", "boxSize", "sourcePath");
	// rebind(indicator, mergedAlgorithm, "merge"/*, "skipUndefined"*/);

	return indicator;
}