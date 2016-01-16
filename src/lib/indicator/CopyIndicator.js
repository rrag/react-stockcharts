"use strict";

import objectAssign from "object-assign";
import getter from "lodash.get"

import { overlayColors, sourceFunctor } from "../utils/utils";

import { merge, ema } from "./calculator";

function CopyIndicator(settings, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	function indicator(data) {
		var { period, source } = settings;
		var value = sourceFunctor(source);

		var extract = data.map(value);

		var copy = merge()
			.algorithm(d3.functor(extract))
			.mergePath([prefix, key]);

		var newData = copy(data);

		return newData;
	}
	indicator.options = function() {
		return settings;
	};
	indicator.calculate = function(data) {
		return indicator(data);
	};
	indicator.yAccessor = function() {
		return (d) => (d && d[prefix]) ? d[prefix][key] : undefined;
	};
	return indicator;
}

export default CopyIndicator;
