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

var _ClickableShape = require("../components/ClickableShape");

var _ClickableShape2 = _interopRequireDefault(_ClickableShape);

var _InteractiveYCoordinate = require("../components/InteractiveYCoordinate");

var _InteractiveYCoordinate2 = _interopRequireDefault(_InteractiveYCoordinate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EachInteractiveYCoordinate = function (_Component) {
	_inherits(EachInteractiveYCoordinate, _Component);

	function EachInteractiveYCoordinate(props) {
		_classCallCheck(this, EachInteractiveYCoordinate);

		var _this = _possibleConstructorReturn(this, (EachInteractiveYCoordinate.__proto__ || Object.getPrototypeOf(EachInteractiveYCoordinate)).call(this, props));

		_this.handleHover = _this.handleHover.bind(_this);
		_this.handleCloseIconHover = _this.handleCloseIconHover.bind(_this);

		_this.handleDragStart = _this.handleDragStart.bind(_this);
		_this.handleDrag = _this.handleDrag.bind(_this);

		_this.handleDelete = _this.handleDelete.bind(_this);

		_this.isHover = _utils2.isHover.bind(_this);
		_this.saveNodeType = _utils2.saveNodeType.bind(_this);
		_this.nodes = {};

		_this.state = {
			hover: false,
			closeIconHover: false
		};
		return _this;
	}

	_createClass(EachInteractiveYCoordinate, [{
		key: "handleDragStart",
		value: function handleDragStart(moreProps) {
			var yValue = this.props.yValue;
			var mouseXY = moreProps.mouseXY;
			var yScale = moreProps.chartConfig.yScale;

			var _mouseXY = _slicedToArray(mouseXY, 2),
			    mouseY = _mouseXY[1];

			var dy = mouseY - yScale(yValue);

			this.dragStartPosition = {
				yValue: yValue, dy: dy
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
			    yScale = moreProps.chartConfig.yScale;

			var dy = this.dragStartPosition.dy;


			var newYValue = yScale.invert(mouseY - dy);

			onDrag(index, newYValue);
		}
	}, {
		key: "handleDelete",
		value: function handleDelete(moreProps) {
			var _props2 = this.props,
			    index = _props2.index,
			    onDelete = _props2.onDelete;

			onDelete(index, moreProps);
		}
	}, {
		key: "handleHover",
		value: function handleHover(moreProps) {
			if (this.state.hover !== moreProps.hovering) {
				this.setState({
					hover: moreProps.hovering,
					closeIconHover: moreProps.hovering ? this.state.closeIconHover : false
				});
			}
		}
	}, {
		key: "handleCloseIconHover",
		value: function handleCloseIconHover(moreProps) {
			if (this.state.closeIconHover !== moreProps.hovering) {
				this.setState({
					closeIconHover: moreProps.hovering
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props3 = this.props,
			    yValue = _props3.yValue,
			    bgFill = _props3.bgFill,
			    bgOpacity = _props3.bgOpacity,
			    textFill = _props3.textFill,
			    fontFamily = _props3.fontFamily,
			    fontSize = _props3.fontSize,
			    fontWeight = _props3.fontWeight,
			    fontStyle = _props3.fontStyle,
			    text = _props3.text,
			    selected = _props3.selected,
			    onDragComplete = _props3.onDragComplete,
			    stroke = _props3.stroke,
			    strokeOpacity = _props3.strokeOpacity,
			    strokeDasharray = _props3.strokeDasharray,
			    strokeWidth = _props3.strokeWidth,
			    edge = _props3.edge,
			    textBox = _props3.textBox,
			    draggable = _props3.draggable;
			var _state = this.state,
			    hover = _state.hover,
			    closeIconHover = _state.closeIconHover;


			var hoverHandler = {
				onHover: this.handleHover,
				onUnHover: this.handleHover
			};

			var dragProps = draggable ? {
				onDragStart: this.handleDragStart,
				onDrag: this.handleDrag,
				onDragComplete: onDragComplete
			} : {};
			return _react2.default.createElement(
				"g",
				null,
				_react2.default.createElement(_InteractiveYCoordinate2.default, _extends({
					ref: this.saveNodeType("priceCoordinate"),
					selected: selected && !closeIconHover,
					hovering: hover || closeIconHover,
					interactiveCursorClass: "react-stockcharts-move-cursor"
				}, hoverHandler, dragProps, {

					yValue: yValue,
					bgFill: bgFill,
					bgOpacity: bgOpacity,
					textFill: textFill,
					fontFamily: fontFamily,
					fontStyle: fontStyle,
					fontWeight: fontWeight,
					fontSize: fontSize,
					stroke: stroke,
					strokeOpacity: strokeOpacity,
					strokeDasharray: strokeDasharray,
					strokeWidth: strokeWidth,
					text: text,
					textBox: textBox,
					edge: edge
				})),
				_react2.default.createElement(_ClickableShape2.default, {
					show: true,
					hovering: closeIconHover,
					text: text,
					yValue: yValue,
					fontFamily: fontFamily,
					fontStyle: fontStyle,
					fontWeight: fontWeight,
					fontSize: fontSize,
					textBox: textBox,

					stroke: stroke,
					strokeOpacity: strokeOpacity,

					onHover: this.handleCloseIconHover,
					onUnHover: this.handleCloseIconHover,
					onClick: this.handleDelete
				})
			);
		}
	}]);

	return EachInteractiveYCoordinate;
}(_react.Component);

EachInteractiveYCoordinate.propTypes = {
	index: _propTypes2.default.number,

	draggable: _propTypes2.default.bool.isRequired,
	yValue: _propTypes2.default.number.isRequired,

	bgFill: _propTypes2.default.string.isRequired,
	bgOpacity: _propTypes2.default.number.isRequired,
	stroke: _propTypes2.default.string.isRequired,
	strokeWidth: _propTypes2.default.number.isRequired,
	strokeOpacity: _propTypes2.default.number.isRequired,
	strokeDasharray: _propTypes2.default.string.isRequired,
	textFill: _propTypes2.default.string.isRequired,

	fontWeight: _propTypes2.default.string.isRequired,
	fontFamily: _propTypes2.default.string.isRequired,
	fontStyle: _propTypes2.default.string.isRequired,
	fontSize: _propTypes2.default.number.isRequired,

	text: _propTypes2.default.string.isRequired,
	selected: _propTypes2.default.bool.isRequired,

	edge: _propTypes2.default.object.isRequired,
	textBox: _propTypes2.default.object.isRequired,

	onDrag: _propTypes2.default.func.isRequired,
	onDragComplete: _propTypes2.default.func.isRequired,
	onDelete: _propTypes2.default.func.isRequired
};

EachInteractiveYCoordinate.defaultProps = {
	onDrag: _utils.noop,
	onDragComplete: _utils.noop,

	strokeWidth: 1,
	opacity: 1,
	selected: false,
	fill: "#FFFFFF",
	draggable: false
};

exports.default = EachInteractiveYCoordinate;
//# sourceMappingURL=EachInteractiveYCoordinate.js.map