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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
	xPosition: _propTypes2.default.func,
	drawCoordinate: _propTypes2.default.func,
	displayFormat: _propTypes2.default.func.isRequired,
	at: _propTypes2.default.oneOf(["bottom", "top"]),
	orient: _propTypes2.default.oneOf(["bottom", "top"]),
	text: _propTypes2.default.shape({
		fontStyle: _propTypes2.default.string,
		fontWeight: _propTypes2.default.string,
		fontFamily: _propTypes2.default.string,
		fontSize: _propTypes2.default.number,
		fill: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
	}),
	bg: _propTypes2.default.shape({
		fill: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
		stroke: _propTypes2.default.string,
		strokeWidth: _propTypes2.default.number,
		padding: _propTypes2.default.shape({
			left: _propTypes2.default.number,
			right: _propTypes2.default.number,
			top: _propTypes2.default.number,
			bottom: _propTypes2.default.number
		})
	}),
	dx: _propTypes2.default.number,
	dy: _propTypes2.default.number
};

var defaultProps = {
	xPosition: xPosition,
	drawCoordinate: drawCoordinate,
	at: "bottom",
	orient: "bottom",

	text: {
		fontStyle: "",
		fontWeight: "",
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 13,
		fill: "rgb(35, 35, 35)"
	},
	bg: {
		fill: "rgb(255, 255, 255)",
		stroke: "rgb(35, 35, 35)",
		strokeWidth: 1,
		padding: {
			left: 7,
			right: 7,
			top: 4,
			bottom: 4
		}
	},
	dx: 7,
	dy: 7
};

var MouseCoordinateXV2 = function (_Component) {
	_inherits(MouseCoordinateXV2, _Component);

	function MouseCoordinateXV2(props) {
		_classCallCheck(this, MouseCoordinateXV2);

		var _this = _possibleConstructorReturn(this, (MouseCoordinateXV2.__proto__ || Object.getPrototypeOf(MouseCoordinateXV2)).call(this, props));

		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(MouseCoordinateXV2, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var show = moreProps.show,
			    currentItem = moreProps.currentItem;
			var drawCoordinate = this.props.drawCoordinate;


			if (show && currentItem != null) {
				var shape = getXCoordinateInfo(ctx, this.props, moreProps);
				drawCoordinate(ctx, shape, this.props, moreProps);
			}
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				clip: false,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getMouseCanvas,
				drawOn: ["mousemove", "pan", "drag"]
			});
		}
	}]);

	return MouseCoordinateXV2;
}(_react.Component);

MouseCoordinateXV2.defaultProps = defaultProps;
MouseCoordinateXV2.propTypes = propTypes;

function xPosition(props, moreProps) {
	var currentItem = moreProps.currentItem,
	    xAccessor = moreProps.xAccessor;

	return xAccessor(currentItem);
}
function getXCoordinateInfo(ctx, props, moreProps) {
	var xPosition = props.xPosition;

	var xValue = xPosition(props, moreProps);
	var at = props.at,
	    displayFormat = props.displayFormat;
	var text = props.text;
	var xScale = moreProps.xScale,
	    height = moreProps.chartConfig.height;

	ctx.font = text.fontStyle + " " + text.fontWeight + " " + text.fontSize + "px " + text.fontFamily;

	var t = displayFormat(xValue);
	var textWidth = ctx.measureText(t).width;

	var y = at === "bottom" ? height : 0;
	var x = Math.round(xScale(xValue));

	return {
		x: x,
		y: y,
		textWidth: textWidth,
		text: t
	};
}

function drawCoordinate(ctx, shape, props, moreProps) {
	var x = shape.x,
	    y = shape.y,
	    textWidth = shape.textWidth,
	    text = shape.text;
	var orient = props.orient,
	    dx = props.dx,
	    dy = props.dy;
	var _props$bg = props.bg,
	    padding = _props$bg.padding,
	    fill = _props$bg.fill,
	    stroke = _props$bg.stroke,
	    strokeWidth = _props$bg.strokeWidth,
	    _props$text = props.text,
	    fontSize = _props$text.fontSize,
	    textFill = _props$text.fill;


	ctx.textAlign = "center";

	var sign = orient === "top" ? -1 : 1;
	var halfWidth = Math.round(textWidth / 2 + padding.right);
	var height = Math.round(fontSize + padding.top + padding.bottom);

	ctx.strokeStyle = typeof stroke === "function" ? stroke(moreProps, ctx) : stroke;
	ctx.fillStyle = typeof fill === "function" ? fill(moreProps, ctx) : fill;
	ctx.lineWidth = typeof strokeWidth === "function" ? strokeWidth(moreProps) : strokeWidth;

	ctx.beginPath();

	ctx.moveTo(x, y);
	ctx.lineTo(x + dx, y + sign * dy);
	ctx.lineTo(x + halfWidth, y + sign * dy);
	ctx.lineTo(x + halfWidth, y + sign * (dy + height));
	ctx.lineTo(x - halfWidth, y + sign * (dy + height));
	ctx.lineTo(x - halfWidth, y + sign * dy);
	ctx.lineTo(x - dx, y + sign * dy);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = typeof textFill === "function" ? textFill(moreProps, ctx) : textFill;

	ctx.textBaseline = orient === "top" ? "alphabetic" : "hanging";
	var pad = orient === "top" ? padding.bottom : padding.top;

	ctx.fillText(text, x, y + sign * (dy + pad + 2));
}

exports.default = MouseCoordinateXV2;
//# sourceMappingURL=MouseCoordinateXV2.js.map