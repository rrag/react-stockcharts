"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Selection = require("d3-selection");

var _d3Array = require("d3-array");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AxisZoomCapture = function (_Component) {
	_inherits(AxisZoomCapture, _Component);

	function AxisZoomCapture(props) {
		_classCallCheck(this, AxisZoomCapture);

		var _this = _possibleConstructorReturn(this, (AxisZoomCapture.__proto__ || Object.getPrototypeOf(AxisZoomCapture)).call(this, props));

		_this.handleDragStartMouse = _this.handleDragStartMouse.bind(_this);
		_this.handleDragStartTouch = _this.handleDragStartTouch.bind(_this);
		_this.handleDrag = _this.handleDrag.bind(_this);
		_this.handleDragEnd = _this.handleDragEnd.bind(_this);
		_this.handleRightClick = _this.handleRightClick.bind(_this);
		_this.saveNode = _this.saveNode.bind(_this);
		_this.state = {
			startPosition: null
		};
		return _this;
	}

	_createClass(AxisZoomCapture, [{
		key: "saveNode",
		value: function saveNode(node) {
			this.node = node;
		}
	}, {
		key: "handleRightClick",
		value: function handleRightClick(e) {
			e.stopPropagation();
			e.preventDefault();

			var onContextMenu = this.props.onContextMenu;


			var mouseXY = (0, _utils.mousePosition)(e, this.node.getBoundingClientRect());

			(0, _d3Selection.select)((0, _utils.d3Window)(this.node)).on(_utils.MOUSEMOVE, null).on(_utils.MOUSEUP, null);
			this.setState({
				startPosition: null
			});

			onContextMenu(mouseXY, e);

			this.contextMenuClicked = true;
		}
	}, {
		key: "handleDragStartMouse",
		value: function handleDragStartMouse(e) {
			this.mouseInteraction = true;

			var _props = this.props,
			    getScale = _props.getScale,
			    getMoreProps = _props.getMoreProps;

			var startScale = getScale(getMoreProps());
			this.dragHappened = false;

			if (startScale.invert) {
				(0, _d3Selection.select)((0, _utils.d3Window)(this.node)).on(_utils.MOUSEMOVE, this.handleDrag, false).on(_utils.MOUSEUP, this.handleDragEnd, false);

				var startXY = (0, _utils.mousePosition)(e);

				this.setState({
					startPosition: {
						startXY: startXY,
						startScale: startScale
					}
				});
			}
			e.preventDefault();
		}
	}, {
		key: "handleDragStartTouch",
		value: function handleDragStartTouch(e) {
			this.mouseInteraction = false;

			var _props2 = this.props,
			    getScale = _props2.getScale,
			    getMoreProps = _props2.getMoreProps;

			var startScale = getScale(getMoreProps());
			this.dragHappened = false;

			if (e.touches.length === 1 && startScale.invert) {
				(0, _d3Selection.select)((0, _utils.d3Window)(this.node)).on(_utils.TOUCHMOVE, this.handleDrag).on(_utils.TOUCHEND, this.handleDragEnd);

				var startXY = (0, _utils.touchPosition)((0, _utils.getTouchProps)(e.touches[0]), e);

				this.setState({
					startPosition: {
						startXY: startXY,
						startScale: startScale
					}
				});
			}
		}
	}, {
		key: "handleDrag",
		value: function handleDrag() {
			var startPosition = this.state.startPosition;
			var _props3 = this.props,
			    getMouseDelta = _props3.getMouseDelta,
			    inverted = _props3.inverted;


			this.dragHappened = true;
			if ((0, _utils.isDefined)(startPosition)) {
				var startScale = startPosition.startScale;
				var startXY = startPosition.startXY;


				var mouseXY = this.mouseInteraction ? (0, _d3Selection.mouse)(this.node) : (0, _d3Selection.touches)(this.node)[0];

				var diff = getMouseDelta(startXY, mouseXY);

				var center = (0, _d3Array.mean)(startScale.range());

				var tempRange = startScale.range().map(function (d) {
					return inverted ? d - (0, _utils.sign)(d - center) * diff : d + (0, _utils.sign)(d - center) * diff;
				});

				var newDomain = tempRange.map(startScale.invert);

				if ((0, _utils.sign)((0, _utils.last)(startScale.range()) - (0, _utils.first)(startScale.range())) === (0, _utils.sign)((0, _utils.last)(tempRange) - (0, _utils.first)(tempRange))) {
					var axisZoomCallback = this.props.axisZoomCallback;
					// console.log(startXScale.domain(), newXDomain)

					axisZoomCallback(newDomain);
				}
			}
		}
	}, {
		key: "handleDragEnd",
		value: function handleDragEnd() {
			var _this2 = this;

			if (!this.dragHappened) {
				if (this.clicked) {
					var e = _d3Selection.event;
					var mouseXY = this.mouseInteraction ? (0, _d3Selection.mouse)(this.node) : (0, _d3Selection.touches)(this.node)[0];
					var onDoubleClick = this.props.onDoubleClick;


					onDoubleClick(mouseXY, e);
				} else {
					this.clicked = true;
					setTimeout(function () {
						_this2.clicked = false;
					}, 300);
				}
			}

			(0, _d3Selection.select)((0, _utils.d3Window)(this.node)).on(_utils.MOUSEMOVE, null).on(_utils.MOUSEUP, null).on(_utils.TOUCHMOVE, null).on(_utils.TOUCHEND, null);

			this.setState({
				startPosition: null
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _props4 = this.props,
			    bg = _props4.bg,
			    className = _props4.className,
			    zoomCursorClassName = _props4.zoomCursorClassName;


			var cursor = (0, _utils.isDefined)(this.state.startPosition) ? zoomCursorClassName : "react-stockcharts-default-cursor";

			return _react2.default.createElement("rect", {
				className: "react-stockcharts-enable-interaction " + cursor + " " + className,
				ref: this.saveNode,
				x: bg.x, y: bg.y, opacity: 0, height: bg.h, width: bg.w,
				onContextMenu: this.handleRightClick,
				onMouseDown: this.handleDragStartMouse,
				onTouchStart: this.handleDragStartTouch
			});
		}
	}]);

	return AxisZoomCapture;
}(_react.Component);

AxisZoomCapture.propTypes = {
	innerTickSize: _propTypes2.default.number,
	outerTickSize: _propTypes2.default.number,
	tickFormat: _propTypes2.default.func,
	tickPadding: _propTypes2.default.number,
	tickSize: _propTypes2.default.number,
	ticks: _propTypes2.default.number,
	tickValues: _propTypes2.default.array,
	showDomain: _propTypes2.default.bool,
	showTicks: _propTypes2.default.bool,
	className: _propTypes2.default.string,
	axisZoomCallback: _propTypes2.default.func,
	inverted: _propTypes2.default.bool,
	bg: _propTypes2.default.object.isRequired,
	zoomCursorClassName: _propTypes2.default.string.isRequired,
	getMoreProps: _propTypes2.default.func.isRequired,
	getScale: _propTypes2.default.func.isRequired,
	getMouseDelta: _propTypes2.default.func.isRequired,
	onDoubleClick: _propTypes2.default.func.isRequired,
	onContextMenu: _propTypes2.default.func.isRequired
};

AxisZoomCapture.defaultProps = {
	onDoubleClick: _utils.noop,
	onContextMenu: _utils.noop,
	inverted: true
};

exports.default = AxisZoomCapture;
//# sourceMappingURL=AxisZoomCapture.js.map