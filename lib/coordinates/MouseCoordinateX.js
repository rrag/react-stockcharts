"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

var MouseCoordinateX = function (_Component) {
	_inherits(MouseCoordinateX, _Component);

	function MouseCoordinateX(props) {
		_classCallCheck(this, MouseCoordinateX);

		var _this = _possibleConstructorReturn(this, (MouseCoordinateX.__proto__ || Object.getPrototypeOf(MouseCoordinateX)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(MouseCoordinateX, [{
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
				svgDraw: this.renderSVG,
				clip: false,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getMouseCanvas,
				drawOn: ["mousemove", "pan", "drag"]
			});
		}
	}]);

	return MouseCoordinateX;
}(_react.Component);

MouseCoordinateX.propTypes = {
	displayFormat: _propTypes2.default.func.isRequired,
	yAxisPad: _propTypes2.default.number,
	rectWidth: _propTypes2.default.number,
	rectHeight: _propTypes2.default.number,
	orient: _propTypes2.default.oneOf(["bottom", "top", "left", "right"]),
	at: _propTypes2.default.oneOf(["bottom", "top", "left", "right"]),
	fill: _propTypes2.default.string,
	opacity: _propTypes2.default.number,
	fontFamily: _propTypes2.default.string,
	fontSize: _propTypes2.default.number,
	textFill: _propTypes2.default.string,
	snapX: _propTypes2.default.bool
};

function customX(props, moreProps) {
	var xScale = moreProps.xScale,
	    xAccessor = moreProps.xAccessor,
	    currentItem = moreProps.currentItem,
	    mouseXY = moreProps.mouseXY;
	var snapX = props.snapX;

	var x = snapX ? xScale(xAccessor(currentItem)) : mouseXY[0];

	var displayXAccessor = moreProps.displayXAccessor;
	var displayFormat = props.displayFormat;

	var coordinate = snapX ? displayFormat(displayXAccessor(currentItem)) : displayFormat(xScale.invert(x));
	return { x: x, coordinate: coordinate };
}

MouseCoordinateX.defaultProps = {
	yAxisPad: 0,
	rectWidth: 80,
	rectHeight: 20,

	// rectRadius: 5,
	// stroke: "#684F1D",
	strokeOpacity: 1,
	strokeWidth: 1,

	orient: "bottom",
	at: "bottom",

	fill: "#525252",
	opacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",
	snapX: true,
	customX: customX
};

function helper(props, moreProps) {
	var show = moreProps.show,
	    currentItem = moreProps.currentItem;
	var height = moreProps.chartConfig.height;


	if ((0, _utils.isNotDefined)(currentItem)) return null;

	var customX = props.customX;
	var orient = props.orient,
	    at = props.at;
	var stroke = props.stroke,
	    strokeOpacity = props.strokeOpacity,
	    strokeWidth = props.strokeWidth;
	var rectRadius = props.rectRadius,
	    rectWidth = props.rectWidth,
	    rectHeight = props.rectHeight;
	var fill = props.fill,
	    opacity = props.opacity,
	    fontFamily = props.fontFamily,
	    fontSize = props.fontSize,
	    textFill = props.textFill;


	var edgeAt = at === "bottom" ? height : 0;

	var _customX = customX(props, moreProps),
	    x = _customX.x,
	    coordinate = _customX.coordinate;

	var type = "vertical";
	var y1 = 0,
	    y2 = height;
	var hideLine = true;

	var coordinateProps = {
		coordinate: coordinate,
		show: show,
		type: type,
		orient: orient,
		edgeAt: edgeAt,
		hideLine: hideLine,
		fill: fill, opacity: opacity, fontFamily: fontFamily, fontSize: fontSize, textFill: textFill,
		stroke: stroke, strokeOpacity: strokeOpacity, strokeWidth: strokeWidth,
		rectWidth: rectWidth,
		rectHeight: rectHeight,
		rectRadius: rectRadius,
		arrowWidth: 0,
		x1: x,
		x2: x,
		y1: y1,
		y2: y2
	};
	return coordinateProps;
}

exports.default = MouseCoordinateX;
//# sourceMappingURL=MouseCoordinateX.js.map