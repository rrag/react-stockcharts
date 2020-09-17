"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getYCoordinate = getYCoordinate;

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

var MouseCoordinateY = function (_Component) {
	_inherits(MouseCoordinateY, _Component);

	function MouseCoordinateY(props) {
		_classCallCheck(this, MouseCoordinateY);

		var _this = _possibleConstructorReturn(this, (MouseCoordinateY.__proto__ || Object.getPrototypeOf(MouseCoordinateY)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(MouseCoordinateY, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var props = helper(this.props, moreProps);
			if ((0, _utils.isNotDefined)(props)) return null;

			(0, _EdgeCoordinateV.drawOnCanvas)(ctx, props);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var props = helper(this.props, moreProps);
			if ((0, _utils.isNotDefined)(props)) return null;

			return (0, _EdgeCoordinateV.renderSVG)(props);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				clip: false,
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getMouseCanvas,
				drawOn: ["mousemove", "pan", "drag"]
			});
		}
	}]);

	return MouseCoordinateY;
}(_react.Component);

MouseCoordinateY.propTypes = {
	displayFormat: _propTypes2.default.func.isRequired,
	yAxisPad: _propTypes2.default.number,
	rectWidth: _propTypes2.default.number,
	rectHeight: _propTypes2.default.number,
	orient: _propTypes2.default.oneOf(["bottom", "top", "left", "right"]),
	at: _propTypes2.default.oneOf(["bottom", "top", "left", "right"]),
	dx: _propTypes2.default.number,
	fill: _propTypes2.default.string,
	opacity: _propTypes2.default.number,
	fontFamily: _propTypes2.default.string,
	fontSize: _propTypes2.default.number,
	textFill: _propTypes2.default.string
};

MouseCoordinateY.defaultProps = {
	yAxisPad: 0,
	rectWidth: 50,
	rectHeight: 20,
	orient: "left",
	at: "left",
	dx: 0,
	arrowWidth: 10,
	fill: "#525252",
	opacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",

	// stroke: "#684F1D",
	strokeOpacity: 1,
	strokeWidth: 1
};

function helper(props, moreProps) {
	var chartId = moreProps.chartId;
	var currentCharts = moreProps.currentCharts,
	    mouseXY = moreProps.mouseXY;


	if ((0, _utils.isNotDefined)(mouseXY)) return null;
	if (currentCharts.indexOf(chartId) < 0) return null;

	var show = moreProps.show;

	if (!show) return null;

	var y = mouseXY[1];
	var yScale = moreProps.chartConfig.yScale;
	var displayFormat = props.displayFormat;


	var coordinate = displayFormat(yScale.invert(y));

	return getYCoordinate(y, coordinate, props, moreProps);
}

function getYCoordinate(y, displayValue, props, moreProps) {
	var width = moreProps.width;
	var orient = props.orient,
	    at = props.at,
	    rectWidth = props.rectWidth,
	    rectHeight = props.rectHeight,
	    dx = props.dx;
	var fill = props.fill,
	    opacity = props.opacity,
	    fontFamily = props.fontFamily,
	    fontSize = props.fontSize,
	    textFill = props.textFill,
	    arrowWidth = props.arrowWidth;
	var stroke = props.stroke,
	    strokeOpacity = props.strokeOpacity,
	    strokeWidth = props.strokeWidth;


	var x1 = 0,
	    x2 = width;
	var edgeAt = at === "right" ? width : 0;

	var type = "horizontal";
	var hideLine = true;

	var coordinateProps = {
		coordinate: displayValue,
		show: true,
		type: type,
		orient: orient,
		edgeAt: edgeAt,
		hideLine: hideLine,
		fill: fill,
		opacity: opacity,

		fontFamily: fontFamily,
		fontSize: fontSize,
		textFill: textFill,

		stroke: stroke,
		strokeOpacity: strokeOpacity,
		strokeWidth: strokeWidth,

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

exports.default = MouseCoordinateY;
//# sourceMappingURL=MouseCoordinateY.js.map