"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* eslint-disable no-unused-vars */

/* eslint-enable no-unused-vars */

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Array = require("d3-array");

var _utils = require("./utils");

var _zoomBehavior = require("./utils/zoomBehavior");

var _ChartDataUtil = require("./utils/ChartDataUtil");

var _EventCapture = require("./EventCapture");

var _EventCapture2 = _interopRequireDefault(_EventCapture);

var _CanvasContainer = require("./CanvasContainer");

var _CanvasContainer2 = _interopRequireDefault(_CanvasContainer);

var _evaluator2 = require("./scale/evaluator");

var _evaluator3 = _interopRequireDefault(_evaluator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var log = (0, _utils.getLogger)("ChartCanvas");

var CANDIDATES_FOR_RESET = ["seriesName"];

function shouldResetChart(thisProps, nextProps) {
	return !CANDIDATES_FOR_RESET.every(function (key) {
		var result = (0, _utils.shallowEqual)(thisProps[key], nextProps[key]);
		// console.log(key, result);
		return result;
	});
}

function getCursorStyle() {
	var tooltipStyle = "\n\t.react-stockcharts-grabbing-cursor {\n\t\tpointer-events: all;\n\t\tcursor: -moz-grabbing;\n\t\tcursor: -webkit-grabbing;\n\t\tcursor: grabbing;\n\t}\n\t.react-stockcharts-crosshair-cursor {\n\t\tpointer-events: all;\n\t\tcursor: crosshair;\n\t}\n\t.react-stockcharts-tooltip-hover {\n\t\tpointer-events: all;\n\t\tcursor: pointer;\n\t}\n\t.react-stockcharts-avoid-interaction {\n\t\tpointer-events: none;\n\t}\n\t.react-stockcharts-enable-interaction {\n\t\tpointer-events: all;\n\t}\n\t.react-stockcharts-tooltip {\n\t\tpointer-events: all;\n\t\tcursor: pointer;\n\t}\n\t.react-stockcharts-default-cursor {\n\t\tcursor: default;\n\t}\n\t.react-stockcharts-move-cursor {\n\t\tcursor: move;\n\t}\n\t.react-stockcharts-pointer-cursor {\n\t\tcursor: pointer;\n\t}\n\t.react-stockcharts-ns-resize-cursor {\n\t\tcursor: ns-resize;\n\t}\n\t.react-stockcharts-ew-resize-cursor {\n\t\tcursor: ew-resize;\n\t}";
	return _react2.default.createElement(
		"style",
		{ type: "text/css" },
		tooltipStyle
	);
}

function getDimensions(props) {
	return {
		height: props.height - props.margin.top - props.margin.bottom,
		width: props.width - props.margin.left - props.margin.right
	};
}

function getXScaleDirection(flipXScale) {
	return flipXScale ? -1 : 1;
}

function calculateFullData(props) {
	var fullData = props.data,
	    plotFull = props.plotFull,
	    xScale = props.xScale,
	    clamp = props.clamp,
	    pointsPerPxThreshold = props.pointsPerPxThreshold,
	    flipXScale = props.flipXScale;
	var xAccessor = props.xAccessor,
	    displayXAccessor = props.displayXAccessor,
	    minPointsPerPxThreshold = props.minPointsPerPxThreshold;


	var useWholeData = (0, _utils.isDefined)(plotFull) ? plotFull : xAccessor === _utils.identity;

	var _evaluator = (0, _evaluator3.default)({
		xScale: xScale,
		useWholeData: useWholeData,
		clamp: clamp,
		pointsPerPxThreshold: pointsPerPxThreshold,
		minPointsPerPxThreshold: minPointsPerPxThreshold,
		flipXScale: flipXScale
	}),
	    filterData = _evaluator.filterData;

	return {
		xAccessor: xAccessor,
		displayXAccessor: displayXAccessor || xAccessor,
		xScale: xScale.copy(),
		fullData: fullData,
		filterData: filterData
	};
}
function resetChart(props) {
	var firstCalculation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	if (process.env.NODE_ENV !== "production") {
		if (!firstCalculation) log("CHART RESET");
	}

	var state = calculateState(props);
	var xAccessor = state.xAccessor,
	    displayXAccessor = state.displayXAccessor,
	    fullData = state.fullData;
	var initialPlotData = state.plotData,
	    xScale = state.xScale;
	var postCalculator = props.postCalculator,
	    children = props.children;


	var plotData = postCalculator(initialPlotData);

	var dimensions = getDimensions(props);
	var chartConfig = (0, _ChartDataUtil.getChartConfigWithUpdatedYScales)((0, _ChartDataUtil.getNewChartConfig)(dimensions, children), { plotData: plotData, xAccessor: xAccessor, displayXAccessor: displayXAccessor, fullData: fullData }, xScale.domain());

	return _extends({}, state, {
		xScale: xScale,
		plotData: plotData,
		chartConfig: chartConfig
	});
}

function updateChart(newState, initialXScale, props, lastItemWasVisible, initialChartConfig) {
	var fullData = newState.fullData,
	    xScale = newState.xScale,
	    xAccessor = newState.xAccessor,
	    displayXAccessor = newState.displayXAccessor,
	    filterData = newState.filterData;


	var lastItem = (0, _utils.last)(fullData);

	var _initialXScale$domain = initialXScale.domain(),
	    _initialXScale$domain2 = _slicedToArray(_initialXScale$domain, 2),
	    start = _initialXScale$domain2[0],
	    end = _initialXScale$domain2[1];

	if (process.env.NODE_ENV !== "production") {
		log("TRIVIAL CHANGE");
	}

	var postCalculator = props.postCalculator,
	    children = props.children,
	    padding = props.padding,
	    flipXScale = props.flipXScale;
	var maintainPointsPerPixelOnResize = props.maintainPointsPerPixelOnResize;

	var direction = getXScaleDirection(flipXScale);
	var dimensions = getDimensions(props);

	var updatedXScale = setXRange(xScale, dimensions, padding, direction);

	// console.log("lastItemWasVisible =", lastItemWasVisible, end, xAccessor(lastItem), end >= xAccessor(lastItem));
	var initialPlotData = void 0;
	if (!lastItemWasVisible || end >= xAccessor(lastItem)) {
		// resize comes here...
		var _initialXScale$range = initialXScale.range(),
		    _initialXScale$range2 = _slicedToArray(_initialXScale$range, 2),
		    rangeStart = _initialXScale$range2[0],
		    rangeEnd = _initialXScale$range2[1];

		var _updatedXScale$range = updatedXScale.range(),
		    _updatedXScale$range2 = _slicedToArray(_updatedXScale$range, 2),
		    newRangeStart = _updatedXScale$range2[0],
		    newRangeEnd = _updatedXScale$range2[1];

		var newDomainExtent = (newRangeEnd - newRangeStart) / (rangeEnd - rangeStart) * (end - start);
		var newStart = maintainPointsPerPixelOnResize ? end - newDomainExtent : start;

		var lastItemX = initialXScale(xAccessor(lastItem));
		// console.log("pointsPerPixel => ", newStart, start, end, updatedXScale(end));
		var response = filterData(fullData, [newStart, end], xAccessor, updatedXScale, { fallbackStart: start, fallbackEnd: { lastItem: lastItem, lastItemX: lastItemX } });
		initialPlotData = response.plotData;
		updatedXScale.domain(response.domain);
		// console.log("HERE!!!!!", start, end);
	} else if (lastItemWasVisible && end < xAccessor(lastItem)) {
		// this is when a new item is added and last item was visible
		// so slide over and show the new item also

		// get plotData between [xAccessor(l) - (end - start), xAccessor(l)] and DO change the domain
		var dx = initialXScale(xAccessor(lastItem)) - initialXScale.range()[1];

		var _initialXScale$range$ = initialXScale.range().map(function (x) {
			return x + dx;
		}).map(initialXScale.invert),
		    _initialXScale$range$2 = _slicedToArray(_initialXScale$range$, 2),
		    _newStart = _initialXScale$range$2[0],
		    newEnd = _initialXScale$range$2[1];

		var _response = filterData(fullData, [_newStart, newEnd], xAccessor, updatedXScale);
		initialPlotData = _response.plotData;
		updatedXScale.domain(_response.domain); // if last item was visible, then shift
	}
	// plotData = getDataOfLength(fullData, showingInterval, plotData.length)
	var plotData = postCalculator(initialPlotData);
	var chartConfig = (0, _ChartDataUtil.getChartConfigWithUpdatedYScales)((0, _ChartDataUtil.getNewChartConfig)(dimensions, children, initialChartConfig), { plotData: plotData, xAccessor: xAccessor, displayXAccessor: displayXAccessor, fullData: fullData }, updatedXScale.domain());

	return {
		xScale: updatedXScale,
		xAccessor: xAccessor,
		chartConfig: chartConfig,
		plotData: plotData,
		fullData: fullData,
		filterData: filterData
	};
}

function calculateState(props) {
	var inputXAccesor = props.xAccessor,
	    xExtentsProp = props.xExtents,
	    data = props.data,
	    padding = props.padding,
	    flipXScale = props.flipXScale;


	if (process.env.NODE_ENV !== "production" && (0, _utils.isDefined)(props.xScale.invert)) {
		for (var i = 1; i < data.length; i++) {
			var prev = data[i - 1];
			var curr = data[i];
			if (inputXAccesor(prev) > inputXAccesor(curr)) {
				throw new Error("'data' is not sorted on 'xAccessor', send 'data' sorted in ascending order of 'xAccessor'");
			}
		}
	}

	var direction = getXScaleDirection(flipXScale);
	var dimensions = getDimensions(props);

	var extent = typeof xExtentsProp === "function" ? xExtentsProp(data) : (0, _d3Array.extent)(xExtentsProp.map(function (d) {
		return (0, _utils.functor)(d);
	}).map(function (each) {
		return each(data, inputXAccesor);
	}));

	var _calculateFullData = calculateFullData(props),
	    xAccessor = _calculateFullData.xAccessor,
	    displayXAccessor = _calculateFullData.displayXAccessor,
	    xScale = _calculateFullData.xScale,
	    fullData = _calculateFullData.fullData,
	    filterData = _calculateFullData.filterData;

	var updatedXScale = setXRange(xScale, dimensions, padding, direction);

	var _filterData = filterData(fullData, extent, inputXAccesor, updatedXScale),
	    plotData = _filterData.plotData,
	    domain = _filterData.domain;

	if (process.env.NODE_ENV !== "production" && plotData.length <= 1) {
		throw new Error("Showing " + plotData.length + " datapoints, review the 'xExtents' prop of ChartCanvas");
	}
	return {
		plotData: plotData,
		xScale: updatedXScale.domain(domain),
		xAccessor: xAccessor,
		displayXAccessor: displayXAccessor,
		fullData: fullData,
		filterData: filterData
	};
}

function setXRange(xScale, dimensions, padding) {
	var direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

	if (xScale.rangeRoundPoints) {
		if (isNaN(padding)) throw new Error("padding has to be a number for ordinal scale");
		xScale.rangeRoundPoints([0, dimensions.width], padding);
	} else if (xScale.padding) {
		if (isNaN(padding)) throw new Error("padding has to be a number for ordinal scale");
		xScale.range([0, dimensions.width]);
		xScale.padding(padding / 2);
	} else {
		var _ref = isNaN(padding) ? padding : { left: padding, right: padding },
		    left = _ref.left,
		    right = _ref.right;

		if (direction > 0) {
			xScale.range([left, dimensions.width - right]);
		} else {
			xScale.range([dimensions.width - right, left]);
		}
	}
	return xScale;
}

function pinchCoordinates(pinch) {
	var touch1Pos = pinch.touch1Pos,
	    touch2Pos = pinch.touch2Pos;


	return {
		topLeft: [Math.min(touch1Pos[0], touch2Pos[0]), Math.min(touch1Pos[1], touch2Pos[1])],
		bottomRight: [Math.max(touch1Pos[0], touch2Pos[0]), Math.max(touch1Pos[1], touch2Pos[1])]
	};
}

var ChartCanvas = function (_Component) {
	_inherits(ChartCanvas, _Component);

	function ChartCanvas() {
		_classCallCheck(this, ChartCanvas);

		var _this = _possibleConstructorReturn(this, (ChartCanvas.__proto__ || Object.getPrototypeOf(ChartCanvas)).call(this));

		_this.getDataInfo = _this.getDataInfo.bind(_this);
		_this.getCanvasContexts = _this.getCanvasContexts.bind(_this);

		_this.handleMouseMove = _this.handleMouseMove.bind(_this);
		_this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
		_this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
		_this.handleZoom = _this.handleZoom.bind(_this);
		_this.handlePinchZoom = _this.handlePinchZoom.bind(_this);
		_this.handlePinchZoomEnd = _this.handlePinchZoomEnd.bind(_this);
		_this.handlePan = _this.handlePan.bind(_this);
		_this.handlePanEnd = _this.handlePanEnd.bind(_this);
		_this.handleClick = _this.handleClick.bind(_this);
		_this.handleMouseDown = _this.handleMouseDown.bind(_this);
		_this.handleDoubleClick = _this.handleDoubleClick.bind(_this);
		_this.handleContextMenu = _this.handleContextMenu.bind(_this);
		_this.handleDragStart = _this.handleDragStart.bind(_this);
		_this.handleDrag = _this.handleDrag.bind(_this);
		_this.handleDragEnd = _this.handleDragEnd.bind(_this);

		_this.panHelper = _this.panHelper.bind(_this);
		_this.pinchZoomHelper = _this.pinchZoomHelper.bind(_this);
		_this.xAxisZoom = _this.xAxisZoom.bind(_this);
		_this.yAxisZoom = _this.yAxisZoom.bind(_this);
		_this.resetYDomain = _this.resetYDomain.bind(_this);
		_this.calculateStateForDomain = _this.calculateStateForDomain.bind(_this);
		_this.generateSubscriptionId = _this.generateSubscriptionId.bind(_this);
		_this.draw = _this.draw.bind(_this);
		_this.redraw = _this.redraw.bind(_this);
		_this.getAllPanConditions = _this.getAllPanConditions.bind(_this);

		_this.subscriptions = [];
		_this.subscribe = _this.subscribe.bind(_this);
		_this.unsubscribe = _this.unsubscribe.bind(_this);
		_this.amIOnTop = _this.amIOnTop.bind(_this);
		_this.saveEventCaptureNode = _this.saveEventCaptureNode.bind(_this);
		_this.saveCanvasContainerNode = _this.saveCanvasContainerNode.bind(_this);
		_this.setCursorClass = _this.setCursorClass.bind(_this);
		_this.getMutableState = _this.getMutableState.bind(_this);
		// this.canvasDrawCallbackList = [];
		_this.interactiveState = [];
		_this.panInProgress = false;

		_this.state = {};
		_this.mutableState = {};
		_this.lastSubscriptionId = 0;
		return _this;
	}

	_createClass(ChartCanvas, [{
		key: "saveEventCaptureNode",
		value: function saveEventCaptureNode(node) {
			this.eventCaptureNode = node;
		}
	}, {
		key: "saveCanvasContainerNode",
		value: function saveCanvasContainerNode(node) {
			this.canvasContainerNode = node;
		}
	}, {
		key: "getMutableState",
		value: function getMutableState() {
			return this.mutableState;
		}
	}, {
		key: "getDataInfo",
		value: function getDataInfo() {
			return _extends({}, this.state, {
				fullData: this.fullData
			});
		}
	}, {
		key: "getCanvasContexts",
		value: function getCanvasContexts() {
			if (this.canvasContainerNode) {
				return this.canvasContainerNode.getCanvasContexts();
			}
		}
	}, {
		key: "generateSubscriptionId",
		value: function generateSubscriptionId() {
			this.lastSubscriptionId++;
			return this.lastSubscriptionId;
		}
	}, {
		key: "clearBothCanvas",
		value: function clearBothCanvas() {
			var canvases = this.getCanvasContexts();
			if (canvases && canvases.axes) {
				(0, _utils.clearCanvas)([canvases.axes,
				// canvases.hover,
				canvases.mouseCoord], this.props.ratio);
			}
		}
	}, {
		key: "clearMouseCanvas",
		value: function clearMouseCanvas() {
			var canvases = this.getCanvasContexts();
			if (canvases && canvases.mouseCoord) {
				(0, _utils.clearCanvas)([canvases.mouseCoord], this.props.ratio);
			}
		}
	}, {
		key: "clearThreeCanvas",
		value: function clearThreeCanvas() {
			var canvases = this.getCanvasContexts();
			if (canvases && canvases.axes) {
				(0, _utils.clearCanvas)([canvases.axes,
				// canvases.hover,
				canvases.mouseCoord, canvases.bg], this.props.ratio);
			}
		}
	}, {
		key: "subscribe",
		value: function subscribe(id, rest) {
			var _rest$getPanCondition = rest.getPanConditions,
			    getPanConditions = _rest$getPanCondition === undefined ? (0, _utils.functor)({
				draggable: false,
				panEnabled: true
			}) : _rest$getPanCondition;

			this.subscriptions = this.subscriptions.concat(_extends({
				id: id
			}, rest, {
				getPanConditions: getPanConditions
			}));
		}
	}, {
		key: "unsubscribe",
		value: function unsubscribe(id) {
			this.subscriptions = this.subscriptions.filter(function (each) {
				return each.id !== id;
			});
		}
	}, {
		key: "getAllPanConditions",
		value: function getAllPanConditions() {
			return this.subscriptions.map(function (each) {
				return each.getPanConditions();
			});
		}
	}, {
		key: "setCursorClass",
		value: function setCursorClass(className) {
			if (this.eventCaptureNode != null) {
				this.eventCaptureNode.setCursorClass(className);
			}
		}
	}, {
		key: "amIOnTop",
		value: function amIOnTop(id) {
			var dragableComponents = this.subscriptions.filter(function (each) {
				return each.getPanConditions().draggable;
			});

			return dragableComponents.length > 0 && (0, _utils.last)(dragableComponents).id === id;
		}
	}, {
		key: "handleContextMenu",
		value: function handleContextMenu(mouseXY, e) {
			var _state = this.state,
			    xAccessor = _state.xAccessor,
			    chartConfig = _state.chartConfig,
			    plotData = _state.plotData,
			    xScale = _state.xScale;


			var currentCharts = (0, _ChartDataUtil.getCurrentCharts)(chartConfig, mouseXY);
			var currentItem = (0, _ChartDataUtil.getCurrentItem)(xScale, xAccessor, mouseXY, plotData);

			this.triggerEvent("contextmenu", {
				mouseXY: mouseXY,
				currentItem: currentItem,
				currentCharts: currentCharts
			}, e);
		}
	}, {
		key: "calculateStateForDomain",
		value: function calculateStateForDomain(newDomain) {
			var _state2 = this.state,
			    xAccessor = _state2.xAccessor,
			    displayXAccessor = _state2.displayXAccessor,
			    initialXScale = _state2.xScale,
			    initialChartConfig = _state2.chartConfig,
			    initialPlotData = _state2.plotData;
			var filterData = this.state.filterData;
			var fullData = this.fullData;
			var postCalculator = this.props.postCalculator;

			var _filterData2 = filterData(fullData, newDomain, xAccessor, initialXScale, {
				currentPlotData: initialPlotData,
				currentDomain: initialXScale.domain()
			}),
			    beforePlotData = _filterData2.plotData,
			    domain = _filterData2.domain;

			var plotData = postCalculator(beforePlotData);
			var updatedScale = initialXScale.copy().domain(domain);
			var chartConfig = (0, _ChartDataUtil.getChartConfigWithUpdatedYScales)(initialChartConfig, { plotData: plotData, xAccessor: xAccessor, displayXAccessor: displayXAccessor, fullData: fullData }, updatedScale.domain());

			return {
				xScale: updatedScale,
				plotData: plotData,
				chartConfig: chartConfig
			};
		}
	}, {
		key: "pinchZoomHelper",
		value: function pinchZoomHelper(initialPinch, finalPinch) {
			var initialPinchXScale = initialPinch.xScale;
			var _state3 = this.state,
			    initialXScale = _state3.xScale,
			    initialChartConfig = _state3.chartConfig,
			    initialPlotData = _state3.plotData,
			    xAccessor = _state3.xAccessor,
			    displayXAccessor = _state3.displayXAccessor;
			var filterData = this.state.filterData;
			var fullData = this.fullData;
			var postCalculator = this.props.postCalculator;

			var _pinchCoordinates = pinchCoordinates(initialPinch),
			    iTL = _pinchCoordinates.topLeft,
			    iBR = _pinchCoordinates.bottomRight;

			var _pinchCoordinates2 = pinchCoordinates(finalPinch),
			    fTL = _pinchCoordinates2.topLeft,
			    fBR = _pinchCoordinates2.bottomRight;

			var e = initialPinchXScale.range()[1];

			var xDash = Math.round(-(iBR[0] * fTL[0] - iTL[0] * fBR[0]) / (iTL[0] - iBR[0]));
			var yDash = Math.round(e + ((e - iBR[0]) * (e - fTL[0]) - (e - iTL[0]) * (e - fBR[0])) / (e - iTL[0] - (e - iBR[0])));

			var x = Math.round(-xDash * iTL[0] / (-xDash + fTL[0]));
			var y = Math.round(e - (yDash - e) * (e - iTL[0]) / (yDash + (e - fTL[0])));

			var newDomain = [x, y].map(initialPinchXScale.invert);
			// var domainR = initial.right + right;

			var _filterData3 = filterData(fullData, newDomain, xAccessor, initialPinchXScale, {
				currentPlotData: initialPlotData,
				currentDomain: initialXScale.domain()
			}),
			    beforePlotData = _filterData3.plotData,
			    domain = _filterData3.domain;

			var plotData = postCalculator(beforePlotData);
			var updatedScale = initialXScale.copy().domain(domain);

			var mouseXY = finalPinch.touch1Pos;
			var chartConfig = (0, _ChartDataUtil.getChartConfigWithUpdatedYScales)(initialChartConfig, { plotData: plotData, xAccessor: xAccessor, displayXAccessor: displayXAccessor, fullData: fullData }, updatedScale.domain());
			var currentItem = (0, _ChartDataUtil.getCurrentItem)(updatedScale, xAccessor, mouseXY, plotData);

			return {
				chartConfig: chartConfig,
				xScale: updatedScale,
				plotData: plotData,
				mouseXY: mouseXY,
				currentItem: currentItem
			};
		}
	}, {
		key: "cancelDrag",
		value: function cancelDrag() {
			this.eventCaptureNode.cancelDrag();
			this.triggerEvent("dragcancel");
		}
	}, {
		key: "handlePinchZoom",
		value: function handlePinchZoom(initialPinch, finalPinch, e) {
			var _this2 = this;

			if (!this.waitingForPinchZoomAnimationFrame) {
				this.waitingForPinchZoomAnimationFrame = true;
				var state = this.pinchZoomHelper(initialPinch, finalPinch);

				this.triggerEvent("pinchzoom", state, e);

				this.finalPinch = finalPinch;

				requestAnimationFrame(function () {
					_this2.clearBothCanvas();
					_this2.draw({ trigger: "pinchzoom" });
					_this2.waitingForPinchZoomAnimationFrame = false;
				});
			}
		}
	}, {
		key: "handlePinchZoomEnd",
		value: function handlePinchZoomEnd(initialPinch, e) {
			var xAccessor = this.state.xAccessor;


			if (this.finalPinch) {
				var state = this.pinchZoomHelper(initialPinch, this.finalPinch);
				var xScale = state.xScale;

				this.triggerEvent("pinchzoom", state, e);

				this.finalPinch = null;

				this.clearThreeCanvas();

				var fullData = this.fullData;

				var firstItem = (0, _utils.head)(fullData);

				var start = (0, _utils.head)(xScale.domain());
				var end = xAccessor(firstItem);
				var onLoadMore = this.props.onLoadMore;


				this.setState(state, function () {
					if (start < end) {
						onLoadMore(start, end);
					}
				});
			}
		}
	}, {
		key: "handleZoom",
		value: function handleZoom(zoomDirection, mouseXY, e) {
			if (this.panInProgress) return;
			// console.log("zoomDirection ", zoomDirection, " mouseXY ", mouseXY);
			var _state4 = this.state,
			    xAccessor = _state4.xAccessor,
			    initialXScale = _state4.xScale,
			    initialPlotData = _state4.plotData;
			var _props = this.props,
			    zoomMultiplier = _props.zoomMultiplier,
			    zoomAnchor = _props.zoomAnchor;
			var fullData = this.fullData;

			var item = zoomAnchor({
				xScale: initialXScale,
				xAccessor: xAccessor,
				mouseXY: mouseXY,
				plotData: initialPlotData,
				fullData: fullData
			});

			var cx = initialXScale(item);
			var c = zoomDirection > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier;
			var newDomain = initialXScale.range().map(function (x) {
				return cx + (x - cx) * c;
			}).map(initialXScale.invert);

			var _calculateStateForDom = this.calculateStateForDomain(newDomain),
			    xScale = _calculateStateForDom.xScale,
			    plotData = _calculateStateForDom.plotData,
			    chartConfig = _calculateStateForDom.chartConfig;

			var currentItem = (0, _ChartDataUtil.getCurrentItem)(xScale, xAccessor, mouseXY, plotData);
			var currentCharts = (0, _ChartDataUtil.getCurrentCharts)(chartConfig, mouseXY);

			this.clearThreeCanvas();

			var firstItem = (0, _utils.head)(fullData);

			var start = (0, _utils.head)(xScale.domain());
			var end = xAccessor(firstItem);
			var onLoadMore = this.props.onLoadMore;


			this.mutableState = {
				mouseXY: mouseXY,
				currentItem: currentItem,
				currentCharts: currentCharts
			};

			this.triggerEvent("zoom", {
				xScale: xScale,
				plotData: plotData,
				chartConfig: chartConfig,
				mouseXY: mouseXY,
				currentCharts: currentCharts,
				currentItem: currentItem,
				show: true
			}, e);

			this.setState({
				xScale: xScale,
				plotData: plotData,
				chartConfig: chartConfig
			}, function () {
				if (start < end) {
					onLoadMore(start, end);
				}
			});
		}
	}, {
		key: "xAxisZoom",
		value: function xAxisZoom(newDomain) {
			var _calculateStateForDom2 = this.calculateStateForDomain(newDomain),
			    xScale = _calculateStateForDom2.xScale,
			    plotData = _calculateStateForDom2.plotData,
			    chartConfig = _calculateStateForDom2.chartConfig;

			this.clearThreeCanvas();

			var xAccessor = this.state.xAccessor;
			var fullData = this.fullData;

			var firstItem = (0, _utils.head)(fullData);
			var start = (0, _utils.head)(xScale.domain());
			var end = xAccessor(firstItem);
			var onLoadMore = this.props.onLoadMore;


			this.setState({
				xScale: xScale,
				plotData: plotData,
				chartConfig: chartConfig
			}, function () {
				if (start < end) onLoadMore(start, end);
			});
		}
	}, {
		key: "yAxisZoom",
		value: function yAxisZoom(chartId, newDomain) {
			this.clearThreeCanvas();
			var initialChartConfig = this.state.chartConfig;

			var chartConfig = initialChartConfig.map(function (each) {
				if (each.id === chartId) {
					var yScale = each.yScale;

					return _extends({}, each, {
						yScale: yScale.copy().domain(newDomain),
						yPanEnabled: true
					});
				} else {
					return each;
				}
			});

			this.setState({
				chartConfig: chartConfig
			});
		}
	}, {
		key: "triggerEvent",
		value: function triggerEvent(type, props, e) {
			var _this3 = this;

			// console.log("triggering ->", type);

			this.subscriptions.forEach(function (each) {
				var state = _extends({}, _this3.state, {
					fullData: _this3.fullData,
					subscriptions: _this3.subscriptions
				});
				each.listener(type, props, state, e);
			});
		}
	}, {
		key: "draw",
		value: function draw(props) {
			this.subscriptions.forEach(function (each) {
				if ((0, _utils.isDefined)(each.draw)) each.draw(props);
			});
		}
	}, {
		key: "redraw",
		value: function redraw() {
			this.clearThreeCanvas();
			this.draw({ force: true });
		}
	}, {
		key: "panHelper",
		value: function panHelper(mouseXY, initialXScale, _ref2, chartsToPan) {
			var dx = _ref2.dx,
			    dy = _ref2.dy;
			var _state5 = this.state,
			    xAccessor = _state5.xAccessor,
			    displayXAccessor = _state5.displayXAccessor,
			    initialChartConfig = _state5.chartConfig;
			var filterData = this.state.filterData;
			var fullData = this.fullData;
			var postCalculator = this.props.postCalculator;

			// console.log(dx, dy);

			if ((0, _utils.isNotDefined)(initialXScale.invert)) throw new Error("xScale provided does not have an invert() method." + "You are likely using an ordinal scale. This scale does not support zoom, pan");

			var newDomain = initialXScale.range().map(function (x) {
				return x - dx;
			}).map(initialXScale.invert);

			var _filterData4 = filterData(fullData, newDomain, xAccessor, initialXScale, {
				currentPlotData: this.hackyWayToStopPanBeyondBounds__plotData,
				currentDomain: this.hackyWayToStopPanBeyondBounds__domain
			}),
			    beforePlotData = _filterData4.plotData,
			    domain = _filterData4.domain;

			var updatedScale = initialXScale.copy().domain(domain);
			var plotData = postCalculator(beforePlotData);
			// console.log(last(plotData));

			var currentItem = (0, _ChartDataUtil.getCurrentItem)(updatedScale, xAccessor, mouseXY, plotData);
			var chartConfig = (0, _ChartDataUtil.getChartConfigWithUpdatedYScales)(initialChartConfig, { plotData: plotData, xAccessor: xAccessor, displayXAccessor: displayXAccessor, fullData: fullData }, updatedScale.domain(), dy, chartsToPan);
			var currentCharts = (0, _ChartDataUtil.getCurrentCharts)(chartConfig, mouseXY);

			// console.log(initialXScale.domain(), newDomain, updatedScale.domain());
			return {
				xScale: updatedScale,
				plotData: plotData,
				chartConfig: chartConfig,
				mouseXY: mouseXY,
				currentCharts: currentCharts,
				currentItem: currentItem
			};
		}
	}, {
		key: "handlePan",
		value: function handlePan(mousePosition, panStartXScale, dxdy, chartsToPan, e) {
			var _this4 = this;

			if (!this.waitingForPanAnimationFrame) {
				this.waitingForPanAnimationFrame = true;

				this.hackyWayToStopPanBeyondBounds__plotData = this.hackyWayToStopPanBeyondBounds__plotData || this.state.plotData;
				this.hackyWayToStopPanBeyondBounds__domain = this.hackyWayToStopPanBeyondBounds__domain || this.state.xScale.domain();

				var state = this.panHelper(mousePosition, panStartXScale, dxdy, chartsToPan);

				this.hackyWayToStopPanBeyondBounds__plotData = state.plotData;
				this.hackyWayToStopPanBeyondBounds__domain = state.xScale.domain();

				this.panInProgress = true;
				// console.log(panStartXScale.domain(), state.xScale.domain());

				this.triggerEvent("pan", state, e);

				this.mutableState = {
					mouseXY: state.mouseXY,
					currentItem: state.currentItem,
					currentCharts: state.currentCharts
				};
				requestAnimationFrame(function () {
					_this4.waitingForPanAnimationFrame = false;
					_this4.clearBothCanvas();
					_this4.draw({ trigger: "pan" });
				});
			}
		}
	}, {
		key: "handlePanEnd",
		value: function handlePanEnd(mousePosition, panStartXScale, dxdy, chartsToPan, e) {
			var _this5 = this;

			var state = this.panHelper(mousePosition, panStartXScale, dxdy, chartsToPan);
			// console.log(this.canvasDrawCallbackList.map(d => d.type));
			this.hackyWayToStopPanBeyondBounds__plotData = null;
			this.hackyWayToStopPanBeyondBounds__domain = null;

			this.panInProgress = false;

			// console.log("PANEND", panEnd++);
			var xScale = state.xScale,
			    plotData = state.plotData,
			    chartConfig = state.chartConfig;


			this.triggerEvent("panend", state, e);

			requestAnimationFrame(function () {
				var xAccessor = _this5.state.xAccessor;
				var fullData = _this5.fullData;


				var firstItem = (0, _utils.head)(fullData);
				var start = (0, _utils.head)(xScale.domain());
				var end = xAccessor(firstItem);
				// console.log(start, end, start < end ? "Load more" : "I have it");

				var onLoadMore = _this5.props.onLoadMore;


				_this5.clearThreeCanvas();

				_this5.setState({
					xScale: xScale,
					plotData: plotData,
					chartConfig: chartConfig
				}, function () {
					if (start < end) onLoadMore(start, end);
				});
			});
		}
	}, {
		key: "handleMouseDown",
		value: function handleMouseDown(mousePosition, currentCharts, e) {
			this.triggerEvent("mousedown", this.mutableState, e);
		}
	}, {
		key: "handleMouseEnter",
		value: function handleMouseEnter(e) {
			this.triggerEvent("mouseenter", {
				show: true
			}, e);
		}
	}, {
		key: "handleMouseMove",
		value: function handleMouseMove(mouseXY, inputType, e) {
			var _this6 = this;

			if (!this.waitingForMouseMoveAnimationFrame) {
				this.waitingForMouseMoveAnimationFrame = true;

				var _state6 = this.state,
				    chartConfig = _state6.chartConfig,
				    plotData = _state6.plotData,
				    xScale = _state6.xScale,
				    xAccessor = _state6.xAccessor;

				var currentCharts = (0, _ChartDataUtil.getCurrentCharts)(chartConfig, mouseXY);
				var currentItem = (0, _ChartDataUtil.getCurrentItem)(xScale, xAccessor, mouseXY, plotData);
				this.triggerEvent("mousemove", {
					show: true,
					mouseXY: mouseXY,
					// prevMouseXY is used in interactive components
					prevMouseXY: this.prevMouseXY,
					currentItem: currentItem,
					currentCharts: currentCharts
				}, e);

				this.prevMouseXY = mouseXY;
				this.mutableState = {
					mouseXY: mouseXY,
					currentItem: currentItem,
					currentCharts: currentCharts
				};

				requestAnimationFrame(function () {
					_this6.clearMouseCanvas();
					_this6.draw({ trigger: "mousemove" });
					_this6.waitingForMouseMoveAnimationFrame = false;
				});
			}
		}
	}, {
		key: "handleMouseLeave",
		value: function handleMouseLeave(e) {
			this.triggerEvent("mouseleave", { show: false }, e);
			this.clearMouseCanvas();
			this.draw({ trigger: "mouseleave" });
		}
	}, {
		key: "handleDragStart",
		value: function handleDragStart(_ref3, e) {
			var startPos = _ref3.startPos;

			this.triggerEvent("dragstart", { startPos: startPos }, e);
		}
	}, {
		key: "handleDrag",
		value: function handleDrag(_ref4, e) {
			var _this7 = this;

			var startPos = _ref4.startPos,
			    mouseXY = _ref4.mouseXY;
			var _state7 = this.state,
			    chartConfig = _state7.chartConfig,
			    plotData = _state7.plotData,
			    xScale = _state7.xScale,
			    xAccessor = _state7.xAccessor;

			var currentCharts = (0, _ChartDataUtil.getCurrentCharts)(chartConfig, mouseXY);
			var currentItem = (0, _ChartDataUtil.getCurrentItem)(xScale, xAccessor, mouseXY, plotData);

			this.triggerEvent("drag", {
				startPos: startPos,
				mouseXY: mouseXY,
				currentItem: currentItem,
				currentCharts: currentCharts
			}, e);

			this.mutableState = {
				mouseXY: mouseXY,
				currentItem: currentItem,
				currentCharts: currentCharts
			};

			requestAnimationFrame(function () {
				_this7.clearMouseCanvas();
				_this7.draw({ trigger: "drag" });
			});
		}
	}, {
		key: "handleDragEnd",
		value: function handleDragEnd(_ref5, e) {
			var _this8 = this;

			var mouseXY = _ref5.mouseXY;

			this.triggerEvent("dragend", { mouseXY: mouseXY }, e);

			requestAnimationFrame(function () {
				_this8.clearMouseCanvas();
				_this8.draw({ trigger: "dragend" });
			});
		}
	}, {
		key: "handleClick",
		value: function handleClick(mousePosition, e) {
			var _this9 = this;

			this.triggerEvent("click", this.mutableState, e);

			requestAnimationFrame(function () {
				_this9.clearMouseCanvas();
				_this9.draw({ trigger: "click" });
			});
		}
	}, {
		key: "handleDoubleClick",
		value: function handleDoubleClick(mousePosition, e) {
			this.triggerEvent("dblclick", {}, e);
		}
	}, {
		key: "getChildContext",
		value: function getChildContext() {
			var dimensions = getDimensions(this.props);
			return {
				fullData: this.fullData,
				plotData: this.state.plotData,
				width: dimensions.width,
				height: dimensions.height,
				chartConfig: this.state.chartConfig,
				xScale: this.state.xScale,
				xAccessor: this.state.xAccessor,
				displayXAccessor: this.state.displayXAccessor,
				chartCanvasType: this.props.type,
				margin: this.props.margin,
				ratio: this.props.ratio,
				xAxisZoom: this.xAxisZoom,
				yAxisZoom: this.yAxisZoom,
				getCanvasContexts: this.getCanvasContexts,
				redraw: this.redraw,
				subscribe: this.subscribe,
				unsubscribe: this.unsubscribe,
				generateSubscriptionId: this.generateSubscriptionId,
				getMutableState: this.getMutableState,
				amIOnTop: this.amIOnTop,
				setCursorClass: this.setCursorClass
			};
		}
	}, {
		key: "componentWillMount",
		value: function componentWillMount() {
			var _resetChart = resetChart(this.props, true),
			    fullData = _resetChart.fullData,
			    state = _objectWithoutProperties(_resetChart, ["fullData"]);

			this.setState(state);
			this.fullData = fullData;
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var reset = shouldResetChart(this.props, nextProps);

			var interaction = isInteractionEnabled(this.state.xScale, this.state.xAccessor, this.state.plotData);
			var initialChartConfig = this.state.chartConfig;


			var newState = void 0;
			if (!interaction || reset || !(0, _utils.shallowEqual)(this.props.xExtents, nextProps.xExtents)) {
				if (process.env.NODE_ENV !== "production") {
					if (!interaction) log("RESET CHART, changes to a non interactive chart");else if (reset) log("RESET CHART, one or more of these props changed", CANDIDATES_FOR_RESET);else log("xExtents changed");
				}
				// do reset
				newState = resetChart(nextProps);
				this.mutableState = {};
			} else {
				var _state$xScale$domain = this.state.xScale.domain(),
				    _state$xScale$domain2 = _slicedToArray(_state$xScale$domain, 2),
				    start = _state$xScale$domain2[0],
				    end = _state$xScale$domain2[1];

				var prevLastItem = (0, _utils.last)(this.fullData);

				var calculatedState = calculateFullData(nextProps);
				var xAccessor = calculatedState.xAccessor;

				var lastItemWasVisible = xAccessor(prevLastItem) <= end && xAccessor(prevLastItem) >= start;

				if (process.env.NODE_ENV !== "production") {
					if (this.props.data !== nextProps.data) log("data is changed but seriesName did not, change the seriesName if you wish to reset the chart and lastItemWasVisible = ", lastItemWasVisible);else log("Trivial change, may be width/height or type changed, but that does not matter");
				}

				newState = updateChart(calculatedState, this.state.xScale, nextProps, lastItemWasVisible, initialChartConfig);
			}

			var _newState = newState,
			    fullData = _newState.fullData,
			    state = _objectWithoutProperties(_newState, ["fullData"]);

			if (this.panInProgress) {
				if (process.env.NODE_ENV !== "production") {
					log("Pan is in progress");
				}
			} else {
				/*
    if (!reset) {
    	state.chartConfig
    		.forEach((each) => {
    			// const sourceChartConfig = initialChartConfig.filter(d => d.id === each.id);
    			const prevChartConfig = find(initialChartConfig, d => d.id === each.id);
    			if (isDefined(prevChartConfig) && prevChartConfig.yPanEnabled) {
    				each.yScale.domain(prevChartConfig.yScale.domain());
    				each.yPanEnabled = prevChartConfig.yPanEnabled;
    			}
    		});
    }
    */
				this.clearThreeCanvas();

				this.setState(state);
			}
			this.fullData = fullData;
		}
		/*
  componentDidUpdate(prevProps, prevState) {
  	console.error(this.state.chartConfig, this.state.chartConfig.map(d => d.yScale.domain()));
  }
  */

	}, {
		key: "resetYDomain",
		value: function resetYDomain(chartId) {
			var chartConfig = this.state.chartConfig;

			var changed = false;
			var newChartConfig = chartConfig.map(function (each) {
				if (((0, _utils.isNotDefined)(chartId) || each.id === chartId) && !(0, _utils.shallowEqual)(each.yScale.domain(), each.realYDomain)) {
					changed = true;
					return _extends({}, each, {
						yScale: each.yScale.domain(each.realYDomain),
						yPanEnabled: false
					});
				}
				return each;
			});

			if (changed) {
				this.clearThreeCanvas();
				this.setState({
					chartConfig: newChartConfig
				});
			}
		}
	}, {
		key: "shouldComponentUpdate",
		value: function shouldComponentUpdate() {
			// console.log("Happneing.....", !this.panInProgress)
			return !this.panInProgress;
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props,
			    type = _props2.type,
			    height = _props2.height,
			    width = _props2.width,
			    margin = _props2.margin,
			    className = _props2.className,
			    zIndex = _props2.zIndex,
			    defaultFocus = _props2.defaultFocus,
			    ratio = _props2.ratio,
			    mouseMoveEvent = _props2.mouseMoveEvent,
			    panEvent = _props2.panEvent,
			    zoomEvent = _props2.zoomEvent;
			var _props3 = this.props,
			    useCrossHairStyleCursor = _props3.useCrossHairStyleCursor,
			    onSelect = _props3.onSelect;
			var _state8 = this.state,
			    plotData = _state8.plotData,
			    xScale = _state8.xScale,
			    xAccessor = _state8.xAccessor,
			    chartConfig = _state8.chartConfig;

			var dimensions = getDimensions(this.props);

			var interaction = isInteractionEnabled(xScale, xAccessor, plotData);

			var cursorStyle = useCrossHairStyleCursor && interaction;
			var cursor = getCursorStyle();
			return _react2.default.createElement(
				"div",
				{ style: { position: "relative", width: width, height: height }, className: className, onClick: onSelect },
				_react2.default.createElement(_CanvasContainer2.default, { ref: this.saveCanvasContainerNode,
					type: type,
					ratio: ratio,
					width: width, height: height, zIndex: zIndex }),
				_react2.default.createElement(
					"svg",
					{ className: className, width: width, height: height, style: { position: "absolute", zIndex: zIndex + 5 } },
					cursor,
					_react2.default.createElement(
						"defs",
						null,
						_react2.default.createElement(
							"clipPath",
							{ id: "chart-area-clip" },
							_react2.default.createElement("rect", { x: "0", y: "0", width: dimensions.width, height: dimensions.height })
						),
						chartConfig.map(function (each, idx) {
							return _react2.default.createElement(
								"clipPath",
								{ key: idx, id: "chart-area-clip-" + each.id },
								_react2.default.createElement("rect", { x: "0", y: "0", width: each.width, height: each.height })
							);
						})
					),
					_react2.default.createElement(
						"g",
						{ transform: "translate(" + (margin.left + 0.5) + ", " + (margin.top + 0.5) + ")" },
						_react2.default.createElement(_EventCapture2.default, {
							ref: this.saveEventCaptureNode,
							useCrossHairStyleCursor: cursorStyle,
							mouseMove: mouseMoveEvent && interaction,
							zoom: zoomEvent && interaction,
							pan: panEvent && interaction,

							width: dimensions.width,
							height: dimensions.height,
							chartConfig: chartConfig,
							xScale: xScale,
							xAccessor: xAccessor,
							focus: defaultFocus,
							disableInteraction: this.props.disableInteraction,

							getAllPanConditions: this.getAllPanConditions,
							onContextMenu: this.handleContextMenu,
							onClick: this.handleClick,
							onDoubleClick: this.handleDoubleClick,
							onMouseDown: this.handleMouseDown,
							onMouseMove: this.handleMouseMove,
							onMouseEnter: this.handleMouseEnter,
							onMouseLeave: this.handleMouseLeave,

							onDragStart: this.handleDragStart,
							onDrag: this.handleDrag,
							onDragComplete: this.handleDragEnd,

							onZoom: this.handleZoom,
							onPinchZoom: this.handlePinchZoom,
							onPinchZoomEnd: this.handlePinchZoomEnd,
							onPan: this.handlePan,
							onPanEnd: this.handlePanEnd
						}),
						_react2.default.createElement(
							"g",
							{ className: "react-stockcharts-avoid-interaction" },
							this.props.children
						)
					)
				)
			);
		}
	}]);

	return ChartCanvas;
}(_react.Component);

function isInteractionEnabled(xScale, xAccessor, data) {
	var interaction = !isNaN(xScale(xAccessor((0, _utils.head)(data)))) && (0, _utils.isDefined)(xScale.invert);
	return interaction;
}

ChartCanvas.propTypes = {
	width: _propTypes2.default.number.isRequired,
	height: _propTypes2.default.number.isRequired,
	margin: _propTypes2.default.object,
	ratio: _propTypes2.default.number.isRequired,
	// interval: PropTypes.oneOf(["D", "W", "M"]), // ,"m1", "m5", "m15", "W", "M"
	type: _propTypes2.default.oneOf(["svg", "hybrid"]),
	pointsPerPxThreshold: _propTypes2.default.number,
	minPointsPerPxThreshold: _propTypes2.default.number,
	data: _propTypes2.default.array.isRequired,
	// initialDisplay: PropTypes.number,
	xAccessor: _propTypes2.default.func,
	xExtents: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.func]),
	zoomAnchor: _propTypes2.default.func,

	className: _propTypes2.default.string,
	seriesName: _propTypes2.default.string.isRequired,
	zIndex: _propTypes2.default.number,
	children: _propTypes2.default.node.isRequired,
	xScale: _propTypes2.default.func.isRequired,
	postCalculator: _propTypes2.default.func,
	flipXScale: _propTypes2.default.bool,
	useCrossHairStyleCursor: _propTypes2.default.bool,
	padding: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.shape({
		left: _propTypes2.default.number,
		right: _propTypes2.default.number
	})]),
	defaultFocus: _propTypes2.default.bool,
	zoomMultiplier: _propTypes2.default.number,
	onLoadMore: _propTypes2.default.func,
	displayXAccessor: function displayXAccessor(props, propName /* , componentName */) {
		if ((0, _utils.isNotDefined)(props[propName])) {
			console.warn("`displayXAccessor` is not defined," + " will use the value from `xAccessor` as `displayXAccessor`." + " This might be ok if you do not use a discontinuous scale" + " but if you do, provide a `displayXAccessor` prop to `ChartCanvas`");
		} else if (typeof props[propName] !== "function") {
			return new Error("displayXAccessor has to be a function");
		}
	},
	mouseMoveEvent: _propTypes2.default.bool,
	panEvent: _propTypes2.default.bool,
	clamp: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool, _propTypes2.default.func]),
	zoomEvent: _propTypes2.default.bool,
	onSelect: _propTypes2.default.func,
	maintainPointsPerPixelOnResize: _propTypes2.default.bool,
	disableInteraction: _propTypes2.default.bool
};

ChartCanvas.defaultProps = {
	margin: { top: 20, right: 30, bottom: 30, left: 80 },
	type: "hybrid",
	pointsPerPxThreshold: 2,
	minPointsPerPxThreshold: 1 / 100,
	className: "react-stockchart",
	zIndex: 1,
	xExtents: [_d3Array.min, _d3Array.max],
	postCalculator: _utils.identity,
	padding: 0,
	xAccessor: _utils.identity,
	flipXScale: false,
	useCrossHairStyleCursor: true,
	defaultFocus: true,
	onLoadMore: _utils.noop,
	onSelect: _utils.noop,
	mouseMoveEvent: true,
	panEvent: true,
	zoomEvent: true,
	zoomMultiplier: 1.1,
	clamp: false,
	zoomAnchor: _zoomBehavior.mouseBasedZoomAnchor,
	maintainPointsPerPixelOnResize: true,
	// ratio: 2,
	disableInteraction: false
};

ChartCanvas.childContextTypes = {
	plotData: _propTypes2.default.array,
	fullData: _propTypes2.default.array,
	chartConfig: _propTypes2.default.arrayOf(_propTypes2.default.shape({
		id: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired,
		origin: _propTypes2.default.arrayOf(_propTypes2.default.number).isRequired,
		padding: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.shape({
			top: _propTypes2.default.number,
			bottom: _propTypes2.default.number
		})]),
		yExtents: _propTypes2.default.arrayOf(_propTypes2.default.func),
		yExtentsProvider: _propTypes2.default.func,
		yScale: _propTypes2.default.func.isRequired,
		mouseCoordinates: _propTypes2.default.shape({
			at: _propTypes2.default.string,
			format: _propTypes2.default.func
		}),
		width: _propTypes2.default.number.isRequired,
		height: _propTypes2.default.number.isRequired
	})).isRequired,
	xScale: _propTypes2.default.func.isRequired,
	xAccessor: _propTypes2.default.func.isRequired,
	displayXAccessor: _propTypes2.default.func.isRequired,
	width: _propTypes2.default.number.isRequired,
	height: _propTypes2.default.number.isRequired,
	chartCanvasType: _propTypes2.default.oneOf(["svg", "hybrid"]).isRequired,
	margin: _propTypes2.default.object.isRequired,
	ratio: _propTypes2.default.number.isRequired,
	getCanvasContexts: _propTypes2.default.func,
	xAxisZoom: _propTypes2.default.func,
	yAxisZoom: _propTypes2.default.func,
	amIOnTop: _propTypes2.default.func,
	redraw: _propTypes2.default.func,
	subscribe: _propTypes2.default.func,
	unsubscribe: _propTypes2.default.func,
	setCursorClass: _propTypes2.default.func,
	generateSubscriptionId: _propTypes2.default.func,
	getMutableState: _propTypes2.default.func
};

ChartCanvas.ohlcv = function (d) {
	return { date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume };
};

exports.default = ChartCanvas;
//# sourceMappingURL=ChartCanvas.js.map