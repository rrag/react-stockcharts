"use strict";

import React from "react";
import d3 from "d3";
import get from "lodash.get"
import isEqual from "lodash.isequal"

export const overlayColors = d3.scale.category10();

export function isReactVersion13() {
	var version = React.version.split(".")[1];
	return version === "13";
};

export function isReactVersion14() {
	return React.version.split(".")[1] === "14";
};

export function isDefined(d) {
	return d !== null && typeof d != "undefined";
}

export function isNotDefined(d) {
	return ! isDefined(d);
}

export function sourceFunctor(v) {
	var type = typeof v;
	if (type === "string" || type === "object" && Array.isArray(v)) return d => get(d, v);
	return d3.functor(v);
}

export function cloneMe(obj) {
	if (obj == null || typeof (obj) !== "object") {
		return obj;
	}
	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}
	var temp = {}; // obj.constructor(); // changed

	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			temp[key] = cloneMe(obj[key]);
		}
	}
	return temp;
};

export const displayDateFormat = d3.time.format("%Y-%m-%d");

export function displayNumberFormat(x) {
	return numberWithCommas(x.toFixed(2));
};

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

export function mergeRecursive(obj1, obj2) {
	for (var p in obj2) {
		try {
			// Property in destination object set; update its value.
			if (obj2[p].constructor === Object) {
				obj1[p] = mergeRecursive(obj1[p], obj2[p]);

			} else {
				obj1[p] = obj2[p];

			}

		} catch (e) {
			// Property in destination object not set; create it and set its value.
			obj1[p] = obj2[p];

		}
	}

	return obj1;
};

export function touchPosition(touch, e) {
	var container = e.target,
		rect = container.getBoundingClientRect(),
		x = touch.clientX - rect.left - container.clientLeft,
		y = touch.clientY - rect.top - container.clientTop,
		xy = [Math.round(x), Math.round(y)];
	return xy;
};

export function mousePosition(e) {
	var container = e.currentTarget,
		rect = container.getBoundingClientRect(),
		x = e.clientX - rect.left - container.clientLeft,
		y = e.clientY - rect.top - container.clientTop,
		xy = [Math.round(x), Math.round(y)];
	return xy;
};

export function getValue(d) {
	if (d instanceof Date) {
		return d.getTime();
	}
	return d;
}

export function getClosestItem(array, value, accessor) {
	var lo = 0, hi = array.length - 1;
	while (hi - lo > 1) {
		var mid = Math.round((lo + hi) / 2);
		if (accessor(array[mid]) <= value) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	if (accessor(array[lo]) === value) hi = lo;
	var closest = (Math.abs(accessor(array[lo]) - value) < Math.abs(accessor(array[hi]) - value))
						? array[lo]
						: array[hi];
	// console.log(array[lo], array[hi], closest, lo, hi);
	return closest;
};

export function getClosestItemIndex(array, value, accessor) {
	var lo = 0, hi = array.length - 1;
	while (hi - lo > 1) {
		var mid = Math.round((lo + hi) / 2);
		if (accessor(array[mid]) <= value) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	if (accessor(array[lo]) === value) hi = lo;
	var closestIndex = (Math.abs(accessor(array[lo]) - value) < Math.abs(accessor(array[hi]) - value))
						? lo
						: hi;

	// console.log(value, accessor(array[closestIndex]));

	return closestIndex;
};

export function clearCanvas(canvasList) {
	// console.log("CLEARING...", canvasList.length)
	canvasList.forEach(each => {
		// console.log(each.canvas.id);
		each.setTransform(1, 0, 0, 1, 0, 0);
		each.clearRect(-1, -1, each.canvas.width + 2, each.canvas.height + 2);
	});
};

export function calculate(dataPreProcessor, calculator, data) {
	var result = dataPreProcessor(data);
	calculator.forEach(eachCalculate => {
		var each = eachCalculate();
		if (each.dataPreProcessor)
			each.dataPreProcessor(dataPreProcessor);

		if (Array.isArray(data))
			result = each(result);
		else {
			Object.keys(result).forEach(key => {
				result[key] = each(result[key]);
			})
		}
	});
	return result;
};
function lte(value, compare) {
	return value < compare || isEqual(value, compare)
}

function gte(value, compare) {
	return value > compare || isEqual(value, compare)
}

export function getClosestItemIndexes(array, value, accessor) {
	var lo = 0, hi = array.length - 1;
	while (hi - lo > 1) {
		var mid = Math.round((lo + hi) / 2);
		if (lte(accessor(array[mid]), value)) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	if (isEqual(accessor(array[lo]), value)) hi = lo;

	// console.log(accessor(array[lo]), lo, value, hi, accessor(array[hi]));

	// var left = value > accessor(array[lo]) ? lo : lo;
	// var right = gte(value, accessor(array[hi])) ? Math.min(hi + 1, array.length - 1) : hi;

	// console.log(value, accessor(array[left]), accessor(array[right]));
	return { left: lo, right: hi };
};

export function pluck(array, key) {
	return array.map((each) => getter(each, key));
}

export function keysAsArray(obj) {
	return Object.keys(obj)
		.filter((key) => obj[key] !== null)
		.map((key) => obj[key]);
};

export function sum(array) {
	return array.reduce((d1, d2) => d1 + d2);
}

export function setter(obj, subObjectKey, key, value) {
	if (subObjectKey) {
		if (obj[subObjectKey] === undefined) obj[subObjectKey] = {};
		obj[subObjectKey][key] = value;
	} else {
		obj[key] = value;
	}
};

export function getter(obj, pluckKey) {
	var keys = pluckKey.split(".");
	var value;
	keys.forEach(key => {
		if (!value) value = obj[key];
		else value = value[key];
	});
	return value;
};

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
};

// export default Utils;
