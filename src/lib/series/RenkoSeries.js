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

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RenkoSeries = function (_Component) {
	_inherits(RenkoSeries, _Component);

	function RenkoSeries(props) {
		_classCallCheck(this, RenkoSeries);

		var _this = _possibleConstructorReturn(this, (RenkoSeries.__proto__ || Object.getPrototypeOf(RenkoSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(RenkoSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData;
			var yAccessor = this.props.yAccessor;


			var candles = getRenko(this.props, plotData, xScale, xAccessor, yScale, yAccessor);

			_drawOnCanvas(ctx, candles);
		}
	}, {
		key: "render",
		value: function render() {
			var clip = this.props.clip;


			return _react2.default.createElement(_GenericChartComponent2.default, {
				clip: clip,
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getAxisCanvas,
				drawOn: ["pan"]
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData;
			var yAccessor = this.props.yAccessor;


			var candles = getRenko(this.props, plotData, xScale, xAccessor, yScale, yAccessor).map(function (each, idx) {
				return _react2.default.createElement("rect", { key: idx, className: each.className,
					fill: each.fill,
					x: each.x,
					y: each.y,
					width: each.width,
					height: each.height });
			});

			return _react2.default.createElement(
				"g",
				null,
				_react2.default.createElement(
					"g",
					{ className: "candle" },
					candles
				)
			);
		}
	}]);

	return RenkoSeries;
}(_react.Component);

RenkoSeries.propTypes = {
	classNames: _propTypes2.default.shape({
		up: _propTypes2.default.string,
		down: _propTypes2.default.string
	}),
	stroke: _propTypes2.default.shape({
		up: _propTypes2.default.string,
		down: _propTypes2.default.string
	}),
	fill: _propTypes2.default.shape({
		up: _propTypes2.default.string,
		down: _propTypes2.default.string,
		partial: _propTypes2.default.string
	}),
	yAccessor: _propTypes2.default.func.isRequired,
	clip: _propTypes2.default.bool.isRequired
};

RenkoSeries.defaultProps = {
	classNames: {
		up: "up",
		down: "down"
	},
	stroke: {
		up: "none",
		down: "none"
	},
	fill: {
		up: "#6BA583",
		down: "#E60000",
		partial: "#4682B4"
	},
	yAccessor: function yAccessor(d) {
		return { open: d.open, high: d.high, low: d.low, close: d.close };
	},
	clip: true
};

function _drawOnCanvas(ctx, renko) {
	renko.forEach(function (d) {
		ctx.beginPath();

		ctx.strokeStyle = d.stroke;
		ctx.fillStyle = d.fill;

		ctx.rect(d.x, d.y, d.width, d.height);
		ctx.closePath();
		ctx.fill();
	});
}

function getRenko(props, plotData, xScale, xAccessor, yScale, yAccessor) {
	var classNames = props.classNames,
	    fill = props.fill;

	var width = xScale(xAccessor(plotData[plotData.length - 1])) - xScale(xAccessor(plotData[0]));

	var candleWidth = width / (plotData.length - 1);
	var candles = plotData.filter(function (d) {
		return (0, _utils.isDefined)(yAccessor(d).close);
	}).map(function (d) {
		var ohlc = yAccessor(d);
		var x = xScale(xAccessor(d)) - 0.5 * candleWidth,
		    y = yScale(Math.max(ohlc.open, ohlc.close)),
		    height = Math.abs(yScale(ohlc.open) - yScale(ohlc.close)),
		    className = ohlc.open <= ohlc.close ? classNames.up : classNames.down;

		var svgfill = d.fullyFormed ? ohlc.open <= ohlc.close ? fill.up : fill.down : fill.partial;

		return {
			className: className,
			fill: svgfill,
			x: x,
			y: y,
			height: height,
			width: candleWidth
		};
	});
	return candles;
}

exports.default = RenkoSeries;
//# sourceMappingURL=RenkoSeries.js.map