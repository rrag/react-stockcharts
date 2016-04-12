"use strict";

/* an extension to d3.zip so we call a function instead of an array */

import d3 from "d3";

import identity from "./identity";

export default function zipper() {
	var combine = identity;

	function zip() {
		var n = arguments.length;
		if (!n) return [];
		var i, m = d3.min(arguments, d3_zipLength), zips = new Array(m);
		for (i = -1; ++i < m; ) {
			for (var j = -1, zip = zips[i] = new Array(n); ++j < n; ) {
				zip[j] = arguments[j][i];
			}
			zips[i] = combine.apply(this, zips[i]);
		}
		return zips;
	}
	function d3_zipLength(d) {
		return d.length;
	}
	zip.combine = function(x) {
		if (!arguments.length) {
			return combine;
		}
		combine = x;
		return zip;
	};
	return zip;
}
