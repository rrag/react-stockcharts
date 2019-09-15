"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

var _StackedBarSeries = require("./StackedBarSeries");

var _StackedBarSeries2 = _interopRequireDefault(_StackedBarSeries);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BarSeries = function (_Component) {
	_inherits(BarSeries, _Component);

	function BarSeries(props) {
		_classCallCheck(this, BarSeries);

		var _this = _possibleConstructorReturn(this, (BarSeries.__proto__ || Object.getPrototypeOf(BarSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(BarSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			if (this.props.swapScales) {
				var xAccessor = moreProps.xAccessor;

				(0, _StackedBarSeries.drawOnCanvasHelper)(ctx, this.props, moreProps, xAccessor, _StackedBarSeries.identityStack);
			} else {
				var bars = getBars(this.props, moreProps);
				(0, _StackedBarSeries.drawOnCanvas2)(this.props, ctx, bars);
			}
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			if (this.props.swapScales) {
				var xAccessor = moreProps.xAccessor;

				return _react2.default.createElement(
					"g",
					null,
					(0, _StackedBarSeries.svgHelper)(this.props, moreProps, xAccessor, _StackedBarSeries.identityStack)
				);
			} else {
				var bars = getBars(this.props, moreProps);
				return _react2.default.createElement(
					"g",
					null,
					(0, _StackedBarSeries.getBarsSVG2)(this.props, bars)
				);
			}
		}
	}, {
		key: "render",
		value: function render() {
			var clip = this.props.clip;


			return _react2.default.createElement(_GenericChartComponent2.default, {
				clip: clip,
				svgDraw: this.renderSVG,

				canvasToDraw: _GenericComponent.getAxisCanvas,
				canvasDraw: this.drawOnCanvas,

				drawOn: ["pan"]
			});
		}
	}]);

	return BarSeries;
}(_react.Component);

BarSeries.propTypes = {
	baseAt: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
	stroke: _propTypes2.default.bool,
	width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
	yAccessor: _propTypes2.default.func.isRequired,
	opacity: _propTypes2.default.number,
	fill: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
	className: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
	clip: _propTypes2.default.bool,
	swapScales: _propTypes2.default.bool
};

BarSeries.defaultProps = _StackedBarSeries2.default.defaultProps;

exports.default = BarSeries;

/*
 Initially, this program was using StackedBarSeries.getBars
 to benefit from code reuse and having a single place that
 contains the logic for drawing all types of bar charts
 simple, grouped, horizontal, but turnes out
 making it highly cuztimizable also made it slow for the
 most simple case, a regular bar chart.
 This function contains just the necessary logic
 to create bars
*/

function getBars(props, moreProps) {
	var baseAt = props.baseAt,
	    fill = props.fill,
	    stroke = props.stroke,
	    yAccessor = props.yAccessor;
	var xScale = moreProps.xScale,
	    xAccessor = moreProps.xAccessor,
	    plotData = moreProps.plotData,
	    yScale = moreProps.chartConfig.yScale;


	var getFill = (0, _utils.functor)(fill);
	var getBase = (0, _utils.functor)(baseAt);

	var widthFunctor = (0, _utils.functor)(props.width);

	var width = widthFunctor(props, {
		xScale: xScale,
		xAccessor: xAccessor,
		plotData: plotData
	});
	/*
 const barWidth = Math.round(width);
 const offset = Math.round(barWidth === 1 ? 0 : 0.5 * barWidth);
 */
	var offset = Math.floor(0.5 * width);

	var bars = plotData.filter(function (d) {
		return (0, _utils.isDefined)(yAccessor(d));
	}).map(function (d) {
		var yValue = yAccessor(d);
		var y = yScale(yValue);

		var x = Math.round(xScale(xAccessor(d))) - offset;
		var h = getBase(xScale, yScale, d) - yScale(yValue);

		if (h < 0) {
			y = y + h;
			h = -h;
		}

		return {
			// type: "line"
			x: x,
			y: Math.round(y),
			height: Math.round(h),
			width: offset * 2,
			fill: getFill(d, 0),
			stroke: stroke ? getFill(d, 0) : "none"
		};
	});

	return bars;
}
//# sourceMappingURL=BarSeries.js.map