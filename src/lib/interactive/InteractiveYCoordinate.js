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

var _d3Format = require("d3-format");

var _utils = require("../utils");

var _utils2 = require("./utils");

var _EachInteractiveYCoordinate = require("./wrapper/EachInteractiveYCoordinate");

var _EachInteractiveYCoordinate2 = _interopRequireDefault(_EachInteractiveYCoordinate);

var _HoverTextNearMouse = require("./components/HoverTextNearMouse");

var _HoverTextNearMouse2 = _interopRequireDefault(_HoverTextNearMouse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InteractiveYCoordinate = function (_Component) {
	_inherits(InteractiveYCoordinate, _Component);

	function InteractiveYCoordinate(props) {
		_classCallCheck(this, InteractiveYCoordinate);

		var _this = _possibleConstructorReturn(this, (InteractiveYCoordinate.__proto__ || Object.getPrototypeOf(InteractiveYCoordinate)).call(this, props));

		_this.handleDrag = _this.handleDrag.bind(_this);
		_this.handleDragComplete = _this.handleDragComplete.bind(_this);
		_this.handleDelete = _this.handleDelete.bind(_this);
		_this.terminate = _utils2.terminate.bind(_this);

		_this.saveNodeType = _utils2.saveNodeType.bind(_this);
		_this.getSelectionState = (0, _utils2.isHoverForInteractiveType)("yCoordinateList").bind(_this);

		_this.nodes = [];
		_this.state = {};
		return _this;
	}

	_createClass(InteractiveYCoordinate, [{
		key: "handleDrag",
		value: function handleDrag(index, yValue) {
			this.setState({
				override: {
					index: index,
					yValue: yValue
				}
			});
		}
	}, {
		key: "handleDragComplete",
		value: function handleDragComplete(moreProps) {
			var _this2 = this;

			var override = this.state.override;

			if ((0, _utils.isDefined)(override)) {
				var yCoordinateList = this.props.yCoordinateList;

				var newAlertList = yCoordinateList.map(function (each, idx) {
					var selected = idx === override.index;
					return selected ? _extends({}, each, {
						yValue: override.yValue,
						selected: selected
					}) : _extends({}, each, {
						selected: selected
					});
				});
				var draggedAlert = newAlertList[override.index];
				this.setState({
					override: null
				}, function () {
					_this2.props.onDragComplete(newAlertList, moreProps, draggedAlert);
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
		key: "handleDelete",
		value: function handleDelete(index, moreProps) {
			var _props = this.props,
			    onDelete = _props.onDelete,
			    yCoordinateList = _props.yCoordinateList;

			onDelete(yCoordinateList[index], moreProps);
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			var yCoordinateList = this.props.yCoordinateList;
			var override = this.state.override;

			return _react2.default.createElement(
				"g",
				null,
				yCoordinateList.map(function (each, idx) {
					var props = each;
					return _react2.default.createElement(_EachInteractiveYCoordinate2.default, _extends({ key: each.id,
						ref: _this3.saveNodeType(idx),
						index: idx
					}, props, {
						selected: each.selected,
						yValue: (0, _utils2.getValueFromOverride)(override, idx, "yValue", each.yValue),

						onDelete: _this3.handleDelete,
						onDrag: _this3.handleDrag,
						onDragComplete: _this3.handleDragComplete,
						edgeInteractiveCursor: "react-stockcharts-move-cursor"
					}));
				})
			);
		}
	}]);

	return InteractiveYCoordinate;
}(_react.Component);

InteractiveYCoordinate.propTypes = {
	onChoosePosition: _propTypes2.default.func.isRequired,
	onDragComplete: _propTypes2.default.func.isRequired,
	onSelect: _propTypes2.default.func,
	onDelete: _propTypes2.default.func,

	defaultPriceCoordinate: _propTypes2.default.shape({
		bgFill: _propTypes2.default.string.isRequired,
		bgOpacity: _propTypes2.default.number.isRequired,

		stroke: _propTypes2.default.string.isRequired,
		strokeDasharray: _propTypes2.default.oneOf(_utils.strokeDashTypes).isRequired,
		strokeOpacity: _propTypes2.default.number.isRequired,
		strokeWidth: _propTypes2.default.number.isRequired,

		textFill: _propTypes2.default.string.isRequired,
		fontFamily: _propTypes2.default.string.isRequired,
		fontWeight: _propTypes2.default.string.isRequired,
		fontStyle: _propTypes2.default.string.isRequired,
		fontSize: _propTypes2.default.number.isRequired,
		text: _propTypes2.default.string.isRequired,

		textBox: _propTypes2.default.shape({
			height: _propTypes2.default.number.isRequired,
			left: _propTypes2.default.number.isRequired,
			padding: _propTypes2.default.shape({
				left: _propTypes2.default.number.isRequired,
				right: _propTypes2.default.number.isRequired
			}),
			closeIcon: _propTypes2.default.shape({
				padding: _propTypes2.default.shape({
					left: _propTypes2.default.number.isRequired,
					right: _propTypes2.default.number.isRequired
				}),
				width: _propTypes2.default.number.isRequired
			})
		}).isRequired,
		edge: _propTypes2.default.shape({
			stroke: _propTypes2.default.string.isRequired,
			strokeOpacity: _propTypes2.default.number.isRequired,
			strokeWidth: _propTypes2.default.number.isRequired,

			fill: _propTypes2.default.string.isRequired,
			fillOpacity: _propTypes2.default.number.isRequired
		})
	}).isRequired,

	hoverText: _propTypes2.default.object.isRequired,
	yCoordinateList: _propTypes2.default.array.isRequired,
	enabled: _propTypes2.default.bool.isRequired
};

InteractiveYCoordinate.defaultProps = {
	onChoosePosition: _utils.noop,
	onDragComplete: _utils.noop,
	onSelect: _utils.noop,
	onDelete: _utils.noop,

	defaultPriceCoordinate: {
		bgFill: "#FFFFFF",
		bgOpacity: 1,

		stroke: "#6574CD",
		strokeOpacity: 1,
		strokeDasharray: "ShortDash2",
		strokeWidth: 1,

		textFill: "#6574CD",
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		text: "Alert",
		textBox: {
			height: 24,
			left: 20,
			padding: { left: 10, right: 5 },
			closeIcon: {
				padding: { left: 5, right: 8 },
				width: 8
			}
		},
		edge: {
			stroke: "#6574CD",
			strokeOpacity: 1,
			strokeWidth: 1,

			fill: "#FFFFFF",
			fillOpacity: 1,
			orient: "right",
			at: "right",
			arrowWidth: 10,
			dx: 0,
			rectWidth: 50,
			rectHeight: 20,
			displayFormat: (0, _d3Format.format)(".2f")
		}
	},
	hoverText: _extends({}, _HoverTextNearMouse2.default.defaultProps, {
		enable: true,
		bgHeight: 18,
		bgWidth: 175,
		text: "Click and drag the edge circles"
	}),
	yCoordinateList: []
};

InteractiveYCoordinate.contextTypes = {
	subscribe: _propTypes2.default.func.isRequired,
	unsubscribe: _propTypes2.default.func.isRequired,
	generateSubscriptionId: _propTypes2.default.func.isRequired,
	chartId: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired
};

exports.default = InteractiveYCoordinate;
//# sourceMappingURL=InteractiveYCoordinate.js.map