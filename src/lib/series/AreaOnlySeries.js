"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

var AreaOnlySeries = function (_Component) {
	_inherits(AreaOnlySeries, _Component);

	function AreaOnlySeries(props) {
		_classCallCheck(this, AreaOnlySeries);

		var _this = _possibleConstructorReturn(this, (AreaOnlySeries.__proto__ || Object.getPrototypeOf(AreaOnlySeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(AreaOnlySeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props = this.props,
			    yAccessor = _props.yAccessor,
			    defined = _props.defined,
			    base = _props.base,
			    canvasGradient = _props.canvasGradient;
			var _props2 = this.props,
			    fill = _props2.fill,
			    stroke = _props2.stroke,
			    opacity = _props2.opacity,
			    interpolation = _props2.interpolation,
			    canvasClip = _props2.canvasClip;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData,
			    xAccessor = moreProps.xAccessor;


			if (canvasClip) {
				ctx.save();
				canvasClip(ctx, moreProps);
			}

			if (canvasGradient != null) {
				ctx.fillStyle = canvasGradient(moreProps, ctx);
			} else {
				ctx.fillStyle = (0, _utils.hexToRGBA)(fill, opacity);
			}
			ctx.strokeStyle = stroke;

			ctx.beginPath();
			var newBase = (0, _utils.functor)(base);
			var areaSeries = (0, _d3Shape.area)().defined(function (d) {
				return defined(yAccessor(d));
			}).x(function (d) {
				return Math.round(xScale(xAccessor(d)));
			}).y0(function (d) {
				return newBase(yScale, d, moreProps);
			}).y1(function (d) {
				return Math.round(yScale(yAccessor(d)));
			}).context(ctx);

			if ((0, _utils.isDefined)(interpolation)) {
				areaSeries.curve(interpolation);
			}
			areaSeries(plotData);
			ctx.fill();

			if (canvasClip) {
				ctx.restore();
			}
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props3 = this.props,
			    yAccessor = _props3.yAccessor,
			    defined = _props3.defined,
			    base = _props3.base,
			    style = _props3.style;
			var _props4 = this.props,
			    stroke = _props4.stroke,
			    fill = _props4.fill,
			    className = _props4.className,
			    opacity = _props4.opacity,
			    interpolation = _props4.interpolation;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData,
			    xAccessor = moreProps.xAccessor;


			var newBase = (0, _utils.functor)(base);
			var areaSeries = (0, _d3Shape.area)().defined(function (d) {
				return defined(yAccessor(d));
			}).x(function (d) {
				return Math.round(xScale(xAccessor(d)));
			}).y0(function (d) {
				return newBase(yScale, d, moreProps);
			}).y1(function (d) {
				return Math.round(yScale(yAccessor(d)));
			});

			if ((0, _utils.isDefined)(interpolation)) {
				areaSeries.curve(interpolation);
			}

			var d = areaSeries(plotData);
			var newClassName = className.concat((0, _utils.isDefined)(stroke) ? "" : " line-stroke");
			return _react2.default.createElement("path", {
				style: style,
				d: d,
				stroke: stroke,
				fill: (0, _utils.hexToRGBA)(fill, opacity),
				className: newClassName

			});
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getAxisCanvas,
				drawOn: ["pan"]
			});
		}
	}]);

	return AreaOnlySeries;
}(_react.Component);

AreaOnlySeries.propTypes = {
	className: _propTypes2.default.string,
	yAccessor: _propTypes2.default.func.isRequired,
	stroke: _propTypes2.default.string,
	fill: _propTypes2.default.string,
	opacity: _propTypes2.default.number,
	defined: _propTypes2.default.func,
	base: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.number]),
	interpolation: _propTypes2.default.func,
	canvasClip: _propTypes2.default.func,
	style: _propTypes2.default.object,
	canvasGradient: _propTypes2.default.func
};

AreaOnlySeries.defaultProps = {
	className: "line ",
	fill: "none",
	opacity: 1,
	defined: function defined(d) {
		return !isNaN(d);
	},
	base: function base(yScale /* , d, moreProps */) {
		return (0, _utils.first)(yScale.range());
	}
};

exports.default = AreaOnlySeries;
//# sourceMappingURL=AreaOnlySeries.js.map