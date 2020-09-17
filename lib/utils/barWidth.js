"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.plotDataLengthBarWidth = plotDataLengthBarWidth;
exports.timeIntervalBarWidth = timeIntervalBarWidth;

var _utils = require("../utils");

/**
 * Bar width is based on the amount of items in the plot data and the distance between the first and last of those
 * items.
 * @param props the props passed to the series.
 * @param moreProps an object holding the xScale, xAccessor and plotData.
 * @return {number} the bar width.
 */
function plotDataLengthBarWidth(props, moreProps) {
	var widthRatio = props.widthRatio;
	var xScale = moreProps.xScale;

	var _xScale$range = xScale.range(),
	    _xScale$range2 = _slicedToArray(_xScale$range, 2),
	    l = _xScale$range2[0],
	    r = _xScale$range2[1];

	var totalWidth = Math.abs(r - l);
	if (xScale.invert != null) {
		var _xScale$domain = xScale.domain(),
		    _xScale$domain2 = _slicedToArray(_xScale$domain, 2),
		    dl = _xScale$domain2[0],
		    dr = _xScale$domain2[1];

		var width = totalWidth / Math.abs(dl - dr);
		return width * widthRatio;
	} else {
		var _width = totalWidth / xScale.domain().length;
		return _width * widthRatio;
	}
}

/**
 * Generates a width function that calculates the bar width based on the given time interval.
 * @param interval a d3-time time interval.
 * @return {Function} the width function.
 */
function timeIntervalBarWidth(interval) {
	return function (props, moreProps) {
		var widthRatio = props.widthRatio;
		var xScale = moreProps.xScale,
		    xAccessor = moreProps.xAccessor,
		    plotData = moreProps.plotData;


		var first = xAccessor((0, _utils.head)(plotData));
		return Math.abs(xScale(interval.offset(first, 1)) - xScale(first)) * widthRatio;
	};
}
//# sourceMappingURL=barWidth.js.map