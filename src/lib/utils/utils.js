'use strict';

var d3 = require('d3');

function Utils() {
}

Utils.cloneMe = function(obj) {
	if(obj == null || typeof(obj) !== 'object')
		return obj;
	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}
	var temp = {};//obj.constructor(); // changed

	for(var key in obj) {
		if(obj.hasOwnProperty(key)) {
			temp[key] = Utils.cloneMe(obj[key]);
		}
	}
	return temp;
}
Utils.displayDateFormat = d3.time.format("%Y-%m-%d");
Utils.displayNumberFormat = function(x) {
	return Utils.numberWithCommas(x.toFixed(2));
};
Utils.numberWithCommas = function(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
Utils.isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};
Utils.mousePosition = function(e) {
	var container = e.currentTarget,
		rect = container.getBoundingClientRect(),
		x = e.clientX - rect.left - container.clientLeft,
		y = e.clientY - rect.top - container.clientTop,
		xy = [ Math.round(x), Math.round(y) ];
	return xy;
}
Utils.getValue = function(d) {
	if (d instanceof Date) {
		return d.getTime();
	}
	return d;
}
Utils.getClosestItem = function(array, value, accessor) {
	//getClosestValue = function(array, xIndex) {
	var lo = 0, hi = array.length - 1;
	while (hi - lo > 1) {
		var mid = Math.round((lo + hi)/2);
		if (accessor(array[mid]) <= value) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	if (accessor(array[lo]) === value) hi = lo;
	var closest = (Math.abs(accessor(array[lo]) - value) < Math.abs(accessor(array[hi]) - value))
						? array[lo]
						: array[hi]
	//console.log(array[lo], array[hi], closest, lo, hi);
	return Utils.cloneMe(closest);
}

module.exports = Utils;
