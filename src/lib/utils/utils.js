"use strict";

import React from "react";
import d3 from "d3";

var overlayColors = d3.scale.category10();

var Utils = {
	overlayColors: overlayColors,
	isReactVersion13() {
		var version = React.version.split(".")[1];
		return version === "13";
	},
	isReactVersion14() {
		return React.version.split(".")[1] === "14";
	},
	cloneMe(obj) {
		if (obj == null || typeof (obj) !== "object") {
			return obj;
		}
		if (obj instanceof Date) {
			return new Date(obj.getTime());
		}
		var temp = {}; // obj.constructor(); // changed

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				temp[key] = this.cloneMe(obj[key]);
			}
		}
		return temp;
	},
	displayDateFormat: d3.time.format("%Y-%m-%d"),
	displayNumberFormat(x) {
		return Utils.numberWithCommas(x.toFixed(2));
	},
	numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	},
	mergeRecursive(obj1, obj2) {
		for (var p in obj2) {
			try {
				// Property in destination object set; update its value.
				if (obj2[p].constructor == Object) {
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
	},
	mousePosition(e) {
		var container = e.currentTarget,
			rect = container.getBoundingClientRect(),
			x = e.clientX - rect.left - container.clientLeft,
			y = e.clientY - rect.top - container.clientTop,
			xy = [ Math.round(x), Math.round(y) ];
		return xy;
	},
	getValue(d) {
		if (d instanceof Date) {
			return d.getTime();
		}
		return d;
	},
	getClosestItem(array, value, accessor) {
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
		return Utils.cloneMe(closest);
	},
	getClosestItemIndex(array, value, accessor) {
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

		return closestIndex;
	},
	getClosestItemIndexes(array, value, accessor) {
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
		// console.log(array[lo], array[hi], closestIndex, lo, hi);
		return {
			left: value > accessor(array[lo]) ? hi : lo,
			right: value >= accessor(array[hi]) ? hi + 1 : hi
		};
	},

	pluck(array, key) {
		return array.map((each) => Utils.getter(each, key));
	},
	keysAsArray(obj) {
		return Object.keys(obj)
			.filter((key) => obj[key] !== null)
			.map((key) => obj[key]);
	},
	sum(array) {
		return array.reduce((d1, d2) => d1 + d2);
	},
	setter(obj, subObjectKey, key, value) {
		if (subObjectKey) {
			if (obj[subObjectKey] === undefined) obj[subObjectKey] = {};
			obj[subObjectKey][key] = value;
		} else {
			obj[key] = value;
		}
	},
	getter(obj, pluckKey) {
		var keys = pluckKey.split(".");
		var value;
		keys.forEach(key => {
			if (!value) value = obj[key];
			else value = value[key];
		});
		return value;
	}
};

module.exports = Utils;
