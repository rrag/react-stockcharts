"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getNewXY = getNewXY;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../../utils");

var _ChartDataUtil = require("../../utils/ChartDataUtil");

var _utils2 = require("../utils");

var _HoverTextNearMouse = require("../components/HoverTextNearMouse");

var _HoverTextNearMouse2 = _interopRequireDefault(_HoverTextNearMouse);

var _LinearRegressionChannelWithArea = require("../components/LinearRegressionChannelWithArea");

var _LinearRegressionChannelWithArea2 = _interopRequireDefault(_LinearRegressionChannelWithArea);

var _ClickableCircle = require("../components/ClickableCircle");

var _ClickableCircle2 = _interopRequireDefault(_ClickableCircle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EachLinearRegressionChannel = function (_Component) {
	_inherits(EachLinearRegressionChannel, _Component);

	function EachLinearRegressionChannel(props) {
		_classCallCheck(this, EachLinearRegressionChannel);

		var _this = _possibleConstructorReturn(this, (EachLinearRegressionChannel.__proto__ || Object.getPrototypeOf(EachLinearRegressionChannel)).call(this, props));

		_this.handleEdge1Drag = _this.handleEdge1Drag.bind(_this);
		_this.handleEdge2Drag = _this.handleEdge2Drag.bind(_this);

		_this.handleHover = _this.handleHover.bind(_this);

		_this.isHover = _utils2.isHover.bind(_this);
		_this.saveNodeType = _utils2.saveNodeType.bind(_this);
		_this.nodes = {};

		_this.state = {
			hover: false
		};
		return _this;
	}

	_createClass(EachLinearRegressionChannel, [{
		key: "handleEdge1Drag",
		value: function handleEdge1Drag(moreProps) {
			var _props = this.props,
			    index = _props.index,
			    onDrag = _props.onDrag,
			    snapTo = _props.snapTo;
			var x2Value = this.props.x2Value;

			var _getNewXY = getNewXY(moreProps, snapTo),
			    _getNewXY2 = _slicedToArray(_getNewXY, 1),
			    x1Value = _getNewXY2[0];

			onDrag(index, {
				x1Value: x1Value,
				x2Value: x2Value
			});
		}
	}, {
		key: "handleEdge2Drag",
		value: function handleEdge2Drag(moreProps) {
			var _props2 = this.props,
			    index = _props2.index,
			    onDrag = _props2.onDrag,
			    snapTo = _props2.snapTo;
			var x1Value = this.props.x1Value;

			var _getNewXY3 = getNewXY(moreProps, snapTo),
			    _getNewXY4 = _slicedToArray(_getNewXY3, 1),
			    x2Value = _getNewXY4[0];

			onDrag(index, {
				x1Value: x1Value,
				x2Value: x2Value
			});
		}
	}, {
		key: "handleHover",
		value: function handleHover(moreProps) {
			if (this.state.hover !== moreProps.hovering) {
				this.setState({
					hover: moreProps.hovering
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props3 = this.props,
			    x1Value = _props3.x1Value,
			    x2Value = _props3.x2Value,
			    appearance = _props3.appearance,
			    edgeInteractiveCursor = _props3.edgeInteractiveCursor,
			    hoverText = _props3.hoverText,
			    interactive = _props3.interactive,
			    selected = _props3.selected,
			    onDragComplete = _props3.onDragComplete;
			var stroke = appearance.stroke,
			    strokeWidth = appearance.strokeWidth,
			    strokeOpacity = appearance.strokeOpacity,
			    fill = appearance.fill,
			    fillOpacity = appearance.fillOpacity,
			    r = appearance.r,
			    edgeStrokeWidth = appearance.edgeStrokeWidth,
			    edgeFill = appearance.edgeFill,
			    edgeStroke = appearance.edgeStroke;
			var hover = this.state.hover;


			var hoverHandler = interactive ? { onHover: this.handleHover, onUnHover: this.handleHover } : {};

			var hoverTextEnabled = hoverText.enable,
			    hoverTextSelected = hoverText.selectedText,
			    hoverTextUnselected = hoverText.text,
			    restHoverTextProps = _objectWithoutProperties(hoverText, ["enable", "selectedText", "text"]);

			return _react2.default.createElement(
				"g",
				null,
				_react2.default.createElement(_LinearRegressionChannelWithArea2.default, _extends({
					ref: this.saveNodeType("area"),
					selected: selected || hover
				}, hoverHandler, {

					x1Value: x1Value,
					x2Value: x2Value,
					fill: fill,
					stroke: stroke,
					strokeWidth: hover || selected ? strokeWidth + 1 : strokeWidth,
					strokeOpacity: strokeOpacity,
					fillOpacity: fillOpacity })),
				_react2.default.createElement(_ClickableCircle2.default, {
					ref: this.saveNodeType("edge1"),
					show: selected || hover,
					xyProvider: (0, _LinearRegressionChannelWithArea.edge1Provider)(this.props),
					r: r,
					fill: edgeFill,
					stroke: edgeStroke,
					strokeWidth: edgeStrokeWidth,
					interactiveCursorClass: edgeInteractiveCursor,
					onDrag: this.handleEdge1Drag,
					onDragComplete: onDragComplete }),
				_react2.default.createElement(_ClickableCircle2.default, {
					ref: this.saveNodeType("edge2"),
					show: selected || hover,
					xyProvider: (0, _LinearRegressionChannelWithArea.edge2Provider)(this.props),
					r: r,
					fill: edgeFill,
					stroke: edgeStroke,
					strokeWidth: edgeStrokeWidth,
					interactiveCursorClass: edgeInteractiveCursor,
					onDrag: this.handleEdge2Drag,
					onDragComplete: onDragComplete }),
				_react2.default.createElement(_HoverTextNearMouse2.default, _extends({
					show: hoverTextEnabled && hover
				}, restHoverTextProps, {
					text: selected ? hoverTextSelected : hoverTextUnselected
				}))
			);
		}
	}]);

	return EachLinearRegressionChannel;
}(_react.Component);

function getNewXY(moreProps, snapTo) {
	var xScale = moreProps.xScale,
	    xAccessor = moreProps.xAccessor,
	    plotData = moreProps.plotData,
	    mouseXY = moreProps.mouseXY;


	var currentItem = (0, _ChartDataUtil.getCurrentItem)(xScale, xAccessor, mouseXY, plotData);
	var x = xAccessor(currentItem);
	var y = snapTo(currentItem);

	return [x, y];
}

EachLinearRegressionChannel.propTypes = {
	defaultClassName: _propTypes2.default.string,

	x1Value: _propTypes2.default.any.isRequired,
	x2Value: _propTypes2.default.any.isRequired,

	index: _propTypes2.default.number,

	appearance: _propTypes2.default.shape({
		stroke: _propTypes2.default.string.isRequired,
		fillOpacity: _propTypes2.default.number.isRequired,
		strokeOpacity: _propTypes2.default.number.isRequired,
		strokeWidth: _propTypes2.default.number.isRequired,
		fill: _propTypes2.default.string.isRequired,
		edgeStrokeWidth: _propTypes2.default.number.isRequired,
		edgeStroke: _propTypes2.default.string.isRequired,
		edgeFill: _propTypes2.default.string.isRequired,
		r: _propTypes2.default.number.isRequired
	}).isRequired,

	edgeInteractiveCursor: _propTypes2.default.string,
	onDrag: _propTypes2.default.func.isRequired,
	onDragComplete: _propTypes2.default.func.isRequired,
	snapTo: _propTypes2.default.func,
	interactive: _propTypes2.default.bool.isRequired,
	selected: _propTypes2.default.bool.isRequired,

	hoverText: _propTypes2.default.object.isRequired
};

EachLinearRegressionChannel.defaultProps = {
	onDrag: _utils.noop,
	onDragComplete: _utils.noop,

	appearance: {
		stroke: "#000000",
		fillOpacity: 0.7,
		strokeOpacity: 1,
		strokeWidth: 1,
		fill: "#8AAFE2",
		edgeStrokeWidth: 2,
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		r: 5
	},
	interactive: true,
	selected: false,
	hoverText: _extends({}, _HoverTextNearMouse2.default.defaultProps, {
		enable: true,
		bgHeight: 18,
		bgWidth: 175,
		text: "Click and drag the edge circles"
	})
};

exports.default = EachLinearRegressionChannel;
//# sourceMappingURL=EachLinearRegressionChannel.js.map