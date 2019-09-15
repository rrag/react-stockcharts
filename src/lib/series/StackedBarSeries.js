"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.rotateXY = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.identityStack = identityStack;
exports.drawOnCanvasHelper = drawOnCanvasHelper;
exports.svgHelper = svgHelper;
exports.getBarsSVG2 = getBarsSVG2;
exports.drawOnCanvas2 = drawOnCanvas2;
exports.getBars = getBars;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Collection = require("d3-collection");

var _d3Array = require("d3-array");

var _d3Shape = require("d3-shape");

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StackedBarSeries = function (_Component) {
	_inherits(StackedBarSeries, _Component);

	function StackedBarSeries(props) {
		_classCallCheck(this, StackedBarSeries);

		var _this = _possibleConstructorReturn(this, (StackedBarSeries.__proto__ || Object.getPrototypeOf(StackedBarSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(StackedBarSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var xAccessor = moreProps.xAccessor;
			// var { xScale, chartConfig: { yScale }, plotData } = moreProps;

			drawOnCanvasHelper(ctx, this.props, moreProps, xAccessor, _d3Shape.stack);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var xAccessor = moreProps.xAccessor;


			return _react2.default.createElement(
				"g",
				null,
				svgHelper(this.props, moreProps, xAccessor, _d3Shape.stack)
			);
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
	}]);

	return StackedBarSeries;
}(_react.Component);

StackedBarSeries.propTypes = {
	baseAt: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]).isRequired,
	direction: _propTypes2.default.oneOf(["up", "down"]).isRequired,
	stroke: _propTypes2.default.bool.isRequired,
	width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]).isRequired,
	opacity: _propTypes2.default.number.isRequired,
	fill: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]).isRequired,
	className: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]).isRequired,
	clip: _propTypes2.default.bool.isRequired
};

StackedBarSeries.defaultProps = {
	baseAt: function baseAt(xScale, yScale /* , d*/) {
		return (0, _utils.head)(yScale.range());
	},
	direction: "up",
	className: "bar",
	stroke: true,
	fill: "#4682B4",
	opacity: 0.5,
	width: _utils.plotDataLengthBarWidth,
	widthRatio: 0.8,
	clip: true,
	swapScales: false
};

function identityStack() {
	var keys = [];
	function stack(data) {
		var response = keys.map(function (key, i) {
			// eslint-disable-next-line prefer-const
			var arrays = data.map(function (d) {
				// eslint-disable-next-line prefer-const
				var array = [0, d[key]];
				array.data = d;
				return array;
			});
			arrays.key = key;
			arrays.index = i;
			return arrays;
		});
		return response;
	}
	stack.keys = function (x) {
		if (!arguments.length) {
			return keys;
		}
		keys = x;
		return stack;
	};
	return stack;
}

function drawOnCanvasHelper(ctx, props, moreProps, xAccessor, stackFn) {
	var defaultPostAction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _utils.identity;
	var postRotateAction = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : rotateXY;
	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale,
	    plotData = moreProps.plotData;


	var bars = doStuff(props, xAccessor, plotData, xScale, yScale, stackFn, postRotateAction, defaultPostAction);

	drawOnCanvas2(props, ctx, bars);
}

function convertToArray(item) {
	return Array.isArray(item) ? item : [item];
}

function svgHelper(props, moreProps, xAccessor, stackFn) {
	var defaultPostAction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _utils.identity;
	var postRotateAction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : rotateXY;
	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale,
	    plotData = moreProps.plotData;

	var bars = doStuff(props, xAccessor, plotData, xScale, yScale, stackFn, postRotateAction, defaultPostAction);
	return getBarsSVG2(props, bars);
}

function doStuff(props, xAccessor, plotData, xScale, yScale, stackFn, postRotateAction, defaultPostAction) {
	var yAccessor = props.yAccessor,
	    swapScales = props.swapScales;


	var modifiedYAccessor = swapScales ? convertToArray(props.xAccessor) : convertToArray(yAccessor);
	var modifiedXAccessor = swapScales ? yAccessor : xAccessor;

	var modifiedXScale = swapScales ? yScale : xScale;
	var modifiedYScale = swapScales ? xScale : yScale;

	var postProcessor = swapScales ? postRotateAction : defaultPostAction;

	var bars = getBars(props, modifiedXAccessor, modifiedYAccessor, modifiedXScale, modifiedYScale, plotData, stackFn, postProcessor);

	return bars;
}

var rotateXY = exports.rotateXY = function rotateXY(array) {
	return array.map(function (each) {
		return _extends({}, each, {
			x: each.y,
			y: each.x,
			height: each.width,
			width: each.height
		});
	});
};

function getBarsSVG2(props, bars) {
	/* eslint-disable react/prop-types */
	var opacity = props.opacity;
	/* eslint-enable react/prop-types */

	return bars.map(function (d, idx) {
		if (d.width <= 1) {
			return _react2.default.createElement("line", { key: idx, className: d.className,
				stroke: d.fill,
				x1: d.x, y1: d.y,
				x2: d.x, y2: d.y + d.height });
		}
		return _react2.default.createElement("rect", { key: idx, className: d.className,
			stroke: d.stroke,
			fill: d.fill,
			x: d.x,
			y: d.y,
			width: d.width,
			fillOpacity: opacity,
			height: d.height });
	});
}

function drawOnCanvas2(props, ctx, bars) {
	var stroke = props.stroke;


	var nest = (0, _d3Collection.nest)().key(function (d) {
		return d.fill;
	}).entries(bars);

	nest.forEach(function (outer) {
		var key = outer.key,
		    values = outer.values;

		if ((0, _utils.head)(values).width > 1) {
			ctx.strokeStyle = key;
		}
		var fillStyle = (0, _utils.head)(values).width <= 1 ? key : (0, _utils.hexToRGBA)(key, props.opacity);
		ctx.fillStyle = fillStyle;

		values.forEach(function (d) {
			if (d.width <= 1) {
				/* <line key={idx} className={d.className}
    			stroke={stroke}
    			fill={fill}
    			x1={d.x} y1={d.y}
    			x2={d.x} y2={d.y + d.height} />*/
				/*
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x, d.y + d.height);
    ctx.stroke();
    */
				ctx.fillRect(d.x - 0.5, d.y, 1, d.height);
			} else {
				/* <rect key={idx} className={d.className}
    		stroke={stroke}
    		fill={fill}
    		x={d.x}
    		y={d.y}
    		width={d.width}
    		height={d.height} /> */
				/*
    ctx.beginPath();
    ctx.rect(d.x, d.y, d.width, d.height);
    ctx.fill();
    */
				ctx.fillRect(d.x, d.y, d.width, d.height);
				if (stroke) ctx.strokeRect(d.x, d.y, d.width, d.height);
			}
		});
	});
}

function getBars(props, xAccessor, yAccessor, xScale, yScale, plotData) {
	var stack = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : identityStack;
	var after = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : _utils.identity;
	var baseAt = props.baseAt,
	    className = props.className,
	    fill = props.fill,
	    stroke = props.stroke,
	    _props$spaceBetweenBa = props.spaceBetweenBar,
	    spaceBetweenBar = _props$spaceBetweenBa === undefined ? 0 : _props$spaceBetweenBa;


	var getClassName = (0, _utils.functor)(className);
	var getFill = (0, _utils.functor)(fill);
	var getBase = (0, _utils.functor)(baseAt);

	var widthFunctor = (0, _utils.functor)(props.width);
	var width = widthFunctor(props, {
		xScale: xScale,
		xAccessor: xAccessor,
		plotData: plotData
	});

	var barWidth = Math.round(width);

	var eachBarWidth = (barWidth - spaceBetweenBar * (yAccessor.length - 1)) / yAccessor.length;

	var offset = barWidth === 1 ? 0 : 0.5 * width;

	var ds = plotData.map(function (each) {
		// eslint-disable-next-line prefer-const
		var d = {
			appearance: {},
			x: xAccessor(each)
		};
		yAccessor.forEach(function (eachYAccessor, i) {
			var key = "y" + i;
			d[key] = eachYAccessor(each);
			var appearance = {
				className: getClassName(each, i),
				stroke: stroke ? getFill(each, i) : "none",
				fill: getFill(each, i)
			};
			d.appearance[key] = appearance;
		});
		return d;
	});

	var keys = yAccessor.map(function (_, i) {
		return "y" + i;
	});

	// console.log(ds);

	var data = stack().keys(keys)(ds);

	// console.log(data);

	var newData = data.map(function (each, i) {
		var key = each.key;
		return each.map(function (d) {
			// eslint-disable-next-line prefer-const
			var array = [d[0], d[1]];
			array.data = {
				x: d.data.x,
				i: i,
				appearance: d.data.appearance[key]
			};
			return array;
		});
	});
	// console.log(newData);
	// console.log(merge(newData));

	var bars = (0, _d3Array.merge)(newData)
	// .filter(d => isDefined(d.y))
	.map(function (d) {
		// let baseValue = yScale.invert(getBase(xScale, yScale, d.datum));
		var y = yScale(d[1]);
		/* let h = isDefined(d.y0) && d.y0 !== 0 && !isNaN(d.y0)
  		? yScale(d.y0) - y
  		: getBase(xScale, yScale, d.datum) - yScale(d.y)*/
		var h = getBase(xScale, yScale, d.data) - yScale(d[1] - d[0]);
		// console.log(d.y, yScale.domain(), yScale.range())
		// let h = ;
		// if (d.y < 0) h = -h;
		// console.log(d, y, h)
		if (h < 0) {
			y = y + h;
			h = -h;
		}
		// console.log(d.data.i, Math.round(offset - (d.data.i > 0 ? (eachBarWidth + spaceBetweenBar) * d.data.i : 0)))
		/* console.log(d.series, d.datum.date, d.x,
  		getBase(xScale, yScale, d.datum), `d.y=${d.y}, d.y0=${d.y0}, y=${y}, h=${h}`)*/
		return _extends({}, d.data.appearance, {
			// series: d.series,
			// i: d.x,
			x: Math.round(xScale(d.data.x) - width / 2),
			y: y,
			groupOffset: Math.round(offset - (d.data.i > 0 ? (eachBarWidth + spaceBetweenBar) * d.data.i : 0)),
			groupWidth: Math.round(eachBarWidth),
			offset: Math.round(offset),
			height: h,
			width: barWidth
		});
	}).filter(function (bar) {
		return !isNaN(bar.y);
	});

	return after(bars);
}

exports.default = StackedBarSeries;
//# sourceMappingURL=StackedBarSeries.js.map