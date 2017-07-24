"use strict";

/* an extension to d3.zip so we call a function instead of an array */

import { min } from "d3-array";

import identity from "./identity";

export default function zipper() {
	let combine = identity;

	function zip() {
		const n = arguments.length;
		if (!n) return [];
		const m = min(arguments, d3_zipLength);

		// eslint-disable-next-line prefer-const
		let i, zips = new Array(m);
		for (i = -1; ++i < m; ) {
			for (let j = -1, zip = zips[i] = new Array(n); ++j < n; ) {
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
