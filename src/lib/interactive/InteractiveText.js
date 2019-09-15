"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../utils");

var _utils2 = require("./utils");

var _EachText = require("./wrapper/EachText");

var _EachText2 = _interopRequireDefault(_EachText);

var _HoverTextNearMouse = require("./components/HoverTextNearMouse");

var _HoverTextNearMouse2 = _interopRequireDefault(_HoverTextNearMouse);

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InteractiveText = function (_Component) {
	_inherits(InteractiveText, _Component);

	function InteractiveText(props) {
		_classCallCheck(this, InteractiveText);

		var _this = _possibleConstructorReturn(this, (InteractiveText.__proto__ || Object.getPrototypeOf(InteractiveText)).call(this, props));

		_this.handleDraw = _this.handleDraw.bind(_this);
		_this.handleDrag = _this.handleDrag.bind(_this);
		_this.handleDragComplete = _this.handleDragComplete.bind(_this);
		_this.terminate = _utils2.terminate.bind(_this);

		_this.saveNodeType = _utils2.saveNodeType.bind(_this);
		_this.getSelectionState = (0, _utils2.isHoverForInteractiveType)("textList").bind(_this);

		_this.nodes = [];
		_this.state = {};
		return _this;
	}

	_createClass(InteractiveText, [{
		key: "handleDrag",
		value: function handleDrag(index, position) {
			this.setState({
				override: {
					index: index,
					position: position
				}
			});
		}
	}, {
		key: "handleDragComplete",
		value: function handleDragComplete(moreProps) {
			var _this2 = this;

			var override = this.state.override;

			if ((0, _utils.isDefined)(override)) {
				var textList = this.props.textList;

				var newTextList = textList.map(function (each, idx) {
					var selected = idx === override.index;
					return selected ? _extends({}, each, {
						position: override.position,
						selected: selected
					}) : _extends({}, each, {
						selected: selected
					});
				});
				this.setState({
					override: null
				}, function () {
					_this2.props.onDragComplete(newTextList, moreProps);
				});
			}
		}
	}, {
		key: "handleDrawLine",
		value: function handleDrawLine(xyValue) {
			var current = this.state.current;


			if ((0, _utils.isDefined)(current) && (0, _utils.isDefined)(current.start)) {
				this.setState({
					current: {
						start: current.start,
						end: xyValue
					}
				});
			}
		}
	}, {
		key: "handleDraw",
		value: function handleDraw(moreProps, e) {
			var enabled = this.props.enabled;

			if (enabled) {
				var _moreProps$mouseXY = _slicedToArray(moreProps.mouseXY, 2),
				    mouseY = _moreProps$mouseXY[1],
				    yScale = moreProps.chartConfig.yScale,
				    xAccessor = moreProps.xAccessor,
				    currentItem = moreProps.currentItem;

				var xyValue = [xAccessor(currentItem), yScale.invert(mouseY)];

				var _props = this.props,
				    defaultText = _props.defaultText,
				    onChoosePosition = _props.onChoosePosition;


				var newText = _extends({}, defaultText, {
					position: xyValue
				});
				onChoosePosition(newText, moreProps, e);
			} /*  else {
     this.handleClick(moreProps, e);
     } */
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			var _props2 = this.props,
			    textList = _props2.textList,
			    defaultText = _props2.defaultText,
			    hoverText = _props2.hoverText;
			var override = this.state.override;

			return _react2.default.createElement(
				"g",
				null,
				textList.map(function (each, idx) {
					var defaultHoverText = InteractiveText.defaultProps.hoverText;
					var props = _extends({}, defaultText, each, {
						hoverText: _extends({}, defaultHoverText, hoverText, each.hoverText || {})
					});
					return _react2.default.createElement(_EachText2.default, _extends({ key: idx,
						ref: _this3.saveNodeType(idx),
						index: idx
					}, props, {
						selected: each.selected,
						position: (0, _utils2.getValueFromOverride)(override, idx, "position", each.position),

						onDrag: _this3.handleDrag,
						onDragComplete: _this3.handleDragComplete,
						edgeInteractiveCursor: "react-stockcharts-move-cursor"
					}));
				}),
				_react2.default.createElement(_GenericChartComponent2.default, {

					onClick: this.handleDraw,

					svgDraw: _utils.noop,
					canvasDraw: _utils.noop,
					canvasToDraw: _GenericComponent.getMouseCanvas,

					drawOn: ["mousemove", "pan"]
				}),
				";"
			);
		}
	}]);

	return InteractiveText;
}(_react.Component);

InteractiveText.propTypes = {
	onChoosePosition: _propTypes2.default.func.isRequired,
	onDragComplete: _propTypes2.default.func.isRequired,
	onSelect: _propTypes2.default.func,

	defaultText: _propTypes2.default.shape({
		bgFill: _propTypes2.default.string.isRequired,
		bgOpacity: _propTypes2.default.number.isRequired,
		bgStrokeWidth: _propTypes2.default.number,
		bgStroke: _propTypes2.default.string,
		textFill: _propTypes2.default.string.isRequired,
		fontFamily: _propTypes2.default.string.isRequired,
		fontWeight: _propTypes2.default.string.isRequired,
		fontStyle: _propTypes2.default.string.isRequired,
		fontSize: _propTypes2.default.number.isRequired,
		text: _propTypes2.default.string.isRequired
	}).isRequired,

	hoverText: _propTypes2.default.object.isRequired,
	textList: _propTypes2.default.array.isRequired,
	enabled: _propTypes2.default.bool.isRequired
};

InteractiveText.defaultProps = {
	onChoosePosition: _utils.noop,
	onDragComplete: _utils.noop,
	onSelect: _utils.noop,

	defaultText: {
		bgFill: "#D3D3D3",
		bgOpacity: 1,
		bgStrokeWidth: 1,
		textFill: "#F10040",
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		text: "Lorem ipsum..."
	},
	hoverText: _extends({}, _HoverTextNearMouse2.default.defaultProps, {
		enable: true,
		bgHeight: "auto",
		bgWidth: "auto",
		text: "Click to select object",
		selectedText: ""
	}),
	textList: []
};

InteractiveText.contextTypes = {
	subscribe: _propTypes2.default.func.isRequired,
	unsubscribe: _propTypes2.default.func.isRequired,
	generateSubscriptionId: _propTypes2.default.func.isRequired,
	chartId: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired
};

exports.default = InteractiveText;
//# sourceMappingURL=InteractiveText.js.map