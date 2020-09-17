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

var KagiSeries = function (_Component) {
	_inherits(KagiSeries, _Component);

	function KagiSeries(props) {
		_classCallCheck(this, KagiSeries);

		var _this = _possibleConstructorReturn(this, (KagiSeries.__proto__ || Object.getPrototypeOf(KagiSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(KagiSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var xAccessor = moreProps.xAccessor;


			_drawOnCanvas(ctx, this.props, moreProps, xAccessor);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				svgDraw: this.renderSVG,
				canvasToDraw: _GenericComponent.getAxisCanvas,
				canvasDraw: this.drawOnCanvas,
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
			var _props = this.props,
			    className = _props.className,
			    stroke = _props.stroke,
			    fill = _props.fill,
			    strokeWidth = _props.strokeWidth;


			var paths = helper(plotData, xAccessor).map(function (each, i) {
				var dataSeries = (0, _d3Shape.line)().x(function (item) {
					return xScale(item[0]);
				}).y(function (item) {
					return yScale(item[1]);
				}).curve(_d3Shape.curveStepBefore);

				dataSeries(each.plot);

				return _react2.default.createElement("path", { key: i, d: dataSeries(each.plot), className: each.type,
					stroke: stroke[each.type], fill: fill[each.type], strokeWidth: strokeWidth });
			});
			return _react2.default.createElement(
				"g",
				{ className: className },
				paths
			);
		}
	}]);

	return KagiSeries;
}(_react.Component);

KagiSeries.propTypes = {
	className: _propTypes2.default.string,
	stroke: _propTypes2.default.object,
	fill: _propTypes2.default.object,
	strokeWidth: _propTypes2.default.number.isRequired
};

KagiSeries.defaultProps = {
	className: "react-stockcharts-kagi",
	strokeWidth: 2,
	stroke: {
		yang: "#6BA583",
		yin: "#E60000"
	},
	fill: {
		yang: "none",
		yin: "none"
	},
	currentValueStroke: "#000000"
};

function _drawOnCanvas(ctx, props, moreProps, xAccessor) {
	var stroke = props.stroke,
	    strokeWidth = props.strokeWidth,
	    currentValueStroke = props.currentValueStroke;
	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale,
	    plotData = moreProps.plotData;


	var paths = helper(plotData, xAccessor);

	var begin = true;

	paths.forEach(function (each) {
		ctx.strokeStyle = stroke[each.type];
		ctx.lineWidth = strokeWidth;

		ctx.beginPath();
		var prevX = void 0;
		each.plot.forEach(function (d) {
			var _ref = [xScale(d[0]), yScale(d[1])],
			    x = _ref[0],
			    y = _ref[1];

			if (begin) {
				ctx.moveTo(x, y);
				begin = false;
			} else {
				if ((0, _utils.isDefined)(prevX)) {
					ctx.lineTo(prevX, y);
				}
				ctx.lineTo(x, y);
			}
			prevX = x;
			// console.log(d);
		});
		ctx.stroke();
	});
	var lastPlot = paths[paths.length - 1].plot;
	var last = lastPlot[lastPlot.length - 1];
	ctx.beginPath();
	// ctx.strokeStyle = "black";
	ctx.lineWidth = 1;

	var _ref2 = [xScale(last[0]), yScale(last[2]), yScale(last[3])],
	    x = _ref2[0],
	    y1 = _ref2[1],
	    y2 = _ref2[2];
	// console.log(last, x, y);

	ctx.moveTo(x, y1);
	ctx.lineTo(x + 10, y1);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = currentValueStroke;
	ctx.moveTo(x - 10, y2);
	ctx.lineTo(x, y2);
	ctx.stroke();
}

function helper(plotData, xAccessor) {
	var kagiLine = [];
	var kagi = {};
	var d = plotData[0];
	var idx = xAccessor(d);

	for (var i = 0; i < plotData.length; i++) {
		d = plotData[i];

		if ((0, _utils.isNotDefined)(d.close)) continue;
		if ((0, _utils.isNotDefined)(kagi.type)) kagi.type = d.startAs;
		if ((0, _utils.isNotDefined)(kagi.plot)) kagi.plot = [];

		idx = xAccessor(d);
		kagi.plot.push([idx, d.open]);

		if ((0, _utils.isDefined)(d.changeTo)) {
			kagi.plot.push([idx, d.changePoint]);
			kagi.added = true;
			kagiLine.push(kagi);

			kagi = {
				type: d.changeTo,
				plot: [],
				added: false
			};
			kagi.plot.push([idx, d.changePoint]);
		}
	}

	if (!kagi.added) {
		kagi.plot.push([idx, d.close, d.current, d.reverseAt]);
		kagiLine.push(kagi);
	}

	// console.log(d.reverseAt);

	return kagiLine;
}

exports.default = KagiSeries;
//# sourceMappingURL=KagiSeries.js.map