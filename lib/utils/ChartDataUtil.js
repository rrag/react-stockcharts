"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getChartOrigin = getChartOrigin;
exports.getDimensions = getDimensions;
exports.getNewChartConfig = getNewChartConfig;
exports.getCurrentCharts = getCurrentCharts;
exports.getChartConfigWithUpdatedYScales = getChartConfigWithUpdatedYScales;
exports.getCurrentItem = getCurrentItem;
exports.getXValue = getXValue;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Array = require("d3-array");

var _d3Collection = require("d3-collection");

var _lodash = require("lodash.flattendeep");

var _lodash2 = _interopRequireDefault(_lodash);

var _Chart = require("../Chart");

var _Chart2 = _interopRequireDefault(_Chart);

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getChartOrigin(origin, contextWidth, contextHeight) {
	var originCoordinates = typeof origin === "function" ? origin(contextWidth, contextHeight) : origin;
	return originCoordinates;
}

function getDimensions(_ref, chartProps) {
	var width = _ref.width,
	    height = _ref.height;


	var chartHeight = chartProps.height || height;

	return {
		availableHeight: height,
		width: width,
		height: chartHeight
	};
}

function values(func) {
	return function (d) {
		var obj = func(d);
		if ((0, _index.isObject)(obj)) {
			return (0, _index.mapObject)(obj);
		}
		return obj;
	};
}

function isArraySize2AndNumber(yExtentsProp) {
	if (Array.isArray(yExtentsProp) && yExtentsProp.length === 2) {
		var _yExtentsProp = _slicedToArray(yExtentsProp, 2),
		    a = _yExtentsProp[0],
		    b = _yExtentsProp[1];

		return typeof a == "number" && typeof b == "number";
	}
	return false;
}

function getNewChartConfig(innerDimension, children) {
	var existingChartConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	return _react2.default.Children.map(children, function (each) {
		if (each && each.type.toString() === _Chart2.default.toString()) {
			var chartProps = _extends({}, _Chart2.default.defaultProps, each.props);
			var id = chartProps.id,
			    origin = chartProps.origin,
			    padding = chartProps.padding,
			    yExtentsProp = chartProps.yExtents,
			    yScaleProp = chartProps.yScale,
			    flipYScale = chartProps.flipYScale,
			    yExtentsCalculator = chartProps.yExtentsCalculator;


			var yScale = yScaleProp.copy();

			var _getDimensions = getDimensions(innerDimension, chartProps),
			    width = _getDimensions.width,
			    height = _getDimensions.height,
			    availableHeight = _getDimensions.availableHeight;

			var yPan = chartProps.yPan;
			var yPanEnabled = chartProps.yPanEnabled;
			// var { yMousePointerRectWidth: rectWidth, yMousePointerRectHeight: rectHeight, yMousePointerArrowWidth: arrowWidth } = each.props;
			// var mouseCoordinates = { at, yDisplayFormat, rectHeight, rectWidth, arrowWidth };

			var yExtents = (0, _index.isDefined)(yExtentsProp) ? (Array.isArray(yExtentsProp) ? yExtentsProp : [yExtentsProp]).map(_index.functor) : undefined;

			var prevChartConfig = (0, _index.find)(existingChartConfig, function (d) {
				return d.id === id;
			});

			if (isArraySize2AndNumber(yExtentsProp)) {
				if ((0, _index.isDefined)(prevChartConfig) && prevChartConfig.yPan && prevChartConfig.yPanEnabled && yPan && yPanEnabled && (0, _index.shallowEqual)(prevChartConfig.originalYExtentsProp, yExtentsProp)) {
					// console.log(prevChartConfig.originalYExtentsProp, yExtentsProp)
					// console.log(prevChartConfig.yScale.domain())
					yScale.domain(prevChartConfig.yScale.domain());
				} else {
					var _yExtentsProp2 = _slicedToArray(yExtentsProp, 2),
					    a = _yExtentsProp2[0],
					    b = _yExtentsProp2[1];

					yScale.domain([a, b]);
				}
			} else if ((0, _index.isDefined)(prevChartConfig) && prevChartConfig.yPanEnabled) {
				if (isArraySize2AndNumber(prevChartConfig.originalYExtentsProp)) {
					// do nothing
				} else {
					yScale.domain(prevChartConfig.yScale.domain());
					yPanEnabled = true;
				}
			}

			return {
				id: id,
				origin: (0, _index.functor)(origin)(width, availableHeight),
				padding: padding,
				originalYExtentsProp: yExtentsProp,
				yExtents: yExtents,
				yExtentsCalculator: yExtentsCalculator,
				flipYScale: flipYScale,
				// yScale: setRange(yScale.copy(), height, padding, flipYScale),
				yScale: yScale,
				yPan: yPan,
				yPanEnabled: yPanEnabled,
				// mouseCoordinates,
				width: width,
				height: height
			};
		}
		return undefined;
	}).filter(function (each) {
		return (0, _index.isDefined)(each);
	});
}
function getCurrentCharts(chartConfig, mouseXY) {
	var currentCharts = chartConfig.filter(function (eachConfig) {
		var top = eachConfig.origin[1];
		var bottom = top + eachConfig.height;
		return mouseXY[1] > top && mouseXY[1] < bottom;
	}).map(function (config) {
		return config.id;
	});

	return currentCharts;
}

function setRange(scale, height, padding, flipYScale) {
	if (scale.rangeRoundPoints || (0, _index.isNotDefined)(scale.invert)) {
		if (isNaN(padding)) throw new Error("padding has to be a number for ordinal scale");
		if (scale.rangeRoundPoints) scale.rangeRoundPoints(flipYScale ? [0, height] : [height, 0], padding);
		if (scale.rangeRound) scale.range(flipYScale ? [0, height] : [height, 0]).padding(padding);
	} else {
		var _ref2 = isNaN(padding) ? padding : { top: padding, bottom: padding },
		    top = _ref2.top,
		    bottom = _ref2.bottom;

		scale.range(flipYScale ? [top, height - bottom] : [height - bottom, top]);
	}
	return scale;
}

function yDomainFromYExtents(yExtents, yScale, plotData) {
	var yValues = yExtents.map(function (eachExtent) {
		return plotData.map(values(eachExtent));
	});

	var allYValues = (0, _lodash2.default)(yValues);
	// console.log(allYValues)
	var realYDomain = yScale.invert ? (0, _d3Array.extent)(allYValues) : (0, _d3Collection.set)(allYValues).values();

	return realYDomain;
}

function getChartConfigWithUpdatedYScales(chartConfig, _ref3, xDomain, dy, chartsToPan) {
	var plotData = _ref3.plotData,
	    xAccessor = _ref3.xAccessor,
	    displayXAccessor = _ref3.displayXAccessor,
	    fullData = _ref3.fullData;

	var yDomains = chartConfig.map(function (_ref4) {
		var yExtentsCalculator = _ref4.yExtentsCalculator,
		    yExtents = _ref4.yExtents,
		    yScale = _ref4.yScale;


		var realYDomain = (0, _index.isDefined)(yExtentsCalculator) ? yExtentsCalculator({ plotData: plotData, xDomain: xDomain, xAccessor: xAccessor, displayXAccessor: displayXAccessor, fullData: fullData }) : yDomainFromYExtents(yExtents, yScale, plotData);

		// console.log("yScale.domain() ->", yScale.domain())

		var yDomainDY = (0, _index.isDefined)(dy) ? yScale.range().map(function (each) {
			return each - dy;
		}).map(yScale.invert) : yScale.domain();
		return {
			realYDomain: realYDomain,
			yDomainDY: yDomainDY,
			prevYDomain: yScale.domain()
		};
	});

	var combine = (0, _index.zipper)().combine(function (config, _ref5) {
		var realYDomain = _ref5.realYDomain,
		    yDomainDY = _ref5.yDomainDY,
		    prevYDomain = _ref5.prevYDomain;
		var id = config.id,
		    padding = config.padding,
		    height = config.height,
		    yScale = config.yScale,
		    yPan = config.yPan,
		    flipYScale = config.flipYScale,
		    _config$yPanEnabled = config.yPanEnabled,
		    yPanEnabled = _config$yPanEnabled === undefined ? false : _config$yPanEnabled;


		var another = (0, _index.isDefined)(chartsToPan) ? chartsToPan.indexOf(id) > -1 : true;
		var domain = yPan && yPanEnabled ? another ? yDomainDY : prevYDomain : realYDomain;

		// console.log(id, yPan, yPanEnabled, another);
		// console.log(domain, realYDomain, prevYDomain);
		var newYScale = setRange(yScale.copy().domain(domain), height, padding, flipYScale);
		return _extends({}, config, {
			yScale: newYScale,
			realYDomain: realYDomain
		});
		// return { ...config, yScale: yScale.copy().domain(domain).range([height - padding, padding]) };
	});

	var updatedChartConfig = combine(chartConfig, yDomains);
	// console.error(yDomains, dy, chartsToPan, updatedChartConfig.map(d => d.yScale.domain()));
	// console.log(updatedChartConfig.map(d => ({ id: d.id, domain: d.yScale.domain() })))

	return updatedChartConfig;
}

function getCurrentItem(xScale, xAccessor, mouseXY, plotData) {
	var xValue = void 0,
	    item = void 0;
	if (xScale.invert) {
		xValue = xScale.invert(mouseXY[0]);
		item = (0, _index.getClosestItem)(plotData, xValue, xAccessor);
	} else {
		var d = xScale.range().map(function (d, idx) {
			return { x: Math.abs(d - mouseXY[0]), idx: idx };
		}).reduce(function (a, b) {
			return a.x < b.x ? a : b;
		});
		item = (0, _index.isDefined)(d) ? plotData[d.idx] : plotData[0];
		// console.log(d, item);
	}
	return item;
}

function getXValue(xScale, xAccessor, mouseXY, plotData) {

	var xValue = void 0,
	    item = void 0;
	if (xScale.invert) {
		xValue = xScale.invert(mouseXY[0]);
		if (xValue > xAccessor((0, _index.last)(plotData)) && xScale.value) {
			return Math.round(xValue);
		} else {
			item = (0, _index.getClosestItem)(plotData, xValue, xAccessor);
		}
	} else {
		var d = xScale.range().map(function (d, idx) {
			return { x: Math.abs(d - mouseXY[0]), idx: idx };
		}).reduce(function (a, b) {
			return a.x < b.x ? a : b;
		});
		item = (0, _index.isDefined)(d) ? plotData[d.idx] : plotData[0];
		// console.log(d, item);
	}
	return xAccessor(item);
}
//# sourceMappingURL=ChartDataUtil.js.map