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

var _GenericComponent = require("../GenericComponent");

var _GenericComponent2 = _interopRequireDefault(_GenericComponent);

var _d3Array = require("d3-array");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HoverTooltip = function (_Component) {
	_inherits(HoverTooltip, _Component);

	function HoverTooltip(props) {
		_classCallCheck(this, HoverTooltip);

		var _this = _possibleConstructorReturn(this, (HoverTooltip.__proto__ || Object.getPrototypeOf(HoverTooltip)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(HoverTooltip, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var pointer = helper(this.props, moreProps, ctx);
			var height = moreProps.height;


			if ((0, _utils.isNotDefined)(pointer)) return null;
			_drawOnCanvas(ctx, this.props, this.context, pointer, height, moreProps);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericComponent2.default, {
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				drawOn: ["mousemove", "pan" /* , "mouseleave" */]
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var pointer = helper(this.props, moreProps);

			if ((0, _utils.isNotDefined)(pointer)) return null;

			var _props = this.props,
			    bgFill = _props.bgFill,
			    bgOpacity = _props.bgOpacity,
			    backgroundShapeSVG = _props.backgroundShapeSVG,
			    tooltipSVG = _props.tooltipSVG;
			var _props2 = this.props,
			    bgheight = _props2.bgheight,
			    bgwidth = _props2.bgwidth;
			var height = moreProps.height;
			var x = pointer.x,
			    y = pointer.y,
			    content = pointer.content,
			    centerX = pointer.centerX,
			    pointWidth = pointer.pointWidth,
			    bgSize = pointer.bgSize;


			var bgShape = (0, _utils.isDefined)(bgwidth) && (0, _utils.isDefined)(bgheight) ? { width: bgwidth, height: bgheight } : bgSize;

			return _react2.default.createElement(
				"g",
				null,
				_react2.default.createElement("rect", { x: centerX - pointWidth / 2,
					y: 0,
					width: pointWidth,
					height: height,
					fill: bgFill,
					opacity: bgOpacity }),
				_react2.default.createElement(
					"g",
					{ className: "react-stockcharts-tooltip-content", transform: "translate(" + x + ", " + y + ")" },
					backgroundShapeSVG(this.props, bgShape),
					tooltipSVG(this.props, content)
				)
			);
		}
	}]);

	return HoverTooltip;
}(_react.Component);

HoverTooltip.propTypes = {
	chartId: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	yAccessor: _propTypes2.default.func,
	tooltipSVG: _propTypes2.default.func,
	backgroundShapeSVG: _propTypes2.default.func,
	bgwidth: _propTypes2.default.number,
	bgheight: _propTypes2.default.number,
	bgFill: _propTypes2.default.string.isRequired,
	bgOpacity: _propTypes2.default.number.isRequired,
	tooltipContent: _propTypes2.default.func.isRequired,
	origin: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.func]).isRequired,
	fontFamily: _propTypes2.default.string,
	fontSize: _propTypes2.default.number
};

HoverTooltip.contextTypes = {
	margin: _propTypes2.default.object.isRequired,
	ratio: _propTypes2.default.number.isRequired
};

HoverTooltip.defaultProps = {
	// bgwidth: 150,
	// bgheight: 50,
	tooltipSVG: tooltipSVG,
	tooltipCanvas: tooltipCanvas,
	origin: origin,
	fill: "#D4E2FD",
	bgFill: "#D4E2FD",
	bgOpacity: 0.5,
	stroke: "#9B9BFF",
	fontFill: "#000000",
	opacity: 0.8,
	backgroundShapeSVG: backgroundShapeSVG,
	backgroundShapeCanvas: backgroundShapeCanvas,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12
};

var PADDING = 5;
var X = 10;
var Y = 10;

/* eslint-disable react/prop-types */
function backgroundShapeSVG(_ref, _ref2) {
	var fill = _ref.fill,
	    stroke = _ref.stroke,
	    opacity = _ref.opacity;
	var height = _ref2.height,
	    width = _ref2.width;

	return _react2.default.createElement("rect", {
		height: height,
		width: width,
		fill: fill,
		opacity: opacity,
		stroke: stroke });
}

function tooltipSVG(_ref3, content) {
	var fontFamily = _ref3.fontFamily,
	    fontSize = _ref3.fontSize,
	    fontFill = _ref3.fontFill;

	var tspans = [];
	var startY = Y + fontSize * 0.9;

	for (var i = 0; i < content.y.length; i++) {
		var y = content.y[i];
		var textY = startY + fontSize * (i + 1);

		tspans.push(_react2.default.createElement(
			"tspan",
			{ key: "L-" + i, x: X, y: textY, fill: y.stroke },
			y.label
		));
		tspans.push(_react2.default.createElement(
			"tspan",
			{ key: i },
			": "
		));
		tspans.push(_react2.default.createElement(
			"tspan",
			{ key: "V-" + i },
			y.value
		));
	}
	return _react2.default.createElement(
		"text",
		{ fontFamily: fontFamily, fontSize: fontSize, fill: fontFill },
		_react2.default.createElement(
			"tspan",
			{ x: X, y: startY },
			content.x
		),
		tspans
	);
}
/* eslint-enable react/prop-types */

function backgroundShapeCanvas(props, _ref4, ctx) {
	var width = _ref4.width,
	    height = _ref4.height;
	var fill = props.fill,
	    stroke = props.stroke,
	    opacity = props.opacity;


	ctx.fillStyle = (0, _utils.hexToRGBA)(fill, opacity);
	ctx.strokeStyle = stroke;
	ctx.beginPath();
	ctx.rect(0, 0, width, height);
	ctx.fill();
	ctx.stroke();
}

function tooltipCanvas(_ref5, content, ctx) {
	var fontFamily = _ref5.fontFamily,
	    fontSize = _ref5.fontSize,
	    fontFill = _ref5.fontFill;

	var startY = Y + fontSize * 0.9;
	ctx.font = fontSize + "px " + fontFamily;
	ctx.fillStyle = fontFill;
	ctx.textAlign = "left";
	ctx.fillText(content.x, X, startY);

	for (var i = 0; i < content.y.length; i++) {
		var y = content.y[i];
		var textY = startY + fontSize * (i + 1);
		ctx.fillStyle = y.stroke || fontFill;
		ctx.fillText(y.label, X, textY);

		ctx.fillStyle = fontFill;
		ctx.fillText(": " + y.value, X + ctx.measureText(y.label).width, textY);
	}
}

function _drawOnCanvas(ctx, props, context, pointer, height) {
	var margin = context.margin,
	    ratio = context.ratio;
	var bgFill = props.bgFill,
	    bgOpacity = props.bgOpacity;
	var backgroundShapeCanvas = props.backgroundShapeCanvas,
	    tooltipCanvas = props.tooltipCanvas;


	var originX = 0.5 * ratio + margin.left;
	var originY = 0.5 * ratio + margin.top;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.scale(ratio, ratio);

	ctx.translate(originX, originY);

	var x = pointer.x,
	    y = pointer.y,
	    content = pointer.content,
	    centerX = pointer.centerX,
	    pointWidth = pointer.pointWidth,
	    bgSize = pointer.bgSize;


	ctx.fillStyle = (0, _utils.hexToRGBA)(bgFill, bgOpacity);
	ctx.beginPath();
	ctx.rect(centerX - pointWidth / 2, 0, pointWidth, height);
	ctx.fill();

	ctx.translate(x, y);
	backgroundShapeCanvas(props, bgSize, ctx);
	tooltipCanvas(props, content, ctx);

	ctx.restore();
}

function calculateTooltipSize(_ref6, content, ctx) {
	var fontFamily = _ref6.fontFamily,
	    fontSize = _ref6.fontSize,
	    fontFill = _ref6.fontFill;

	if ((0, _utils.isNotDefined)(ctx)) {
		var canvas = document.createElement("canvas");
		ctx = canvas.getContext("2d");
	}

	ctx.font = fontSize + "px " + fontFamily;
	ctx.fillStyle = fontFill;
	ctx.textAlign = "left";

	var measureText = function measureText(str) {
		return {
			width: ctx.measureText(str).width,
			height: fontSize
		};
	};

	var _content$y$map$reduce = content.y.map(function (_ref7) {
		var label = _ref7.label,
		    value = _ref7.value;
		return measureText(label + ": " + value);
	})
	// Sum all y and x sizes (begin with x label size)
	.reduce(function (res, size) {
		return sumSizes(res, size);
	}, measureText(String(content.x))),
	    width = _content$y$map$reduce.width,
	    height = _content$y$map$reduce.height;

	return {
		width: width + 2 * X,
		height: height + 2 * Y
	};
}

function sumSizes() {
	for (var _len = arguments.length, sizes = Array(_len), _key = 0; _key < _len; _key++) {
		sizes[_key] = arguments[_key];
	}

	return {
		width: Math.max.apply(Math, _toConsumableArray(sizes.map(function (size) {
			return size.width;
		}))),
		height: (0, _d3Array.sum)(sizes, function (d) {
			return d.height;
		})
	};
}

function normalizeX(x, bgSize, pointWidth, width) {
	// return x - bgSize.width - pointWidth / 2 - PADDING * 2 < 0
	return x < width / 2 ? x + pointWidth / 2 + PADDING : x - bgSize.width - pointWidth / 2 - PADDING;
}

function normalizeY(y, bgSize) {
	return y - bgSize.height <= 0 ? y + PADDING : y - bgSize.height - PADDING;
}

function origin(props, moreProps, bgSize, pointWidth) {
	var chartId = props.chartId,
	    yAccessor = props.yAccessor;
	var mouseXY = moreProps.mouseXY,
	    xAccessor = moreProps.xAccessor,
	    currentItem = moreProps.currentItem,
	    xScale = moreProps.xScale,
	    chartConfig = moreProps.chartConfig,
	    width = moreProps.width;

	var y = (0, _utils.last)(mouseXY);

	var xValue = xAccessor(currentItem);
	var x = Math.round(xScale(xValue));

	if ((0, _utils.isDefined)(chartId) && (0, _utils.isDefined)(yAccessor) && (0, _utils.isDefined)(chartConfig) && (0, _utils.isDefined)(chartConfig.findIndex)) {
		var yValue = yAccessor(currentItem);
		var chartIndex = chartConfig.findIndex(function (x) {
			return x.id === chartId;
		});

		y = Math.round(chartConfig[chartIndex].yScale(yValue));
	}

	x = normalizeX(x, bgSize, pointWidth, width);
	y = normalizeY(y, bgSize);

	return [x, y];
}

function helper(props, moreProps, ctx) {
	var show = moreProps.show,
	    xScale = moreProps.xScale,
	    currentItem = moreProps.currentItem,
	    plotData = moreProps.plotData;
	var origin = props.origin,
	    tooltipContent = props.tooltipContent;
	var xAccessor = moreProps.xAccessor,
	    displayXAccessor = moreProps.displayXAccessor;


	if (!show || (0, _utils.isNotDefined)(currentItem)) return;

	var xValue = xAccessor(currentItem);

	if (!show || (0, _utils.isNotDefined)(xValue)) return;

	var content = tooltipContent({ currentItem: currentItem, xAccessor: displayXAccessor });
	var centerX = xScale(xValue);
	var pointWidth = Math.abs(xScale(xAccessor((0, _utils.last)(plotData))) - xScale(xAccessor((0, _utils.first)(plotData)))) / (plotData.length - 1);

	var bgSize = calculateTooltipSize(props, content, ctx);

	var _origin = origin(props, moreProps, bgSize, pointWidth),
	    _origin2 = _slicedToArray(_origin, 2),
	    x = _origin2[0],
	    y = _origin2[1];

	return { x: x, y: y, content: content, centerX: centerX, pointWidth: pointWidth, bgSize: bgSize };
}

exports.default = HoverTooltip;
//# sourceMappingURL=HoverTooltip.js.map