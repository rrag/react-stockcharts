"use strict";

import { overlayColors } from "../utils";

var i = 0;

export default function() {

	var id = i++, accessor, stroke, fill, echo, type, tooltipLabel, domain, tickValues;

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
	baseIndicator.tooltipLabel = function(x) {
		if (!arguments.length) {
			if (typeof tooltipLabel === "function") return tooltipLabel();
			return tooltipLabel;
		}
		tooltipLabel = x;
		return baseIndicator;
	};
	baseIndicator.domain = function(x) {
		if (!arguments.length) return domain;
		domain = x;
		return baseIndicator;
	};
	baseIndicator.tickValues = function(x) {
		if (!arguments.length) return tickValues;
		tickValues = x;
		return baseIndicator;
	};
	return baseIndicator;
}