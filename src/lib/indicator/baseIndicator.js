"use strict";

import merge from "../utils/merge";
import { overlayColors } from "../utils/utils";

import { EMA as defaultOptions } from "./defaultOptions";
import { ema } from "./calculator";

var i = 0;

export default function() {

	var accessor, stroke = overlayColors(i++), fill = stroke, echo;

	function baseIndicator() {
	}

	baseIndicator.accessor = function(x) {
		if (!arguments.length) return accessor;
		accessor = x;
		return baseIndicator;
	};
	baseIndicator.stroke = function(x) {
		if (!arguments.length) return stroke;
		stroke = x;
		return baseIndicator;
	};
	baseIndicator.fill = function(x) {
		if (!arguments.length) return fill;
		fill = x;
		return baseIndicator;
	};
	baseIndicator.echo = function(x) {
		if (!arguments.length) return echo;
		echo = x;
		return baseIndicator;
	};
	return baseIndicator;
}