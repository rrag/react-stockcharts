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

var _d3Shape = require("d3-shape");

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LineSeries = function (_Component) {
	_inherits(LineSeries, _Component);

	function LineSeries(props) {
		_classCallCheck(this, LineSeries);

		var _this = _possibleConstructorReturn(this, (LineSeries.__proto__ || Object.getPrototypeOf(LineSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		return _this;
	}

	_createClass(LineSeries, [{
		key: "isHover",
		value: function isHover(moreProps) {
			// console.log("HERE")
			var _props = this.props,
			    highlightOnHover = _props.highlightOnHover,
			    yAccessor = _props.yAccessor,
			    hoverTolerance = _props.hoverTolerance;


			if (!highlightOnHover) return false;

			var mouseXY = moreProps.mouseXY,
			    currentItem = moreProps.currentItem,
			    xScale = moreProps.xScale,
			    plotData = moreProps.plotData;
			var _moreProps$chartConfi = moreProps.chartConfig,
			    yScale = _moreProps$chartConfi.yScale,
			    origin = _moreProps$chartConfi.origin;
			var xAccessor = moreProps.xAccessor;

			var _mouseXY = _slicedToArray(mouseXY, 2),
			    x = _mouseXY[0],
			    y = _mouseXY[1];

			var radius = hoverTolerance;

			var _getClosestItemIndexe = (0, _utils.getClosestItemIndexes)(plotData, xScale.invert(x), xAccessor),
			    left = _getClosestItemIndexe.left,
			    right = _getClosestItemIndexe.right;

			if (left === right) {
				var cy = yScale(yAccessor(currentItem)) + origin[1];
				var cx = xScale(xAccessor(currentItem)) + origin[0];

				var hovering1 = Math.pow(x - cx, 2) + Math.pow(y - cy, 2) < Math.pow(radius, 2);

				return hovering1;
			} else {
				var l = plotData[left];
				var r = plotData[right];
				var x1 = xScale(xAccessor(l)) + origin[0];
				var y1 = yScale(yAccessor(l)) + origin[1];
				var x2 = xScale(xAccessor(r)) + origin[0];
				var y2 = yScale(yAccessor(r)) + origin[1];

				// y = m * x + b
				var m /* slope */ = (y2 - y1) / (x2 - x1);
				var b /* y intercept */ = -1 * m * x1 + y1;

				var desiredY = Math.round(m * x + b);

				var hovering2 = y >= desiredY - radius && y <= desiredY + radius;

				return hovering2;
			}
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props2 = this.props,
			    yAccessor = _props2.yAccessor,
			    stroke = _props2.stroke,
			    strokeOpacity = _props2.strokeOpacity,
			    strokeWidth = _props2.strokeWidth,
			    hoverStrokeWidth = _props2.hoverStrokeWidth,
			    defined = _props2.defined,
			    strokeDasharray = _props2.strokeDasharray,
			    interpolation = _props2.interpolation,
			    canvasClip = _props2.canvasClip;
			var connectNulls = this.props.connectNulls;
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData,
			    hovering = moreProps.hovering;


			if (canvasClip) {
				ctx.save();
				canvasClip(ctx, moreProps);
			}

			ctx.lineWidth = hovering ? hoverStrokeWidth : strokeWidth;

			ctx.strokeStyle = (0, _utils.hexToRGBA)(stroke, strokeOpacity);
			ctx.setLineDash((0, _utils.getStrokeDasharray)(strokeDasharray).split(","));

			var dataSeries = (0, _d3Shape.line)().x(function (d) {
				return Math.round(xScale(xAccessor(d)));
			}).y(function (d) {
				return Math.round(yScale(yAccessor(d)));
			});

			if ((0, _utils.isDefined)(interpolation)) {
				dataSeries.curve(interpolation);
			}
			if (!connectNulls) {
				dataSeries.defined(function (d) {
					return defined(yAccessor(d));
				});
			}

			ctx.beginPath();
			dataSeries.context(ctx)(plotData);
			ctx.stroke();

			if (canvasClip) {
				ctx.restore();
			}
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props3 = this.props,
			    yAccessor = _props3.yAccessor,
			    stroke = _props3.stroke,
			    strokeOpacity = _props3.strokeOpacity,
			    strokeWidth = _props3.strokeWidth,
			    hoverStrokeWidth = _props3.hoverStrokeWidth,
			    defined = _props3.defined,
			    strokeDasharray = _props3.strokeDasharray;
			var connectNulls = this.props.connectNulls;
			var _props4 = this.props,
			    interpolation = _props4.interpolation,
			    style = _props4.style;
			var xAccessor = moreProps.xAccessor,
			    chartConfig = moreProps.chartConfig;
			var xScale = moreProps.xScale,
			    plotData = moreProps.plotData,
			    hovering = moreProps.hovering;
			var yScale = chartConfig.yScale;

			var dataSeries = (0, _d3Shape.line)().x(function (d) {
				return Math.round(xScale(xAccessor(d)));
			}).y(function (d) {
				return Math.round(yScale(yAccessor(d)));
			});

			if ((0, _utils.isDefined)(interpolation)) {
				dataSeries.curve(interpolation);
			}
			if (!connectNulls) {
				dataSeries.defined(function (d) {
					return defined(yAccessor(d));
				});
			}
			var d = dataSeries(plotData);

			var _props5 = this.props,
			    fill = _props5.fill,
			    className = _props5.className;


			return _react2.default.createElement("path", {
				style: style,
				className: className + " " + (stroke ? "" : " line-stroke"),
				d: d,
				stroke: stroke,
				strokeOpacity: strokeOpacity,
				strokeWidth: hovering ? hoverStrokeWidth : strokeWidth,
				strokeDasharray: (0, _utils.getStrokeDasharray)(strokeDasharray),
				fill: fill
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _props6 = this.props,
			    highlightOnHover = _props6.highlightOnHover,
			    onHover = _props6.onHover,
			    onUnHover = _props6.onUnHover;

			var hoverProps = highlightOnHover || onHover || onUnHover ? {
				isHover: this.isHover,
				drawOn: ["mousemove", "pan"],
				canvasToDraw: _GenericComponent.getMouseCanvas
			} : {
				drawOn: ["pan"],
				canvasToDraw: _GenericComponent.getAxisCanvas
			};

			return _react2.default.createElement(_GenericChartComponent2.default, _extends({
				svgDraw: this.renderSVG,

				canvasDraw: this.drawOnCanvas,

				onClickWhenHover: this.props.onClick,
				onDoubleClickWhenHover: this.props.onDoubleClick,
				onContextMenuWhenHover: this.props.onContextMenu,
				onHover: this.props.onHover,
				onUnHover: this.props.onUnHover
			}, hoverProps));
		}
	}]);

	return LineSeries;
}(_react.Component);

/*
function segment(points, ctx) {
	ctx.beginPath();

	const [x, y] = first(points);
	ctx.moveTo(x, y);
	for (let i = 1; i < points.length; i++) {
		const [x1, y1] = points[i];
		ctx.lineTo(x1, y1);
	}

	ctx.stroke();
}
*/

LineSeries.propTypes = {
	className: _propTypes2.default.string,
	strokeWidth: _propTypes2.default.number,
	strokeOpacity: _propTypes2.default.number,
	stroke: _propTypes2.default.string,
	hoverStrokeWidth: _propTypes2.default.number,
	fill: _propTypes2.default.string,
	defined: _propTypes2.default.func,
	hoverTolerance: _propTypes2.default.number,
	strokeDasharray: _propTypes2.default.oneOf(_utils.strokeDashTypes),
	highlightOnHover: _propTypes2.default.bool,
	onClick: _propTypes2.default.func,
	onDoubleClick: _propTypes2.default.func,
	onHover: _propTypes2.default.func,
	onUnHover: _propTypes2.default.func,
	onContextMenu: _propTypes2.default.func,
	yAccessor: _propTypes2.default.func,
	connectNulls: _propTypes2.default.bool,
	interpolation: _propTypes2.default.func,
	canvasClip: _propTypes2.default.func,
	style: _propTypes2.default.object
};

LineSeries.defaultProps = {
	className: "line ",
	strokeWidth: 1,
	strokeOpacity: 1,
	hoverStrokeWidth: 4,
	fill: "none",
	stroke: "#4682B4",
	strokeDasharray: "Solid",
	defined: function defined(d) {
		return !isNaN(d);
	},
	hoverTolerance: 6,
	highlightOnHover: false,
	connectNulls: false,
	onClick: function onClick(e) {
		console.log("Click", e);
	},
	onDoubleClick: function onDoubleClick(e) {
		console.log("Double Click", e);
	},
	onContextMenu: function onContextMenu(e) {
		console.log("Right Click", e);
	}
};

exports.default = LineSeries;
//# sourceMappingURL=LineSeries.js.map