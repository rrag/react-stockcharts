"use strict";


import { scaleOrdinal, schemeCategory10 } from  "d3-scale";
import { bisector } from "d3-array";

import zipper from "./zipper";
import merge from "./merge";
import slidingWindow from "./slidingWindow";
import identity from "./identity";
import noop from "./noop";
import shallowEqual from "./shallowEqual";
import mappedSlidingWindow from "./mappedSlidingWindow";
import accumulatingWindow from "./accumulatingWindow";
import PureComponent from "./PureComponent";

export {
	accumulatingWindow,
	mappedSlidingWindow,
	merge,
	identity,
	noop,
	shallowEqual,
	slidingWindow,
	zipper,
	PureComponent,
};

export * from "./strokeDasharray";

export function getLogger(prefix) {
	return (process.env.NODE_ENV !== "production")
		? require("debug")("react-stockcharts:" + prefix)
		: noop;
}

export function path(path = []) {
	var key = Array.isArray(path) ? path : [path];
	var length = key.length;

	return function(obj, defaultValue) {
		if (length === 0) return isDefined(obj) ? obj : defaultValue;

		var index = 0;
		while (obj != null && index < length) {
			obj = obj[key[index++]];
		}
		return (index === length) ? obj : defaultValue;
	};
}

export function functor(v) {
	return typeof v === "function" ? v : () => v;
}

export function getClosestItemIndexes2(array, value, accessor) {
	var left = bisector(accessor).left(array, value);
	left = Math.max(left - 1, 0);
	var right = Math.min(left + 1, array.length - 1);

	var item = accessor(array[left]);
	if (item >= value && item <= value) right = left;

	return { left, right };
}

export function getClosestValue(values, currentValue) {
	var diff = values
		.map(each => each - currentValue)
		.reduce((diff1, diff2) => Math.abs(diff1) < Math.abs(diff2) ? diff1 : diff2);
	return currentValue + diff;
}


export function d3Window(node) {
	var d3win = node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
	return d3win;
}

export const MOUSEMOVE = "mousemove.pan";
export const MOUSEUP = "mouseup.pan";

export function getClosestItemIndexes(array, value, accessor, log) {
	var lo = 0, hi = array.length - 1;
	while (hi - lo > 1) {
		var mid = Math.round((lo + hi) / 2);
		if (accessor(array[mid]) <= value) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	// for Date object === does not work, so using the <= in combination with >=
	// the same code works for both dates and numbers
	if (accessor(array[lo]) >= value && accessor(array[lo]) <= value) hi = lo;
	if (accessor(array[hi]) >= value && accessor(array[hi]) <= value) lo = hi;

	if (accessor(array[lo]) < value && accessor(array[hi]) < value) lo = hi;
	if (accessor(array[lo]) > value && accessor(array[hi]) > value) hi = lo;

	if (log) {
		// console.log(lo, accessor(array[lo]), value, accessor(array[hi]), hi);
		// console.log(accessor(array[lo]), lo, value, accessor(array[lo]) >= value);
		// console.log(value, hi, accessor(array[hi]), accessor(array[lo]) <= value);
	}
	// var left = value > accessor(array[lo]) ? lo : lo;
	// var right = gte(value, accessor(array[hi])) ? Math.min(hi + 1, array.length - 1) : hi;

	// console.log(value, accessor(array[left]), accessor(array[right]));
	return { left: lo, right: hi };
}

export function getClosestItem(array, value, accessor, log) {
	var { left, right } = getClosestItemIndexes(array, value, accessor, log);

	if (left === right) {
		return array[left];
	}

	var closest = (Math.abs(accessor(array[left]) - value) < Math.abs(accessor(array[right]) - value))
						? array[left]
						: array[right];
	if (log) {
		console.log(array[left], array[right], closest, left, right);
	}
	return closest;
}

export const overlayColors = scaleOrdinal(schemeCategory10);

export function head(array, accessor) {
	if (accessor && array) {
		var value;
		for (var i = 0; i < array.length; i++) {
			value = array[i];
			if (isDefined(accessor(value))) return value;
		}
		return undefined;
	}
	return array ? array[0] : undefined;
}

export function tail(array, accessor) {
	if (accessor && array) {
		return array.map(accessor).slice(1);
	}
	return array ? array.slice(1) : undefined;
}

export const first = head;

export function last(array, accessor) {
	if (accessor && array) {
		var value;
		for (var i = array.length - 1; i >= 0; i--) {
			value = array[i];
			if (isDefined(accessor(value))) return value;
		}
		return undefined;
	}
	var length = array ? array.length : 0;
	return length ? array[length - 1] : undefined;
}

export function isDefined(d) {
	return d !== null && typeof d != "undefined";
}

export function isNotDefined(d) {
	return !isDefined(d);
}

export function isObject(d) {
	return isDefined(d) && typeof d === "object" && !Array.isArray(d);
}

export const isArray = Array.isArray;

export function touchPosition(touch, e) {
	var container = e.target,
		rect = container.getBoundingClientRect(),
		x = touch.clientX - rect.left - container.clientLeft,
		y = touch.clientY - rect.top - container.clientTop,
		xy = [Math.round(x), Math.round(y)];
	return xy;
}

export function mousePosition(e, defaultRect) {
	var container = e.currentTarget;
	var rect = defaultRect || container.getBoundingClientRect(),
		x = e.clientX - rect.left - container.clientLeft,
		y = e.clientY - rect.top - container.clientTop,
		xy = [Math.round(x), Math.round(y)];
	return xy;
}


export function clearCanvas(canvasList, ratio) {
	canvasList.forEach(each => {
		each.setTransform(1, 0, 0, 1, 0, 0);
		each.clearRect(-1, -1, each.canvas.width + 2, each.canvas.height + 2);
		each.scale(ratio, ratio);
	});
}

export function capitalizeFirst(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export function hexToRGBA(inputHex, opacity) {
	var hex = inputHex.replace("#", "");
	if (inputHex.indexOf("#") > -1 && (hex.length === 3 || hex.length === 6)) {

		var multiplier = (hex.length === 3) ? 1 : 2;

		var r = parseInt(hex.substring(0, 1 * multiplier), 16);
		var g = parseInt(hex.substring(1 * multiplier, 2 * multiplier), 16);
		var b = parseInt(hex.substring(2 * multiplier, 3 * multiplier), 16);

		var result = `rgba(${ r }, ${ g }, ${ b }, ${ opacity })`;

		return result;
	}
	return inputHex;
}
