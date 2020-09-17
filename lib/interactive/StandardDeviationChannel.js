"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../utils");

var _utils2 = require("./utils");

var _EachLinearRegressionChannel = require("./wrapper/EachLinearRegressionChannel");

var _EachLinearRegressionChannel2 = _interopRequireDefault(_EachLinearRegressionChannel);

var _MouseLocationIndicator = require("./components/MouseLocationIndicator");

var _MouseLocationIndicator2 = _interopRequireDefault(_MouseLocationIndicator);

var _HoverTextNearMouse = require("./components/HoverTextNearMouse");

var _HoverTextNearMouse2 = _interopRequireDefault(_HoverTextNearMouse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StandardDeviationChannel = function (_Component) {
	_inherits(StandardDeviationChannel, _Component);

	function StandardDeviationChannel(props) {
		_classCallCheck(this, StandardDeviationChannel);

		var _this = _possibleConstructorReturn(this, (StandardDeviationChannel.__proto__ || Object.getPrototypeOf(StandardDeviationChannel)).call(this, props));

		_this.handleStart = _this.handleStart.bind(_this);
		_this.handleEnd = _this.handleEnd.bind(_this);
		_this.handleDrawLine = _this.handleDrawLine.bind(_this);
		_this.handleDragLine = _this.handleDragLine.bind(_this);
		_this.handleDragLineComplete = _this.handleDragLineComplete.bind(_this);

		_this.terminate = _utils2.terminate.bind(_this);
		_this.saveNodeType = _utils2.saveNodeType.bind(_this);

		_this.getSelectionState = (0, _utils2.isHoverForInteractiveType)("channels").bind(_this);

		_this.nodes = [];
		_this.state = {};
		return _this;
	}

	_createClass(StandardDeviationChannel, [{
		key: "handleDragLine",
		value: function handleDragLine(index, newXYValue) {
			this.setState({
				override: _extends({
					index: index
				}, newXYValue)
			});
		}
	}, {
		key: "handleDragLineComplete",
		value: function handleDragLineComplete(moreProps) {
			var _this2 = this;

			var override = this.state.override;
			var channels = this.props.channels;

			if ((0, _utils.isDefined)(override)) {

				var newChannels = channels.map(function (each, idx) {
					return idx === override.index ? _extends({}, each, {
						start: [override.x1Value, override.y1Value],
						end: [override.x2Value, override.y2Value],
						selected: true
					}) : each;
				});
				this.setState({
					override: null
				}, function () {
					_this2.props.onComplete(newChannels, moreProps);
				});
			}
		}
	}, {
		key: "handleDrawLine",
		value: function handleDrawLine(xyValue) {
			var current = this.state.current;


			if ((0, _utils.isDefined)(current) && (0, _utils.isDefined)(current.start)) {
				this.mouseMoved = true;
				this.setState({
					current: {
						start: current.start,
						end: xyValue
					}
				});
			}
		}
	}, {
		key: "handleStart",
		value: function handleStart(xyValue) {
			var _this3 = this;

			var current = this.state.current;


			if ((0, _utils.isNotDefined)(current) || (0, _utils.isNotDefined)(current.start)) {
				this.mouseMoved = false;

				this.setState({
					current: {
						start: xyValue,
						end: null
					}
				}, function () {
					_this3.props.onStart();
				});
			}
		}
	}, {
		key: "handleEnd",
		value: function handleEnd(xyValue, moreProps, e) {
			var _this4 = this;

			var current = this.state.current;
			var _props = this.props,
			    appearance = _props.appearance,
			    channels = _props.channels;


			if (this.mouseMoved && (0, _utils.isDefined)(current) && (0, _utils.isDefined)(current.start)) {
				var newChannels = [].concat(_toConsumableArray(channels.map(function (d) {
					return _extends({}, d, { selected: false });
				})), [{
					start: current.start,
					end: xyValue,
					selected: true,
					appearance: appearance
				}]);

				this.setState({
					current: null
				}, function () {
					_this4.props.onComplete(newChannels, moreProps, e);
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			var appearance = this.props.appearance;
			var _props2 = this.props,
			    enabled = _props2.enabled,
			    snapTo = _props2.snapTo;
			var _props3 = this.props,
			    currentPositionRadius = _props3.currentPositionRadius,
			    currentPositionStroke = _props3.currentPositionStroke;
			var _props4 = this.props,
			    currentPositionOpacity = _props4.currentPositionOpacity,
			    currentPositionStrokeWidth = _props4.currentPositionStrokeWidth;
			var _props5 = this.props,
			    hoverText = _props5.hoverText,
			    channels = _props5.channels;
			var _state = this.state,
			    current = _state.current,
			    override = _state.override;


			var eachDefaultAppearance = _extends({}, StandardDeviationChannel.defaultProps.appearance, appearance);

			var hoverTextDefault = _extends({}, StandardDeviationChannel.defaultProps.hoverText, hoverText);

			var tempLine = (0, _utils.isDefined)(current) && (0, _utils.isDefined)(current.end) ? _react2.default.createElement(_EachLinearRegressionChannel2.default, {
				interactive: false,
				x1Value: current.start[0],
				x2Value: current.end[0],
				appearance: eachDefaultAppearance,
				hoverText: hoverTextDefault
			}) : null;

			return _react2.default.createElement(
				"g",
				null,
				channels.map(function (each, idx) {
					var eachAppearance = (0, _utils.isDefined)(each.appearance) ? _extends({}, eachDefaultAppearance, each.appearance) : eachDefaultAppearance;

					var eachHoverText = (0, _utils.isDefined)(each.hoverText) ? _extends({}, hoverTextDefault, each.hoverText) : hoverTextDefault;

					return _react2.default.createElement(_EachLinearRegressionChannel2.default, { key: idx,
						ref: _this5.saveNodeType(idx),
						index: idx,
						selected: each.selected,

						x1Value: (0, _utils2.getValueFromOverride)(override, idx, "x1Value", each.start[0]),
						x2Value: (0, _utils2.getValueFromOverride)(override, idx, "x2Value", each.end[0]),

						appearance: eachAppearance,
						snapTo: snapTo,
						hoverText: eachHoverText,

						onDrag: _this5.handleDragLine,
						onDragComplete: _this5.handleDragLineComplete,
						edgeInteractiveCursor: "react-stockcharts-move-cursor"
					});
				}),
				tempLine,
				_react2.default.createElement(_MouseLocationIndicator2.default, {
					enabled: enabled,
					snap: true,
					snapTo: snapTo,
					r: currentPositionRadius,
					stroke: currentPositionStroke,
					opacity: currentPositionOpacity,
					strokeWidth: currentPositionStrokeWidth,
					onMouseDown: this.handleStart,
					onClick: this.handleEnd,
					onMouseMove: this.handleDrawLine
				})
			);
		}
	}]);

	return StandardDeviationChannel;
}(_react.Component);

StandardDeviationChannel.propTypes = {
	enabled: _propTypes2.default.bool.isRequired,
	snapTo: _propTypes2.default.func,

	onStart: _propTypes2.default.func,
	onComplete: _propTypes2.default.func.isRequired,
	onSelect: _propTypes2.default.func,

	currentPositionStroke: _propTypes2.default.string,
	currentPositionStrokeWidth: _propTypes2.default.number,
	currentPositionOpacity: _propTypes2.default.number,
	currentPositionRadius: _propTypes2.default.number,

	appearance: _propTypes2.default.shape({
		stroke: _propTypes2.default.string,
		strokeOpacity: _propTypes2.default.number,
		strokeWidth: _propTypes2.default.number,
		fill: _propTypes2.default.string,
		fillOpacity: _propTypes2.default.number,
		edgeStrokeWidth: _propTypes2.default.number,
		edgeStroke: _propTypes2.default.string,
		edgeFill: _propTypes2.default.string,
		r: _propTypes2.default.number
	}).isRequired,

	hoverText: _propTypes2.default.object,
	channels: _propTypes2.default.array.isRequired
};

StandardDeviationChannel.defaultProps = {
	snapTo: function snapTo(d) {
		return d.close;
	},
	appearance: {
		stroke: "#000000",
		fillOpacity: 0.2,
		strokeOpacity: 1,
		strokeWidth: 1,
		fill: "#8AAFE2",
		edgeStrokeWidth: 2,
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		r: 5
	},

	onStart: _utils.noop,
	onComplete: _utils.noop,
	onSelect: _utils.noop,

	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,

	hoverText: _extends({}, _HoverTextNearMouse2.default.defaultProps, {
		enable: true,
		bgHeight: "auto",
		bgWidth: "auto",
		text: "Click and drag the edge circles",
		selectedText: ""
	}),
	channels: []
};

exports.default = StandardDeviationChannel;
//# sourceMappingURL=StandardDeviationChannel.js.map