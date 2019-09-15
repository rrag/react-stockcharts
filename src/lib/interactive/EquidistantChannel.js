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

var _EachEquidistantChannel = require("./wrapper/EachEquidistantChannel");

var _EachEquidistantChannel2 = _interopRequireDefault(_EachEquidistantChannel);

var _StraightLine = require("./components/StraightLine");

var _MouseLocationIndicator = require("./components/MouseLocationIndicator");

var _MouseLocationIndicator2 = _interopRequireDefault(_MouseLocationIndicator);

var _HoverTextNearMouse = require("./components/HoverTextNearMouse");

var _HoverTextNearMouse2 = _interopRequireDefault(_HoverTextNearMouse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EquidistantChannel = function (_Component) {
	_inherits(EquidistantChannel, _Component);

	function EquidistantChannel(props) {
		_classCallCheck(this, EquidistantChannel);

		var _this = _possibleConstructorReturn(this, (EquidistantChannel.__proto__ || Object.getPrototypeOf(EquidistantChannel)).call(this, props));

		_this.handleStart = _this.handleStart.bind(_this);
		_this.handleEnd = _this.handleEnd.bind(_this);
		_this.handleDrawChannel = _this.handleDrawChannel.bind(_this);
		_this.handleDragChannel = _this.handleDragChannel.bind(_this);
		_this.handleDragChannelComplete = _this.handleDragChannelComplete.bind(_this);

		_this.terminate = _utils2.terminate.bind(_this);
		_this.saveNodeType = _utils2.saveNodeType.bind(_this);

		_this.getSelectionState = (0, _utils2.isHoverForInteractiveType)("channels").bind(_this);

		_this.nodes = [];
		_this.state = {};
		return _this;
	}

	_createClass(EquidistantChannel, [{
		key: "handleDragChannel",
		value: function handleDragChannel(index, newXYValue) {
			this.setState({
				override: _extends({
					index: index
				}, newXYValue)
			});
		}
	}, {
		key: "handleDragChannelComplete",
		value: function handleDragChannelComplete(moreProps) {
			var _this2 = this;

			var override = this.state.override;
			var channels = this.props.channels;


			if ((0, _utils.isDefined)(override)) {
				var index = override.index,
				    rest = _objectWithoutProperties(override, ["index"]);

				var newChannels = channels.map(function (each, idx) {
					return idx === index ? _extends({}, each, rest, { selected: true }) : each;
				});
				this.setState({
					override: null
				}, function () {
					_this2.props.onComplete(newChannels, moreProps);
				});
			}
		}
	}, {
		key: "handleDrawChannel",
		value: function handleDrawChannel(xyValue) {
			var current = this.state.current;


			if ((0, _utils.isDefined)(current) && (0, _utils.isDefined)(current.startXY)) {
				this.mouseMoved = true;
				if ((0, _utils.isNotDefined)(current.dy)) {
					this.setState({
						current: {
							startXY: current.startXY,
							endXY: xyValue
						}
					});
				} else {
					var m = (0, _StraightLine.getSlope)(current.startXY, current.endXY);
					var b = (0, _StraightLine.getYIntercept)(m, current.endXY);
					var y = m * xyValue[0] + b;
					var dy = xyValue[1] - y;

					this.setState({
						current: _extends({}, current, {
							dy: dy
						})
					});
				}
			}
		}
	}, {
		key: "handleStart",
		value: function handleStart(xyValue) {
			var _this3 = this;

			var current = this.state.current;


			if ((0, _utils.isNotDefined)(current) || (0, _utils.isNotDefined)(current.startXY)) {
				this.mouseMoved = false;
				this.setState({
					current: {
						startXY: xyValue,
						endXY: null
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
			    channels = _props.channels,
			    appearance = _props.appearance;


			if (this.mouseMoved && (0, _utils.isDefined)(current) && (0, _utils.isDefined)(current.startXY)) {

				if ((0, _utils.isNotDefined)(current.dy)) {
					this.setState({
						current: _extends({}, current, {
							dy: 0
						})
					});
				} else {
					var newChannels = [].concat(_toConsumableArray(channels.map(function (d) {
						return _extends({}, d, { selected: false });
					})), [_extends({}, current, { selected: true,
						appearance: appearance
					})]);

					this.setState({
						current: null
					}, function () {

						_this4.props.onComplete(newChannels, moreProps, e);
					});
				}
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			var appearance = this.props.appearance;
			var enabled = this.props.enabled;
			var _props2 = this.props,
			    currentPositionRadius = _props2.currentPositionRadius,
			    currentPositionStroke = _props2.currentPositionStroke;
			var _props3 = this.props,
			    currentPositionOpacity = _props3.currentPositionOpacity,
			    currentPositionStrokeWidth = _props3.currentPositionStrokeWidth;
			var _props4 = this.props,
			    channels = _props4.channels,
			    hoverText = _props4.hoverText;
			var _state = this.state,
			    current = _state.current,
			    override = _state.override;

			var overrideIndex = (0, _utils.isDefined)(override) ? override.index : null;

			var tempChannel = (0, _utils.isDefined)(current) && (0, _utils.isDefined)(current.endXY) ? _react2.default.createElement(_EachEquidistantChannel2.default, _extends({
				interactive: false
			}, current, {
				appearance: appearance,
				hoverText: hoverText })) : null;

			return _react2.default.createElement(
				"g",
				null,
				channels.map(function (each, idx) {
					var eachAppearance = (0, _utils.isDefined)(each.appearance) ? _extends({}, appearance, each.appearance) : appearance;

					return _react2.default.createElement(_EachEquidistantChannel2.default, _extends({ key: idx,
						ref: _this5.saveNodeType(idx),
						index: idx,
						selected: each.selected,
						hoverText: hoverText
					}, idx === overrideIndex ? override : each, {
						appearance: eachAppearance,
						onDrag: _this5.handleDragChannel,
						onDragComplete: _this5.handleDragChannelComplete
					}));
				}),
				tempChannel,
				_react2.default.createElement(_MouseLocationIndicator2.default, {
					enabled: enabled,
					snap: false,
					r: currentPositionRadius,
					stroke: currentPositionStroke,
					opacity: currentPositionOpacity,
					strokeWidth: currentPositionStrokeWidth,
					onMouseDown: this.handleStart,
					onClick: this.handleEnd,
					onMouseMove: this.handleDrawChannel })
			);
		}
	}]);

	return EquidistantChannel;
}(_react.Component);

EquidistantChannel.propTypes = {
	enabled: _propTypes2.default.bool.isRequired,

	onStart: _propTypes2.default.func.isRequired,
	onComplete: _propTypes2.default.func.isRequired,
	onSelect: _propTypes2.default.func.isRequired,

	currentPositionStroke: _propTypes2.default.string,
	currentPositionStrokeWidth: _propTypes2.default.number,
	currentPositionOpacity: _propTypes2.default.number,
	currentPositionRadius: _propTypes2.default.number,

	hoverText: _propTypes2.default.object.isRequired,
	channels: _propTypes2.default.array.isRequired,

	appearance: _propTypes2.default.shape({
		stroke: _propTypes2.default.string.isRequired,
		strokeOpacity: _propTypes2.default.number.isRequired,
		strokeWidth: _propTypes2.default.number.isRequired,
		fill: _propTypes2.default.string.isRequired,
		fillOpacity: _propTypes2.default.number.isRequired,
		edgeStroke: _propTypes2.default.string.isRequired,
		edgeFill: _propTypes2.default.string.isRequired,
		edgeFill2: _propTypes2.default.string.isRequired,
		edgeStrokeWidth: _propTypes2.default.number.isRequired,
		r: _propTypes2.default.number.isRequired
	}).isRequired
};

EquidistantChannel.defaultProps = {
	onStart: _utils.noop,
	onComplete: _utils.noop,
	onSelect: _utils.noop,

	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,

	hoverText: _extends({}, _HoverTextNearMouse2.default.defaultProps, {
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object"
	}),
	channels: [],
	appearance: {
		stroke: "#000000",
		strokeOpacity: 1,
		strokeWidth: 1,
		fill: "#8AAFE2",
		fillOpacity: 0.7,
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		edgeFill2: "#250B98",
		edgeStrokeWidth: 1,
		r: 5
	}
};

exports.default = EquidistantChannel;
//# sourceMappingURL=EquidistantChannel.js.map