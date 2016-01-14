"use strict";

import d3 from "d3";
import objectAssign from "object-assign";

import { ForceIndex as defaultOptions } from "./defaultOptions";
import { merge, forceIndex } from "./calculator";

function ForceIndexIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);

	function indicator(data) {
		var { volume, source } = settings;

		var getter = (d) => d[source];

		var forceIndexAlgorithm = forceIndex()
			.volume(volume)
			.close(getter)

		var calculateForceIndexFor = merge()
			.algorithm(forceIndexAlgorithm)
			.mergePath([prefix, key])

		var newData = calculateForceIndexFor(data);
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

export default ForceIndexIndicator;
