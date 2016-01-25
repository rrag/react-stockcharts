"use strict";

/* an extension to d3.zip so we call a function instead of an array */

import d3 from "d3";

import identity from "./identity";

export default function zipper() {
	var combine = identity

	function zip() {
		if (!(n = arguments.length)) return [];
		for (var i = -1, m = d3.min(arguments, d3_zipLength), zips = new Array(m); ++i < m; ) {
			for (var j = -1, n, zip = zips[i] = new Array(n); ++j < n; ) {
				zip[j] = arguments[j][i];
			}
			zips[i] = combine.apply(this, zips[i]);
		}
		return zips;
	};
	function d3_zipLength(d) {
		return d.length;
	}
	zip.combine = function(x) {
		if (!arguments.length) {
			return combine;
		}
		combine = x;
		return zip;
	}
	return zip;
};
