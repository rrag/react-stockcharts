"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {

	var algorithm = _identity2.default,
	    skipUndefined = true,
	    merge = _noop2.default;

	function mergeCompute(data) {
		var zip = (0, _zipper2.default)().combine(function (datum, indicator) {
			var result = skipUndefined && (0, _index.isNotDefined)(indicator) ? datum : merge(datum, indicator);
			return (0, _index.isNotDefined)(result) ? datum : result;
		});

		// console.log(data);
		return zip(data, algorithm(data));
	}

	mergeCompute.algorithm = function (x) {
		if (!arguments.length) {
			return algorithm;
		}
		algorithm = x;
		return mergeCompute;
	};

	mergeCompute.merge = function (x) {
		if (!arguments.length) {
			return merge;
		}
		merge = x;
		return mergeCompute;
	};
	mergeCompute.skipUndefined = function (x) {
		if (!arguments.length) {
			return skipUndefined;
		}
		skipUndefined = x;
		return mergeCompute;
	};

	return mergeCompute;
};

var _identity = require("./identity");

var _identity2 = _interopRequireDefault(_identity);

var _zipper = require("./zipper");

var _zipper2 = _interopRequireDefault(_zipper);

var _noop = require("./noop");

var _noop2 = _interopRequireDefault(_noop);

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=merge.js.map