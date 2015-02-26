'use strict';

var Utils = {
	mousePosition(e) {
		var container = e.currentTarget,
			rect = container.getBoundingClientRect(),
			xy = [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
		return xy;
	},
	getClosestValue(array, xValue, xAccessor) {
		//getClosestValue = function(array, xIndex) {
		var lo = 0, hi = array.length - 1;
		while (hi - lo > 1) {
			var mid = Math.round((lo + hi)/2);
			if (array[mid].index <= xIndex) {
				lo = mid;
			} else {
				hi = mid;
			}
		}
		if (array[lo].index == xIndex) hi = lo;
		var closest = (Math.abs(array[lo].index - xIndex) < Math.abs(array[hi].index - xIndex))
							? array[lo]
							: array[hi];
		return closest;
	}
}
module.exports = Utils;
