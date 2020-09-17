"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = zipper;

var _d3Array = require("d3-array");

var _identity = require("./identity");

var _identity2 = _interopRequireDefault(_identity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* an extension to d3.zip so we call a function instead of an array */

function zipper() {
	var combine = _identity2.default;

	function zip() {
		var n = arguments.length;
		if (!n) return [];
		var m = (0, _d3Array.min)(arguments, d3_zipLength);

		// eslint-disable-next-line prefer-const
		var i = void 0,
		    zips = new Array(m);
		for (i = -1; ++i < m;) {
			for (var j = -1, _zip = zips[i] = new Array(n); ++j < n;) {
				_zip[j] = arguments[j][i];
			}
			zips[i] = combine.apply(this, zips[i]);
		}
		return zips;
	}
	function d3_zipLength(d) {
		return d.length;
	}
	zip.combine = function (x) {
		if (!arguments.length) {
			return combine;
		}
		combine = x;
		return zip;
	};
	return zip;
}
//# sourceMappingURL=zipper.js.map