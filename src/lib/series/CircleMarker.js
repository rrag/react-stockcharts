"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Circle(props) {
	var className = props.className,
	    stroke = props.stroke,
	    strokeWidth = props.strokeWidth,
	    opacity = props.opacity,
	    fill = props.fill,
	    point = props.point,
	    r = props.r;

	var radius = (0, _utils.functor)(r)(point.datum);
	return _react2.default.createElement("circle", { className: className,
		cx: point.x, cy: point.y,
		stroke: stroke, strokeWidth: strokeWidth,
		fillOpacity: opacity, fill: fill, r: radius });
}

Circle.propTypes = {
	stroke: _propTypes2.default.string,
	fill: _propTypes2.default.string.isRequired,
	opacity: _propTypes2.default.number.isRequired,
	point: _propTypes2.default.shape({
		x: _propTypes2.default.number.isRequired,
		y: _propTypes2.default.number.isRequired,
		datum: _propTypes2.default.object.isRequired
	}).isRequired,
	className: _propTypes2.default.string,
	strokeWidth: _propTypes2.default.number,
	r: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]).isRequired
};

Circle.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-marker-circle"
};

Circle.drawOnCanvas = function (props, point, ctx) {
	var stroke = props.stroke,
	    fill = props.fill,
	    opacity = props.opacity,
	    strokeWidth = props.strokeWidth;


	ctx.strokeStyle = stroke;
	ctx.lineWidth = strokeWidth;

	if (fill !== "none") {
		ctx.fillStyle = (0, _utils.hexToRGBA)(fill, opacity);
	}

	Circle.drawOnCanvasWithNoStateChange(props, point, ctx);
};

Circle.drawOnCanvasWithNoStateChange = function (props, point, ctx) {
	var r = props.r;

	var radius = (0, _utils.functor)(r)(point.datum);

	ctx.moveTo(point.x, point.y);
	ctx.beginPath();
	ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.fill();
};

exports.default = Circle;
//# sourceMappingURL=CircleMarker.js.map