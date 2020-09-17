"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../utils");

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Brush = function (_Component) {
	_inherits(Brush, _Component);

	function Brush(props, context) {
		_classCallCheck(this, Brush);

		var _this = _possibleConstructorReturn(this, (Brush.__proto__ || Object.getPrototypeOf(Brush)).call(this, props, context));

		_this.handleZoomStart = _this.handleZoomStart.bind(_this);
		_this.handleDrawSquare = _this.handleDrawSquare.bind(_this);
		_this.handleZoomComplete = _this.handleZoomComplete.bind(_this);

		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.saveNode = _this.saveNode.bind(_this);
		_this.terminate = _this.terminate.bind(_this);
		_this.state = {
			rect: null
		};
		return _this;
	}

	_createClass(Brush, [{
		key: "terminate",
		value: function terminate() {
			this.zoomHappening = false;
			this.setState({
				x1y1: null,
				start: null,
				end: null,
				rect: null
			});
		}
	}, {
		key: "saveNode",
		value: function saveNode(node) {
			this.node = node;
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx) {
			var rect = this.state.rect;

			if ((0, _utils.isDefined)(rect)) {
				var x = rect.x,
				    y = rect.y,
				    height = rect.height,
				    width = rect.width;
				var _props = this.props,
				    stroke = _props.stroke,
				    fill = _props.fill,
				    strokeDashArray = _props.strokeDashArray;
				var _props2 = this.props,
				    strokeOpacity = _props2.strokeOpacity,
				    fillOpacity = _props2.fillOpacity;


				var dashArray = (0, _utils.getStrokeDasharray)(strokeDashArray).split(",").map(function (d) {
					return +d;
				});

				ctx.strokeStyle = (0, _utils.hexToRGBA)(stroke, strokeOpacity);
				ctx.fillStyle = (0, _utils.hexToRGBA)(fill, fillOpacity);
				ctx.setLineDash(dashArray);
				ctx.beginPath();
				ctx.fillRect(x, y, width, height);
				ctx.strokeRect(x, y, width, height);
			}
		}
	}, {
		key: "renderSVG",
		value: function renderSVG() {
			var rect = this.state.rect;

			if ((0, _utils.isDefined)(rect)) {
				var x = rect.x,
				    y = rect.y,
				    height = rect.height,
				    width = rect.width;
				var _props3 = this.props,
				    stroke = _props3.stroke,
				    strokeDashArray = _props3.strokeDashArray;
				var _props4 = this.props,
				    strokeOpacity = _props4.strokeOpacity,
				    fillOpacity = _props4.fillOpacity;


				var dashArray = (0, _utils.getStrokeDasharray)(strokeDashArray).split(",").map(function (d) {
					return +d;
				});

				return _react2.default.createElement("rect", { strokeDasharray: dashArray,
					stroke: stroke,
					fill: "none",
					strokeOpacity: strokeOpacity,
					fillOpacity: fillOpacity,
					x: x,
					y: y,
					width: width,
					height: height
				});
			}
		}
	}, {
		key: "handleZoomStart",
		value: function handleZoomStart(moreProps) {
			this.zoomHappening = false;

			var _moreProps$mouseXY = _slicedToArray(moreProps.mouseXY, 2),
			    mouseY = _moreProps$mouseXY[1],
			    currentItem = moreProps.currentItem,
			    yScale = moreProps.chartConfig.yScale,
			    xAccessor = moreProps.xAccessor,
			    xScale = moreProps.xScale;

			var x1y1 = [xScale(xAccessor(currentItem)), mouseY];

			this.setState({
				selected: true,
				x1y1: x1y1,
				start: {
					item: currentItem,
					xValue: xAccessor(currentItem),
					yValue: yScale.invert(mouseY)
				}
			});
		}
	}, {
		key: "handleDrawSquare",
		value: function handleDrawSquare(moreProps) {
			if (this.state.x1y1 == null) return;

			this.zoomHappening = true;

			var _moreProps$mouseXY2 = _slicedToArray(moreProps.mouseXY, 2),
			    mouseY = _moreProps$mouseXY2[1],
			    currentItem = moreProps.currentItem,
			    yScale = moreProps.chartConfig.yScale,
			    xAccessor = moreProps.xAccessor,
			    xScale = moreProps.xScale;

			var _ref = [xScale(xAccessor(currentItem)), mouseY],
			    x2 = _ref[0],
			    y2 = _ref[1];

			var _state$x1y = _slicedToArray(this.state.x1y1, 2),
			    x1 = _state$x1y[0],
			    y1 = _state$x1y[1];

			var x = Math.min(x1, x2);
			var y = Math.min(y1, y2);
			var height = Math.abs(y2 - y1);
			var width = Math.abs(x2 - x1);

			this.setState({
				selected: true,
				end: {
					item: currentItem,
					xValue: xAccessor(currentItem),
					yValue: yScale.invert(mouseY)
				},
				rect: {
					x: x, y: y, height: height, width: width
				}
			});
		}
	}, {
		key: "handleZoomComplete",
		value: function handleZoomComplete(moreProps) {
			if (this.zoomHappening) {
				var onBrush = this.props.onBrush;
				var _state = this.state,
				    start = _state.start,
				    end = _state.end;

				onBrush({ start: start, end: end }, moreProps);
			}
			this.setState({
				selected: false,
				rect: null
			});
		}
	}, {
		key: "render",
		value: function render() {
			var enabled = this.props.enabled;

			if (!enabled) return null;

			return _react2.default.createElement(_GenericChartComponent2.default, {
				ref: this.saveNode,
				disablePan: enabled,

				svgDraw: this.renderSVG,
				canvasToDraw: _GenericComponent.getMouseCanvas,
				canvasDraw: this.drawOnCanvas,

				onMouseDown: this.handleZoomStart,
				onMouseMove: this.handleDrawSquare,
				onClick: this.handleZoomComplete,

				drawOn: ["mousemove", "pan", "drag"]
			});
		}
	}]);

	return Brush;
}(_react.Component);

Brush.propTypes = {
	enabled: _propTypes2.default.bool.isRequired,
	onStart: _propTypes2.default.func.isRequired,
	onBrush: _propTypes2.default.func.isRequired,

	type: _propTypes2.default.oneOf(["1D", "2D"]),
	stroke: _propTypes2.default.string,
	fill: _propTypes2.default.string,
	strokeOpacity: _propTypes2.default.number,
	fillOpacity: _propTypes2.default.number,
	interactiveState: _propTypes2.default.object,
	strokeDashArray: _propTypes2.default.string
};

Brush.defaultProps = {
	type: "2D",
	stroke: "#000000",
	fillOpacity: 0.3,
	strokeOpacity: 1,
	fill: "#3h3h3h",
	onBrush: _utils.noop,
	onStart: _utils.noop,
	strokeDashArray: "ShortDash"
};

exports.default = Brush;
//# sourceMappingURL=Brush.js.map