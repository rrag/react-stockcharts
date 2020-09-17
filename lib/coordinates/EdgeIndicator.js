"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Format = require("d3-format");

var _EdgeCoordinateV = require("./EdgeCoordinateV3");

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EdgeIndicator = function (_Component) {
	_inherits(EdgeIndicator, _Component);

	function EdgeIndicator(props) {
		_classCallCheck(this, EdgeIndicator);

		var _this = _possibleConstructorReturn(this, (EdgeIndicator.__proto__ || Object.getPrototypeOf(EdgeIndicator)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(EdgeIndicator, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var edge = helper(this.props, moreProps);
			var props = _extends({}, this.props, edge);
			(0, _EdgeCoordinateV.drawOnCanvas)(ctx, props);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var edge = helper(this.props, moreProps);
			var props = _extends({}, this.props, edge);
			return (0, _EdgeCoordinateV.renderSVG)(props);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				edgeClip: true,
				clip: false,
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getAxisCanvas,
				drawOn: ["pan"]
			});
		}
	}]);

	return EdgeIndicator;
}(_react.Component);

EdgeIndicator.propTypes = {
	yAccessor: _propTypes2.default.func,

	type: _propTypes2.default.oneOf(["horizontal"]),
	className: _propTypes2.default.string,
	fill: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
	lineStroke: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
	textFill: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
	itemType: _propTypes2.default.oneOf(["first", "last"]).isRequired,
	orient: _propTypes2.default.oneOf(["left", "right"]),
	edgeAt: _propTypes2.default.oneOf(["left", "right"]),
	displayFormat: _propTypes2.default.func,
	rectHeight: _propTypes2.default.number,
	rectWidth: _propTypes2.default.number,
	arrowWidth: _propTypes2.default.number,
	lineStrokeDasharray: _propTypes2.default.oneOf(_utils.strokeDashTypes)
};

EdgeIndicator.defaultProps = {
	className: "react-stockcharts-edgeindicator",

	type: "horizontal",
	orient: "left",
	edgeAt: "left",
	textFill: "#FFFFFF",
	displayFormat: (0, _d3Format.format)(".2f"),
	yAxisPad: 0,
	rectHeight: 20,
	rectWidth: 50,
	arrowWidth: 10,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	dx: 0,
	hideLine: false,
	fill: "#8a8a8a",
	opacity: 1,

	stroke: _utils.noop,
	strokeOpacity: 1,
	strokeWidth: 3,
	lineStroke: "#000000",
	lineOpacity: 0.3,
	lineStrokeDasharray: "ShortDash"
};

function helper(props, moreProps) {
	var itemType = props.itemType,
	    yAccessor = props.yAccessor;
	var plotData = moreProps.plotData;


	var item = itemType === "first" ? (0, _utils.first)(plotData, yAccessor) : (0, _utils.last)(plotData, yAccessor);

	// var currentItem = ChartDataUtil.getCurrentItemForChartNew(currentItems, forChart);
	var edge = (0, _utils.isDefined)(item) ? getEdge(props, moreProps, item) : null;

	return edge;
}

function getEdge(props, moreProps, item) {
	var edgeType = props.type,
	    displayFormat = props.displayFormat,
	    edgeAt = props.edgeAt,
	    yAxisPad = props.yAxisPad,
	    orient = props.orient,
	    lineStroke = props.lineStroke;
	var yAccessor = props.yAccessor,
	    fill = props.fill,
	    textFill = props.textFill,
	    rectHeight = props.rectHeight,
	    rectWidth = props.rectWidth,
	    arrowWidth = props.arrowWidth;
	var fontFamily = props.fontFamily,
	    fontSize = props.fontSize;
	var stroke = props.stroke;
	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale,
	    xAccessor = moreProps.xAccessor,
	    width = moreProps.width;


	var yValue = yAccessor(item),
	    xValue = xAccessor(item);

	var x1 = Math.round(xScale(xValue)),
	    y1 = Math.round(yScale(yValue));

	var left = 0,
	    right = width;

	var edgeX = edgeAt === "left" ? left - yAxisPad : right + yAxisPad;

	return {
		// ...props,
		coordinate: displayFormat(yValue),
		show: true,
		type: edgeType,
		orient: orient,
		edgeAt: edgeX,
		fill: (0, _utils.functor)(fill)(item),
		lineStroke: (0, _utils.functor)(lineStroke)(item),
		stroke: (0, _utils.functor)(stroke)(item),
		fontFamily: fontFamily, fontSize: fontSize,
		textFill: (0, _utils.functor)(textFill)(item),
		rectHeight: rectHeight, rectWidth: rectWidth, arrowWidth: arrowWidth,
		x1: x1,
		y1: y1,
		x2: right,
		y2: y1
	};
}

exports.default = EdgeIndicator;
//# sourceMappingURL=EdgeIndicator.js.map