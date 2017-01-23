"use strict";

import { overlayColors } from "../utils";

let i = 0;

export default function() {

	let id = i++, accessor, stroke, fill, echo, type;

	function baseIndicator() {
	}

	baseIndicator.id = function(x) {
		if (!arguments.length) return id;
		id = x;
		return baseIndicator;
	};
	baseIndicator.accessor = function(x) {
		if (!arguments.length) return accessor;
		accessor = x;
		return baseIndicator;
	};
	baseIndicator.stroke = function(x) {
		if (!arguments.length) return !stroke ? stroke = overlayColors(id) : stroke;
		stroke = x;
		return baseIndicator;
	};
	baseIndicator.fill = function(x) {
		if (!arguments.length) return !fill ? fill = overlayColors(id) : fill;
		fill = x;
		return baseIndicator;
	};
	baseIndicator.echo = function(x) {
		if (!arguments.length) return echo;
		echo = x;
		return baseIndicator;
	};
	baseIndicator.type = function(x) {
		if (!arguments.length) return type;
		type = x;
		return baseIndicator;
	};
	return baseIndicator;
}