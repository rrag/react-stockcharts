"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {

	var id = i++,
	    accessor = void 0,
	    stroke = void 0,
	    fill = void 0,
	    echo = void 0,
	    type = void 0;

	function baseIndicator() {}

	baseIndicator.id = function (x) {
		if (!arguments.length) return id;
		id = x;
		return baseIndicator;
	};
	baseIndicator.accessor = function (x) {
		if (!arguments.length) return accessor;
		accessor = x;
		return baseIndicator;
	};
	baseIndicator.stroke = function (x) {
		if (!arguments.length) return !stroke ? stroke = (0, _utils.overlayColors)(id) : stroke;
		stroke = x;
		return baseIndicator;
	};
	baseIndicator.fill = function (x) {
		if (!arguments.length) return !fill ? fill = (0, _utils.overlayColors)(id) : fill;
		fill = x;
		return baseIndicator;
	};
	baseIndicator.echo = function (x) {
		if (!arguments.length) return echo;
		echo = x;
		return baseIndicator;
	};
	baseIndicator.type = function (x) {
		if (!arguments.length) return type;
		type = x;
		return baseIndicator;
	};
	return baseIndicator;
};

var _utils = require("../utils");

var i = 0;
//# sourceMappingURL=baseIndicator.js.map