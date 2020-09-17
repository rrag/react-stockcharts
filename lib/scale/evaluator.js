"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (_ref2) {
	var xScale = _ref2.xScale,
	    useWholeData = _ref2.useWholeData,
	    clamp = _ref2.clamp,
	    pointsPerPxThreshold = _ref2.pointsPerPxThreshold,
	    minPointsPerPxThreshold = _ref2.minPointsPerPxThreshold,
	    flipXScale = _ref2.flipXScale;

	return extentsWrapper(useWholeData || (0, _utils.isNotDefined)(xScale.invert), clamp, pointsPerPxThreshold, minPointsPerPxThreshold, flipXScale);
};

var _utils = require("../utils");

var log = (0, _utils.getLogger)("evaluator");

function getNewEnd(fallbackEnd, xAccessor, initialXScale, start) {
	var lastItem = fallbackEnd.lastItem,
	    lastItemX = fallbackEnd.lastItemX;

	var lastItemXValue = xAccessor(lastItem);

	var _initialXScale$range = initialXScale.range(),
	    _initialXScale$range2 = _slicedToArray(_initialXScale$range, 2),
	    rangeStart = _initialXScale$range2[0],
	    rangeEnd = _initialXScale$range2[1];

	var newEnd = (rangeEnd - rangeStart) / (lastItemX - rangeStart) * (lastItemXValue - start) + start;
	return newEnd;
}

function extentsWrapper(useWholeData, clamp, pointsPerPxThreshold, minPointsPerPxThreshold, flipXScale) {
	function filterData(data, inputDomain, xAccessor, initialXScale) {
		var _ref = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
		    currentPlotData = _ref.currentPlotData,
		    currentDomain = _ref.currentDomain,
		    fallbackStart = _ref.fallbackStart,
		    fallbackEnd = _ref.fallbackEnd;

		if (useWholeData) {
			return { plotData: data, domain: inputDomain };
		}

		var left = (0, _utils.head)(inputDomain);
		var right = (0, _utils.last)(inputDomain);
		var clampedDomain = inputDomain;

		var filteredData = getFilteredResponse(data, left, right, xAccessor);

		if (filteredData.length === 1 && (0, _utils.isDefined)(fallbackStart)) {
			left = fallbackStart;
			right = getNewEnd(fallbackEnd, xAccessor, initialXScale, left);

			clampedDomain = [left, right];
			filteredData = getFilteredResponse(data, left, right, xAccessor);
		}

		if (typeof clamp === "function") {
			clampedDomain = clamp(clampedDomain, [xAccessor((0, _utils.head)(data)), xAccessor((0, _utils.last)(data))]);
		} else {
			if (clamp === "left" || clamp === "both" || clamp === true) {
				clampedDomain = [Math.max(left, xAccessor((0, _utils.head)(data))), clampedDomain[1]];
			}

			if (clamp === "right" || clamp === "both" || clamp === true) {
				clampedDomain = [clampedDomain[0], Math.min(right, xAccessor((0, _utils.last)(data)))];
			}
		}

		if (clampedDomain !== inputDomain) {
			filteredData = getFilteredResponse(data, clampedDomain[0], clampedDomain[1], xAccessor);
		}

		var realInputDomain = clampedDomain;
		// [xAccessor(head(filteredData)), xAccessor(last(filteredData))];

		var xScale = initialXScale.copy().domain(realInputDomain);

		var width = Math.floor(xScale(xAccessor((0, _utils.last)(filteredData))) - xScale(xAccessor((0, _utils.head)(filteredData))));

		// prevent negative width when flipXScale
		if (flipXScale && width < 0) {
			width = width * -1;
		}

		var plotData = void 0,
		    domain = void 0;

		var chartWidth = (0, _utils.last)(xScale.range()) - (0, _utils.head)(xScale.range());

		log("Trying to show " + filteredData.length + " points in " + width + "px," + (" I can show up to " + (showMaxThreshold(width, pointsPerPxThreshold) - 1) + " points in that width. ") + ("Also FYI the entire chart width is " + chartWidth + "px and pointsPerPxThreshold is " + pointsPerPxThreshold));

		if (canShowTheseManyPeriods(width, filteredData.length, pointsPerPxThreshold, minPointsPerPxThreshold)) {
			plotData = filteredData;
			domain = realInputDomain;
			log("AND IT WORKED");
		} else {
			if (chartWidth > showMaxThreshold(width, pointsPerPxThreshold) && (0, _utils.isDefined)(fallbackEnd)) {
				plotData = filteredData;
				var newEnd = getNewEnd(fallbackEnd, xAccessor, initialXScale, (0, _utils.head)(realInputDomain));
				domain = [(0, _utils.head)(realInputDomain), newEnd];
				// plotData = currentPlotData || filteredData.slice(filteredData.length - showMax(width, pointsPerPxThreshold));
				// domain = currentDomain || [xAccessor(head(plotData)), xAccessor(last(plotData))];

				var newXScale = xScale.copy().domain(domain);
				var newWidth = Math.floor(newXScale(xAccessor((0, _utils.last)(plotData))) - newXScale(xAccessor((0, _utils.head)(plotData))));

				log("and ouch, that is too much, so instead showing " + plotData.length + " in " + newWidth + "px");
			} else {
				plotData = currentPlotData || filteredData.slice(filteredData.length - showMax(width, pointsPerPxThreshold));
				domain = currentDomain || [xAccessor((0, _utils.head)(plotData)), xAccessor((0, _utils.last)(plotData))];

				var _newXScale = xScale.copy().domain(domain);
				var _newWidth = Math.floor(_newXScale(xAccessor((0, _utils.last)(plotData))) - _newXScale(xAccessor((0, _utils.head)(plotData))));

				log("and ouch, that is too much, so instead showing " + plotData.length + " in " + _newWidth + "px");
			}
		}
		return { plotData: plotData, domain: domain };
	}
	return { filterData: filterData };
}

function canShowTheseManyPeriods(width, arrayLength, maxThreshold, minThreshold) {
	return arrayLength > showMinThreshold(width, minThreshold) && arrayLength < showMaxThreshold(width, maxThreshold);
}

function showMinThreshold(width, threshold) {
	return Math.max(1, Math.ceil(width * threshold));
}

function showMaxThreshold(width, threshold) {
	return Math.floor(width * threshold);
}

function showMax(width, threshold) {
	return Math.floor(showMaxThreshold(width, threshold) * 0.97);
}

function getFilteredResponse(data, left, right, xAccessor) {
	var newLeftIndex = (0, _utils.getClosestItemIndexes)(data, left, xAccessor).right;
	var newRightIndex = (0, _utils.getClosestItemIndexes)(data, right, xAccessor).left;

	var filteredData = data.slice(newLeftIndex, newRightIndex + 1);
	// console.log(right, newRightIndex, dataForInterval.length);

	return filteredData;
}
//# sourceMappingURL=evaluator.js.map