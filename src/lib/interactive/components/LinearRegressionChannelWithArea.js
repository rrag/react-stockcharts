"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.edge1Provider = edge1Provider;
exports.edge2Provider = edge2Provider;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Array = require("d3-array");

var _d3Path = require("d3-path");

var _GenericChartComponent = require("../../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../../GenericComponent");

var _StraightLine = require("./StraightLine");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LinearRegressionChannelWithArea = function (_Component) {
	_inherits(LinearRegressionChannelWithArea, _Component);

	function LinearRegressionChannelWithArea(props) {
		_classCallCheck(this, LinearRegressionChannelWithArea);

		var _this = _possibleConstructorReturn(this, (LinearRegressionChannelWithArea.__proto__ || Object.getPrototypeOf(LinearRegressionChannelWithArea)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		return _this;
	}

	_createClass(LinearRegressionChannelWithArea, [{
		key: "isHover",
		value: function isHover(moreProps) {
			var _props = this.props,
			    tolerance = _props.tolerance,
			    onHover = _props.onHover;


			if ((0, _utils.isDefined)(onHover)) {
				var mouseXY = moreProps.mouseXY;

				var _helper = helper(this.props, moreProps),
				    x1 = _helper.x1,
				    y1 = _helper.y1,
				    x2 = _helper.x2,
				    y2 = _helper.y2,
				    dy = _helper.dy;

				var yDiffs = [-dy, 0, dy];

				var hovering = yDiffs.reduce(function (result, diff) {
					return result || (0, _StraightLine.isHovering2)([x1, y1 + diff], [x2, y2 + diff], mouseXY, tolerance);
				}, false);
				return hovering;
			}
			return false;
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props2 = this.props,
			    stroke = _props2.stroke,
			    strokeWidth = _props2.strokeWidth,
			    fillOpacity = _props2.fillOpacity,
			    strokeOpacity = _props2.strokeOpacity,
			    fill = _props2.fill;

			var _helper2 = helper(this.props, moreProps),
			    x1 = _helper2.x1,
			    y1 = _helper2.y1,
			    x2 = _helper2.x2,
			    y2 = _helper2.y2,
			    dy = _helper2.dy;

			ctx.lineWidth = strokeWidth;
			ctx.strokeStyle = (0, _utils.hexToRGBA)(stroke, strokeOpacity);
			ctx.fillStyle = (0, _utils.hexToRGBA)(fill, fillOpacity);

			ctx.beginPath();
			ctx.moveTo(x1, y1 - dy);
			ctx.lineTo(x2, y2 - dy);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(x2, y2 + dy);
			ctx.lineTo(x1, y1 + dy);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(x1, y1 - dy);
			ctx.lineTo(x2, y2 - dy);
			ctx.lineTo(x2, y2 + dy);
			ctx.lineTo(x1, y1 + dy);
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(x2, y2);
			ctx.lineTo(x1, y1);
			ctx.stroke();
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props3 = this.props,
			    stroke = _props3.stroke,
			    strokeWidth = _props3.strokeWidth,
			    fillOpacity = _props3.fillOpacity,
			    strokeOpacity = _props3.strokeOpacity,
			    fill = _props3.fill;

			var _helper3 = helper(this.props, moreProps),
			    x1 = _helper3.x1,
			    y1 = _helper3.y1,
			    x2 = _helper3.x2,
			    y2 = _helper3.y2,
			    dy = _helper3.dy;

			var line = {
				strokeWidth: strokeWidth,
				stroke: stroke,
				strokeOpacity: strokeOpacity
			};
			var ctx = (0, _d3Path.path)();
			ctx.moveTo(x1, y1 - dy);
			ctx.lineTo(x2, y2 - dy);
			ctx.lineTo(x2, y2 + dy);
			ctx.lineTo(x1, y1 + dy);
			ctx.closePath();
			return _react2.default.createElement(
				"g",
				null,
				_react2.default.createElement("line", _extends({}, line, {
					x1: x1,
					y1: y1 - dy,
					x2: x2,
					y2: y2 - dy
				})),
				_react2.default.createElement("line", _extends({}, line, {
					x1: x1,
					y1: y1 + dy,
					x2: x2,
					y2: y2 + dy
				})),
				_react2.default.createElement("path", {
					d: ctx.toString(),
					fill: fill,
					fillOpacity: fillOpacity
				}),
				_react2.default.createElement("line", _extends({}, line, {
					x1: x1,
					y1: y1,
					x2: x2,
					y2: y2
				}))
			);
		}
	}, {
		key: "render",
		value: function render() {
			var _props4 = this.props,
			    selected = _props4.selected,
			    interactiveCursorClass = _props4.interactiveCursorClass;
			var _props5 = this.props,
			    onHover = _props5.onHover,
			    onUnHover = _props5.onUnHover;


			return _react2.default.createElement(_GenericChartComponent2.default, {
				isHover: this.isHover,

				svgDraw: this.renderSVG,
				canvasToDraw: _GenericComponent.getMouseCanvas,
				canvasDraw: this.drawOnCanvas,

				interactiveCursorClass: interactiveCursorClass,
				selected: selected,

				onHover: onHover,
				onUnHover: onUnHover,

				drawOn: ["mousemove", "mouseleave", "pan", "drag"]
			});
		}
	}]);

	return LinearRegressionChannelWithArea;
}(_react.Component);

function edge1Provider(props) {
	return function (moreProps) {
		var _helper4 = helper(props, moreProps),
		    x1 = _helper4.x1,
		    y1 = _helper4.y1;

		return [x1, y1];
	};
}

function edge2Provider(props) {
	return function (moreProps) {
		var _helper5 = helper(props, moreProps),
		    x2 = _helper5.x2,
		    y2 = _helper5.y2;

		return [x2, y2];
	};
}

function helper(props, moreProps) {
	var x1Value = props.x1Value,
	    x2Value = props.x2Value,
	    type = props.type;
	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale,
	    fullData = moreProps.fullData;
	var xAccessor = moreProps.xAccessor;

	/*
 http://www.metastock.com/Customer/Resources/TAAZ/?p=65
 y = a + bx
 n = length of array
 b = (n * sum(x*y) - sum(xs) * sum(ys)) / (n * sum(xSquareds) - (sum(xs) ^ 2))
 a = (sum of closes)
 */

	var _getClosestItemIndexe = (0, _utils.getClosestItemIndexes)(fullData, x1Value, xAccessor),
	    left = _getClosestItemIndexe.left;

	var _getClosestItemIndexe2 = (0, _utils.getClosestItemIndexes)(fullData, x2Value, xAccessor),
	    right = _getClosestItemIndexe2.right;

	var startIndex = Math.min(left, right);
	var endIndex = Math.max(left, right) + 1;

	var array = fullData.slice(startIndex, endIndex);

	var xs = array.map(function (d) {
		return xAccessor(d).valueOf();
	});
	var ys = array.map(function (d) {
		return d.close;
	});
	var n = array.length;

	var combine = (0, _utils.zipper)().combine(function (x, y) {
		return x * y;
	});

	var xys = combine(xs, ys);
	var xSquareds = xs.map(function (x) {
		return Math.pow(x, 2);
	});

	var b = (n * (0, _d3Array.sum)(xys) - (0, _d3Array.sum)(xs) * (0, _d3Array.sum)(ys)) / (n * (0, _d3Array.sum)(xSquareds) - Math.pow((0, _d3Array.sum)(xs), 2));
	var a = ((0, _d3Array.sum)(ys) - b * (0, _d3Array.sum)(xs)) / n;

	var newy1 = a + b * x1Value;
	var newy2 = a + b * x2Value;

	var x1 = xScale(x1Value);
	var y1 = yScale(newy1);
	var x2 = xScale(x2Value);
	var y2 = yScale(newy2);

	var stdDev = type === "SD" ? (0, _d3Array.deviation)(array, function (d) {
		return d.close;
	}) : 0;

	var dy = yScale(newy1 - stdDev) - y1;

	return {
		x1: x1, y1: y1, x2: x2, y2: y2, dy: dy
	};
}

LinearRegressionChannelWithArea.propTypes = {
	x1Value: _propTypes2.default.any.isRequired,
	x2Value: _propTypes2.default.any.isRequired,

	type: _propTypes2.default.oneOf(["SD", // standard deviation channel
	"Raff"] // Raff Regression Channel
	).isRequired,

	interactiveCursorClass: _propTypes2.default.string,
	stroke: _propTypes2.default.string.isRequired,
	strokeWidth: _propTypes2.default.number.isRequired,
	fill: _propTypes2.default.string.isRequired,
	fillOpacity: _propTypes2.default.number.isRequired,
	strokeOpacity: _propTypes2.default.number.isRequired,

	onDragStart: _propTypes2.default.func.isRequired,
	onDrag: _propTypes2.default.func.isRequired,
	onDragComplete: _propTypes2.default.func.isRequired,

	onHover: _propTypes2.default.func,
	onUnHover: _propTypes2.default.func,

	defaultClassName: _propTypes2.default.string,

	tolerance: _propTypes2.default.number.isRequired,
	selected: _propTypes2.default.bool.isRequired
};

LinearRegressionChannelWithArea.defaultProps = {
	onDragStart: _utils.noop,
	onDrag: _utils.noop,
	onDragComplete: _utils.noop,

	type: "SD", // standard dev

	strokeWidth: 1,
	tolerance: 4,
	selected: false
};

exports.default = LinearRegressionChannelWithArea;
//# sourceMappingURL=LinearRegressionChannelWithArea.js.map