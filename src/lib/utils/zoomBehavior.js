"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.mouseBasedZoomAnchor = mouseBasedZoomAnchor;
exports.lastVisibleItemBasedZoomAnchor = lastVisibleItemBasedZoomAnchor;
exports.rightDomainBasedZoomAnchor = rightDomainBasedZoomAnchor;

var _ChartDataUtil = require("./ChartDataUtil");

var _index = require("./index");

/* eslint-disable no-unused-vars */

function mouseBasedZoomAnchor(_ref) {
	var xScale = _ref.xScale,
	    xAccessor = _ref.xAccessor,
	    mouseXY = _ref.mouseXY,
	    plotData = _ref.plotData,
	    fullData = _ref.fullData;

	var currentItem = (0, _ChartDataUtil.getCurrentItem)(xScale, xAccessor, mouseXY, plotData);
	return xAccessor(currentItem);
}

function lastVisibleItemBasedZoomAnchor(_ref2) {
	var xScale = _ref2.xScale,
	    xAccessor = _ref2.xAccessor,
	    mouseXY = _ref2.mouseXY,
	    plotData = _ref2.plotData,
	    fullData = _ref2.fullData;

	var lastItem = (0, _index.last)(plotData);
	return xAccessor(lastItem);
}

function rightDomainBasedZoomAnchor(_ref3) {
	var xScale = _ref3.xScale,
	    xAccessor = _ref3.xAccessor,
	    mouseXY = _ref3.mouseXY,
	    plotData = _ref3.plotData,
	    fullData = _ref3.fullData;

	var _xScale$domain = xScale.domain(),
	    _xScale$domain2 = _slicedToArray(_xScale$domain, 2),
	    end = _xScale$domain2[1];

	return end;
}
/* eslint-enable no-unused-vars */
//# sourceMappingURL=zoomBehavior.js.map