"use strict";

import { cloneMe } from "./utils";

export function getToolTipLabel(props) {
	if (props.type === "sma" || props.type === "ema") {
		var tooltip = props.type.toUpperCase() + "(" + props.options.period + ")";
		return tooltip;
	}
	return "N/A";
};

export function getYAccessorKey(chartId, props) {
	if (props.type === "sma" || props.type === "ema") {
		var key = props.type + props.options.period + "_chart_" + chartId;
		return key;
	}
	return false;
};

export function firstDefined(data, accessor) {
	var each;
	for (var i = 0; i < data.length; i++) {
		if (accessor(data[i]) === undefined) continue;
		each = data[i];
		// console.log(i, each, accessor(each));
		break;
	}
	return cloneMe(each);
};

export function lastDefined(data, accessor) {
	var each;
	for (var i = data.length - 1; i >= 0; i--) {
		if (accessor(data[i]) === undefined) continue;
		each = data[i];
		// console.log(i, each, accessor(each));
		break;
	}
	return cloneMe(each);
};
