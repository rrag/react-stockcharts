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

var _EdgeCoordinateV = require("./EdgeCoordinateV3");

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PriceCoordinate = function (_Component) {
	_inherits(PriceCoordinate, _Component);

	function PriceCoordinate(props) {
		_classCallCheck(this, PriceCoordinate);

		var _this = _possibleConstructorReturn(this, (PriceCoordinate.__proto__ || Object.getPrototypeOf(PriceCoordinate)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(PriceCoordinate, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var props = helper(this.props, moreProps);
			(0, _EdgeCoordinateV.drawOnCanvas)(ctx, props);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var props = helper(this.props, moreProps);
			return (0, _EdgeCoordinateV.renderSVG)(props);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				clip: false,
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getAxisCanvas,
				drawOn: ["pan"]
			});
		}
	}]);

	return PriceCoordinate;
}(_react.Component);

PriceCoordinate.propTypes = {
	displayFormat: _propTypes2.default.func.isRequired,
	yAxisPad: _propTypes2.default.number,
	rectWidth: _propTypes2.default.number,
	rectHeight: _propTypes2.default.number,
	orient: _propTypes2.default.oneOf(["bottom", "top", "left", "right"]),
	at: _propTypes2.default.oneOf(["bottom", "top", "left", "right"]),
	price: _propTypes2.default.number,
	dx: _propTypes2.default.number,
	arrowWidth: _propTypes2.default.number,
	opacity: _propTypes2.default.number,
	lineOpacity: _propTypes2.default.number,
	lineStroke: _propTypes2.default.string,
	fontFamily: _propTypes2.default.string,
	fontSize: _propTypes2.default.number,
	fill: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
	strokeDasharray: _propTypes2.default.oneOf(_utils.strokeDashTypes),
	stroke: _propTypes2.default.string,
	strokeOpacity: _propTypes2.default.number,
	strokeWidth: _propTypes2.default.number,
	textFill: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func])
};

PriceCoordinate.defaultProps = {
	yAxisPad: 0,
	rectWidth: 50,
	rectHeight: 20,
	orient: "left",
	at: "left",
	price: 0,
	dx: 0,
	arrowWidth: 0,
	fill: "#BAB8b8",
	opacity: 1,
	lineOpacity: 0.2,
	lineStroke: "#000000",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",
	strokeOpacity: 1,
	strokeWidth: 1,
	strokeDasharray: "Solid"
};

function helper(props, moreProps) {
	var width = moreProps.width;
	var yScale = moreProps.chartConfig.yScale;

	var _yScale$domain = yScale.domain(),
	    _yScale$domain2 = _slicedToArray(_yScale$domain, 2),
	    lowerYValue = _yScale$domain2[0],
	    upperYValue = _yScale$domain2[1];

	var price = props.price,
	    stroke = props.stroke,
	    strokeDasharray = props.strokeDasharray,
	    strokeOpacity = props.strokeOpacity,
	    strokeWidth = props.strokeWidth;
	var orient = props.orient,
	    at = props.at,
	    rectWidth = props.rectWidth,
	    rectHeight = props.rectHeight,
	    displayFormat = props.displayFormat,
	    dx = props.dx;
	var fill = props.fill,
	    opacity = props.opacity,
	    fontFamily = props.fontFamily,
	    fontSize = props.fontSize,
	    textFill = props.textFill,
	    arrowWidth = props.arrowWidth,
	    lineOpacity = props.lineOpacity,
	    lineStroke = props.lineStroke;


	var x1 = 0,
	    x2 = width;
	var edgeAt = at === "right" ? width : 0;

	var type = "horizontal";

	var y = yScale(price);
	var show = price <= upperYValue && price >= lowerYValue;

	var coordinate = displayFormat(yScale.invert(y));
	var hideLine = false;

	var coordinateProps = {
		coordinate: coordinate,
		show: show,
		type: type,
		orient: orient,
		edgeAt: edgeAt,
		hideLine: hideLine,
		lineOpacity: lineOpacity,
		lineStroke: lineStroke,
		lineStrokeDasharray: strokeDasharray,
		stroke: stroke,
		strokeOpacity: strokeOpacity,
		strokeWidth: strokeWidth,
		fill: (0, _utils.functor)(fill)(price),
		textFill: (0, _utils.functor)(textFill)(price),
		opacity: opacity, fontFamily: fontFamily, fontSize: fontSize,
		rectWidth: rectWidth,
		rectHeight: rectHeight,
		arrowWidth: arrowWidth,
		dx: dx,
		x1: x1,
		x2: x2,
		y1: y,
		y2: y
	};
	return coordinateProps;
}

exports.default = PriceCoordinate;
//# sourceMappingURL=PriceCoordinate.js.map