"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../../utils");

var _ChartDataUtil = require("../../utils/ChartDataUtil");

var _utils2 = require("../utils");

var _EachTrendLine = require("./EachTrendLine");

var _StraightLine = require("../components/StraightLine");

var _StraightLine2 = _interopRequireDefault(_StraightLine);

var _ClickableCircle = require("../components/ClickableCircle");

var _ClickableCircle2 = _interopRequireDefault(_ClickableCircle);

var _HoverTextNearMouse = require("../components/HoverTextNearMouse");

var _HoverTextNearMouse2 = _interopRequireDefault(_HoverTextNearMouse);

var _Text = require("../components/Text");

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EachFibRetracement = function (_Component) {
	_inherits(EachFibRetracement, _Component);

	function EachFibRetracement(props) {
		_classCallCheck(this, EachFibRetracement);

		var _this = _possibleConstructorReturn(this, (EachFibRetracement.__proto__ || Object.getPrototypeOf(EachFibRetracement)).call(this, props));

		_this.handleEdge1Drag = _this.handleEdge1Drag.bind(_this);
		_this.handleEdge2Drag = _this.handleEdge2Drag.bind(_this);

		_this.handleLineNSResizeTop = _this.handleLineNSResizeTop.bind(_this);
		_this.handleLineNSResizeBottom = _this.handleLineNSResizeBottom.bind(_this);
		_this.handleLineMove = _this.handleLineMove.bind(_this);

		_this.handleLineDragStart = _this.handleLineDragStart.bind(_this);

		_this.handleHover = _this.handleHover.bind(_this);

		_this.isHover = _utils2.isHover.bind(_this);
		_this.saveNodeType = _utils2.saveNodeType.bind(_this);
		_this.nodes = {};

		_this.state = {
			hover: false
		};
		return _this;
	}

	_createClass(EachFibRetracement, [{
		key: "handleHover",
		value: function handleHover(moreProps) {
			if (this.state.hover !== moreProps.hovering) {
				this.setState({
					hover: moreProps.hovering
				});
			}
		}
	}, {
		key: "handleLineDragStart",
		value: function handleLineDragStart() {
			var _props = this.props,
			    x1 = _props.x1,
			    y1 = _props.y1,
			    x2 = _props.x2,
			    y2 = _props.y2;


			this.dragStart = {
				x1: x1, y1: y1, x2: x2, y2: y2
			};
		}
	}, {
		key: "handleLineMove",
		value: function handleLineMove(moreProps) {
			var _props2 = this.props,
			    index = _props2.index,
			    onDrag = _props2.onDrag;
			var _dragStart = this.dragStart,
			    x1Value = _dragStart.x1,
			    y1Value = _dragStart.y1,
			    x2Value = _dragStart.x2,
			    y2Value = _dragStart.y2;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    xAccessor = moreProps.xAccessor,
			    fullData = moreProps.fullData;
			var startPos = moreProps.startPos,
			    mouseXY = moreProps.mouseXY;


			var x1 = xScale(x1Value);
			var y1 = yScale(y1Value);
			var x2 = xScale(x2Value);
			var y2 = yScale(y2Value);

			var dx = startPos[0] - mouseXY[0];
			var dy = startPos[1] - mouseXY[1];

			var newX1Value = (0, _ChartDataUtil.getXValue)(xScale, xAccessor, [x1 - dx, y1 - dy], fullData);
			var newY1Value = yScale.invert(y1 - dy);
			var newX2Value = (0, _ChartDataUtil.getXValue)(xScale, xAccessor, [x2 - dx, y2 - dy], fullData);
			var newY2Value = yScale.invert(y2 - dy);

			onDrag(index, {
				x1: newX1Value,
				y1: newY1Value,
				x2: newX2Value,
				y2: newY2Value
			});
		}
	}, {
		key: "handleLineNSResizeTop",
		value: function handleLineNSResizeTop(moreProps) {
			var _props3 = this.props,
			    index = _props3.index,
			    onDrag = _props3.onDrag;
			var _props4 = this.props,
			    x1 = _props4.x1,
			    x2 = _props4.x2,
			    y2 = _props4.y2;

			var _getNewXY = (0, _EachTrendLine.getNewXY)(moreProps),
			    _getNewXY2 = _slicedToArray(_getNewXY, 2),
			    y1 = _getNewXY2[1];

			onDrag(index, {
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2
			});
		}
	}, {
		key: "handleLineNSResizeBottom",
		value: function handleLineNSResizeBottom(moreProps) {
			var _props5 = this.props,
			    index = _props5.index,
			    onDrag = _props5.onDrag;
			var _props6 = this.props,
			    x1 = _props6.x1,
			    y1 = _props6.y1,
			    x2 = _props6.x2;

			var _getNewXY3 = (0, _EachTrendLine.getNewXY)(moreProps),
			    _getNewXY4 = _slicedToArray(_getNewXY3, 2),
			    y2 = _getNewXY4[1];

			onDrag(index, {
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2
			});
		}
	}, {
		key: "handleEdge1Drag",
		value: function handleEdge1Drag(moreProps) {
			var _props7 = this.props,
			    index = _props7.index,
			    onDrag = _props7.onDrag;
			var _props8 = this.props,
			    y1 = _props8.y1,
			    x2 = _props8.x2,
			    y2 = _props8.y2;

			var _getNewXY5 = (0, _EachTrendLine.getNewXY)(moreProps),
			    _getNewXY6 = _slicedToArray(_getNewXY5, 1),
			    x1 = _getNewXY6[0];

			onDrag(index, {
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2
			});
		}
	}, {
		key: "handleEdge2Drag",
		value: function handleEdge2Drag(moreProps) {
			var _props9 = this.props,
			    index = _props9.index,
			    onDrag = _props9.onDrag;
			var _props10 = this.props,
			    x1 = _props10.x1,
			    y1 = _props10.y1,
			    y2 = _props10.y2;

			var _getNewXY7 = (0, _EachTrendLine.getNewXY)(moreProps),
			    _getNewXY8 = _slicedToArray(_getNewXY7, 1),
			    x2 = _getNewXY8[0];

			onDrag(index, {
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var _props11 = this.props,
			    x1 = _props11.x1,
			    x2 = _props11.x2,
			    y1 = _props11.y1,
			    y2 = _props11.y2;
			var _props12 = this.props,
			    interactive = _props12.interactive,
			    yDisplayFormat = _props12.yDisplayFormat,
			    type = _props12.type,
			    appearance = _props12.appearance;
			var stroke = appearance.stroke,
			    strokeWidth = appearance.strokeWidth,
			    strokeOpacity = appearance.strokeOpacity;
			var fontFamily = appearance.fontFamily,
			    fontSize = appearance.fontSize,
			    fontFill = appearance.fontFill;
			var edgeStroke = appearance.edgeStroke,
			    edgeFill = appearance.edgeFill,
			    nsEdgeFill = appearance.nsEdgeFill,
			    edgeStrokeWidth = appearance.edgeStrokeWidth,
			    r = appearance.r;
			var _props13 = this.props,
			    hoverText = _props13.hoverText,
			    selected = _props13.selected;
			var hover = this.state.hover;
			var onDragComplete = this.props.onDragComplete;

			var lines = helper({ x1: x1, x2: x2, y1: y1, y2: y2 });

			var hoverTextEnabled = hoverText.enable,
			    hoverTextSelected = hoverText.selectedText,
			    hoverTextUnselected = hoverText.text,
			    restHoverTextProps = _objectWithoutProperties(hoverText, ["enable", "selectedText", "text"]);

			var lineType = type === "EXTEND" ? "XLINE" : type === "BOUND" ? "LINE" : type;
			var dir = (0, _utils.head)(lines).y1 > (0, _utils.last)(lines).y1 ? 3 : -1.3;

			return _react2.default.createElement(
				"g",
				null,
				lines.map(function (line, j) {
					var text = yDisplayFormat(line.y) + " (" + line.percent.toFixed(2) + "%)";

					var xyProvider = function xyProvider(_ref) {
						var xScale = _ref.xScale,
						    chartConfig = _ref.chartConfig;
						var yScale = chartConfig.yScale;

						var _generateLine = (0, _StraightLine.generateLine)({
							type: lineType,
							start: [line.x1, line.y],
							end: [line.x2, line.y],
							xScale: xScale,
							yScale: yScale
						}),
						    x1 = _generateLine.x1,
						    y1 = _generateLine.y1,
						    x2 = _generateLine.x2;

						var x = xScale(Math.min(x1, x2)) + 10;
						var y = yScale(y1) + dir * 4;
						return [x, y];
					};

					var firstOrLast = j === 0 || j === lines.length - 1;

					var interactiveCursorClass = firstOrLast ? "react-stockcharts-ns-resize-cursor" : "react-stockcharts-move-cursor";

					var interactiveEdgeCursorClass = firstOrLast ? "react-stockcharts-ns-resize-cursor" : "react-stockcharts-ew-resize-cursor";

					var dragHandler = j === 0 ? _this2.handleLineNSResizeTop : j === lines.length - 1 ? _this2.handleLineNSResizeBottom : _this2.handleLineMove;

					var edge1DragHandler = j === 0 ? _this2.handleLineNSResizeTop : j === lines.length - 1 ? _this2.handleLineNSResizeBottom : _this2.handleEdge1Drag;
					var edge2DragHandler = j === 0 ? _this2.handleLineNSResizeTop : j === lines.length - 1 ? _this2.handleLineNSResizeBottom : _this2.handleEdge2Drag;

					var hoverHandler = interactive ? { onHover: _this2.handleHover, onUnHover: _this2.handleHover } : {};
					return _react2.default.createElement(
						"g",
						{ key: j },
						_react2.default.createElement(_StraightLine2.default, _extends({
							ref: _this2.saveNodeType("line_" + j),
							selected: selected || hover

						}, hoverHandler, {

							type: lineType,
							x1Value: line.x1,
							y1Value: line.y,
							x2Value: line.x2,
							y2Value: line.y,
							stroke: stroke,
							strokeWidth: hover || selected ? strokeWidth + 1 : strokeWidth,
							strokeOpacity: strokeOpacity,
							interactiveCursorClass: interactiveCursorClass,

							onDragStart: _this2.handleLineDragStart,
							onDrag: dragHandler,
							onDragComplete: onDragComplete
						})),
						_react2.default.createElement(
							_Text2.default,
							{
								selected: selected
								/* eslint-disable */
								, xyProvider: xyProvider
								/* eslint-enable */
								, fontFamily: fontFamily,
								fontSize: fontSize,
								fill: fontFill },
							text
						),
						_react2.default.createElement(_ClickableCircle2.default, {
							ref: _this2.saveNodeType("edge1"),
							show: selected || hover,
							cx: line.x1,
							cy: line.y,
							r: r,
							fill: firstOrLast ? nsEdgeFill : edgeFill,
							stroke: edgeStroke,
							strokeWidth: edgeStrokeWidth,
							interactiveCursorClass: interactiveEdgeCursorClass,
							onDrag: edge1DragHandler,
							onDragComplete: onDragComplete }),
						_react2.default.createElement(_ClickableCircle2.default, {
							ref: _this2.saveNodeType("edge2"),
							show: selected || hover,
							cx: line.x2,
							cy: line.y,
							r: r,
							fill: firstOrLast ? nsEdgeFill : edgeFill,
							stroke: edgeStroke,
							strokeWidth: edgeStrokeWidth,
							interactiveCursorClass: interactiveEdgeCursorClass,
							onDrag: edge2DragHandler,
							onDragComplete: onDragComplete })
					);
				}),
				_react2.default.createElement(_HoverTextNearMouse2.default, _extends({
					show: hoverTextEnabled && hover
				}, restHoverTextProps, {
					text: selected ? hoverTextSelected : hoverTextUnselected
				}))
			);
		}
	}]);

	return EachFibRetracement;
}(_react.Component);

function helper(_ref2) {
	var x1 = _ref2.x1,
	    y1 = _ref2.y1,
	    x2 = _ref2.x2,
	    y2 = _ref2.y2;

	var dy = y2 - y1;
	var retracements = [100, 61.8, 50, 38.2, 23.6, 0].map(function (each) {
		return {
			percent: each,
			x1: x1,
			x2: x2,
			y: y2 - each / 100 * dy
		};
	});

	return retracements;
}

EachFibRetracement.propTypes = {
	x1: _propTypes2.default.any.isRequired,
	x2: _propTypes2.default.any.isRequired,
	y1: _propTypes2.default.number.isRequired,
	y2: _propTypes2.default.number.isRequired,

	yDisplayFormat: _propTypes2.default.func.isRequired,
	type: _propTypes2.default.string.isRequired,
	selected: _propTypes2.default.bool.isRequired,

	appearance: _propTypes2.default.shape({
		stroke: _propTypes2.default.string.isRequired,
		strokeWidth: _propTypes2.default.number.isRequired,
		strokeOpacity: _propTypes2.default.number.isRequired,
		fontFamily: _propTypes2.default.string.isRequired,
		fontSize: _propTypes2.default.number.isRequired,
		fontFill: _propTypes2.default.string.isRequired,
		edgeStroke: _propTypes2.default.string.isRequired,
		edgeFill: _propTypes2.default.string.isRequired,
		nsEdgeFill: _propTypes2.default.string.isRequired,
		edgeStrokeWidth: _propTypes2.default.number.isRequired,
		r: _propTypes2.default.number.isRequired
	}).isRequired,

	interactive: _propTypes2.default.bool.isRequired,
	hoverText: _propTypes2.default.object.isRequired,

	index: _propTypes2.default.number,
	onDrag: _propTypes2.default.func.isRequired,
	onDragComplete: _propTypes2.default.func.isRequired
};

EachFibRetracement.defaultProps = {
	yDisplayFormat: function yDisplayFormat(d) {
		return d.toFixed(2);
	},
	interactive: true,

	appearance: {
		stroke: "#000000",
		strokeWidth: 1,
		strokeOpacity: 1,
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 10,
		fontFill: "#000000",
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		nsEdgeFill: "#000000",
		edgeStrokeWidth: 1,
		r: 5
	},
	selected: false,

	onDrag: _utils.noop,
	onDragComplete: _utils.noop,

	hoverText: {
		enable: false
	}
};

exports.default = EachFibRetracement;
//# sourceMappingURL=EachFibRetracement.js.map