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

function Square(props) {
	var className = props.className,
	    stroke = props.stroke,
	    strokeWidth = props.strokeWidth,
	    opacity = props.opacity,
	    fill = props.fill,
	    point = props.point,
	    width = props.width;

	var w = (0, _utils.functor)(width)(point.datum);
	var x = point.x - w / 2;
	var y = point.y - w / 2;
	return _react2.default.createElement("rect", {
		className: className,
		x: x,
		y: y,
		stroke: stroke,
		strokeWidth: strokeWidth,
		fillOpacity: opacity,
		fill: fill,
		width: w,
		height: w
	});
}
Square.propTypes = {
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
	width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]).isRequired
};
Square.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-marker-rect"
};
Square.drawOnCanvas = function (props, point, ctx) {
	var stroke = props.stroke,
	    fill = props.fill,
	    opacity = props.opacity,
	    strokeWidth = props.strokeWidth;

	ctx.strokeStyle = stroke;
	ctx.lineWidth = strokeWidth;
	if (fill !== "none") {
		ctx.fillStyle = (0, _utils.hexToRGBA)(fill, opacity);
	}
	Square.drawOnCanvasWithNoStateChange(props, point, ctx);
};
Square.drawOnCanvasWithNoStateChange = function (props, point, ctx) {
	var width = props.width;

	var w = (0, _utils.functor)(width)(point.datum);
	var x = point.x - w / 2;
	var y = point.y - w / 2;
	ctx.beginPath();
	ctx.rect(x, y, w, w);
	ctx.stroke();
	ctx.fill();
};
exports.default = Square;
//# sourceMappingURL=SquareMarker.js.map