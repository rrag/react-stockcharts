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

var _utils2 = require("../utils");

var _ChartDataUtil = require("../../utils/ChartDataUtil");

var _HoverTextNearMouse = require("../components/HoverTextNearMouse");

var _HoverTextNearMouse2 = _interopRequireDefault(_HoverTextNearMouse);

var _InteractiveText = require("../components/InteractiveText");

var _InteractiveText2 = _interopRequireDefault(_InteractiveText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EachText = function (_Component) {
	_inherits(EachText, _Component);

	function EachText(props) {
		_classCallCheck(this, EachText);

		var _this = _possibleConstructorReturn(this, (EachText.__proto__ || Object.getPrototypeOf(EachText)).call(this, props));

		_this.handleHover = _this.handleHover.bind(_this);

		_this.handleDragStart = _this.handleDragStart.bind(_this);
		_this.handleDrag = _this.handleDrag.bind(_this);

		_this.isHover = _utils2.isHover.bind(_this);
		_this.saveNodeType = _utils2.saveNodeType.bind(_this);
		_this.nodes = {};

		_this.state = {
			hover: false
		};
		return _this;
	}

	_createClass(EachText, [{
		key: "handleDragStart",
		value: function handleDragStart(moreProps) {
			var position = this.props.position;
			var mouseXY = moreProps.mouseXY;
			var yScale = moreProps.chartConfig.yScale,
			    xScale = moreProps.xScale;

			var _mouseXY = _slicedToArray(mouseXY, 2),
			    mouseX = _mouseXY[0],
			    mouseY = _mouseXY[1];

			var _position = _slicedToArray(position, 2),
			    textCX = _position[0],
			    textCY = _position[1];

			var dx = mouseX - xScale(textCX);
			var dy = mouseY - yScale(textCY);

			this.dragStartPosition = {
				position: position, dx: dx, dy: dy
			};
		}
	}, {
		key: "handleDrag",
		value: function handleDrag(moreProps) {
			var _props = this.props,
			    index = _props.index,
			    onDrag = _props.onDrag;

			var _moreProps$mouseXY = _slicedToArray(moreProps.mouseXY, 2),
			    mouseY = _moreProps$mouseXY[1],
			    yScale = moreProps.chartConfig.yScale,
			    xAccessor = moreProps.xAccessor,
			    mouseXY = moreProps.mouseXY,
			    plotData = moreProps.plotData,
			    xScale = moreProps.xScale;

			var _dragStartPosition = this.dragStartPosition,
			    dx = _dragStartPosition.dx,
			    dy = _dragStartPosition.dy;

			var xValue = xScale.invert(xScale((0, _ChartDataUtil.getXValue)(xScale, xAccessor, mouseXY, plotData)) - dx);
			// xScale.invert(xScale(xAccessor(currentItem)) - dx);
			var xyValue = [xValue, yScale.invert(mouseY - dy)];

			onDrag(index, xyValue);
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
			var _props2 = this.props,
			    position = _props2.position,
			    bgFill = _props2.bgFill,
			    bgOpacity = _props2.bgOpacity,
			    bgStroke = _props2.bgStroke,
			    bgStrokeWidth = _props2.bgStrokeWidth,
			    textFill = _props2.textFill,
			    fontFamily = _props2.fontFamily,
			    fontSize = _props2.fontSize,
			    fontWeight = _props2.fontWeight,
			    fontStyle = _props2.fontStyle,
			    text = _props2.text,
			    hoverText = _props2.hoverText,
			    selected = _props2.selected,
			    onDragComplete = _props2.onDragComplete;
			var hover = this.state.hover;


			var hoverHandler = {
				onHover: this.handleHover,
				onUnHover: this.handleHover
			};

			var hoverTextEnabled = hoverText.enable,
			    hoverTextSelected = hoverText.selectedText,
			    hoverTextUnselected = hoverText.text,
			    restHoverTextProps = _objectWithoutProperties(hoverText, ["enable", "selectedText", "text"]);

			return _react2.default.createElement(
				"g",
				null,
				_react2.default.createElement(_InteractiveText2.default, _extends({
					ref: this.saveNodeType("text"),
					selected: selected || hover,
					interactiveCursorClass: "react-stockcharts-move-cursor"
				}, hoverHandler, {

					onDragStart: this.handleDragStart,
					onDrag: this.handleDrag,
					onDragComplete: onDragComplete,
					position: position,
					bgFill: bgFill,
					bgOpacity: bgOpacity,
					bgStroke: bgStroke || textFill,
					bgStrokeWidth: bgStrokeWidth,
					textFill: textFill,
					fontFamily: fontFamily,
					fontStyle: fontStyle,
					fontWeight: fontWeight,
					fontSize: fontSize,
					text: text
				})),
				_react2.default.createElement(_HoverTextNearMouse2.default, _extends({
					show: hoverTextEnabled && hover
				}, restHoverTextProps, {
					text: selected ? hoverTextSelected : hoverTextUnselected
				}))
			);
		}
	}]);

	return EachText;
}(_react.Component);
/*
export function getNewXY(moreProps, snapTo) {
	const { xScale, xAccessor, plotData, mouseXY } = moreProps;

	const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
	const x = xAccessor(currentItem);
	const y = snapTo(currentItem);

	return [x, y];
}
 */


EachText.propTypes = {
	index: _propTypes2.default.number,

	position: _propTypes2.default.array.isRequired,
	bgFill: _propTypes2.default.string.isRequired,
	bgOpacity: _propTypes2.default.number.isRequired,
	bgStrokeWidth: _propTypes2.default.number.isRequired,
	bgStroke: _propTypes2.default.string,
	textFill: _propTypes2.default.string.isRequired,

	fontWeight: _propTypes2.default.string.isRequired,
	fontFamily: _propTypes2.default.string.isRequired,
	fontStyle: _propTypes2.default.string.isRequired,
	fontSize: _propTypes2.default.number.isRequired,

	text: _propTypes2.default.string.isRequired,
	selected: _propTypes2.default.bool.isRequired,

	onDrag: _propTypes2.default.func.isRequired,
	onDragComplete: _propTypes2.default.func.isRequired,

	hoverText: _propTypes2.default.object.isRequired
};

EachText.defaultProps = {
	onDrag: _utils.noop,
	onDragComplete: _utils.noop,
	bgOpacity: 1,
	bgStrokeWidth: 1,
	selected: false,
	fill: "#8AAFE2",
	hoverText: _extends({}, _HoverTextNearMouse2.default.defaultProps, {
		enable: true,
		bgHeight: "auto",
		bgWidth: "auto",
		text: "Click to select object"
	})
};

exports.default = EachText;
//# sourceMappingURL=EachText.js.map