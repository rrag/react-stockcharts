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

function Triangle(props) {
	var className = props.className,
	    strokeWidth = props.strokeWidth,
	    opacity = props.opacity,
	    point = props.point,
	    width = props.width;


	var rotation = getRotationInDegrees(props, point);
	if (rotation == null) return null;

	var fillColor = getFillColor(props);
	var strokeColor = getStrokeColor(props);

	var w = (0, _utils.functor)(width)(point.datum);
	var x = point.x,
	    y = point.y;

	var _getTrianglePoints = getTrianglePoints(w),
	    innerOpposite = _getTrianglePoints.innerOpposite,
	    innerHypotenuse = _getTrianglePoints.innerHypotenuse;

	var points = "\n\t\t" + x + " " + (y - innerHypotenuse) + ",\n\t\t" + (x + w / 2) + " " + (y + innerOpposite) + ",\n\t\t" + (x - w / 2) + " " + (y + innerOpposite) + "\n\t";

	return _react2.default.createElement("polygon", {
		className: className,
		points: points,
		stroke: strokeColor,
		strokeWidth: strokeWidth,
		fillOpacity: opacity,
		fill: fillColor,
		transform: rotation !== 0 ? "rotate(" + rotation + ", " + x + ", " + y + ")" : null
	});
}
Triangle.propTypes = {
	direction: _propTypes2.default.oneOfType([_propTypes2.default.oneOf(["top", "bottom", "left", "right", "hide"]), _propTypes2.default.func]).isRequired,
	stroke: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]).isRequired,
	fill: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]).isRequired,
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
Triangle.defaultProps = {
	direction: "top",
	stroke: "#4682B4",
	strokeWidth: 1,
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-marker-triangle"
};
Triangle.drawOnCanvas = function (props, point, ctx) {
	var stroke = props.stroke,
	    fill = props.fill,
	    opacity = props.opacity,
	    strokeWidth = props.strokeWidth;

	ctx.strokeStyle = stroke;
	ctx.lineWidth = strokeWidth;
	if (fill !== "none") {
		ctx.fillStyle = (0, _utils.hexToRGBA)(fill, opacity);
	}
	Triangle.drawOnCanvasWithNoStateChange(props, point, ctx);
};
Triangle.drawOnCanvasWithNoStateChange = function (props, point, ctx) {
	var width = props.width;

	var w = (0, _utils.functor)(width)(point.datum);
	var x = point.x,
	    y = point.y;

	var _getTrianglePoints2 = getTrianglePoints(w),
	    innerOpposite = _getTrianglePoints2.innerOpposite,
	    innerHypotenuse = _getTrianglePoints2.innerHypotenuse;

	var rotationDeg = getRotationInDegrees(props, point);

	ctx.beginPath();
	ctx.moveTo(x, y - innerHypotenuse);
	ctx.lineTo(x + w / 2, y + innerOpposite);
	ctx.lineTo(x - w / 2, y + innerOpposite);
	ctx.stroke();

	// TODO: rotation does not work
	// example: https://gist.github.com/geoffb/6392450
	if (rotationDeg !== null && rotationDeg !== 0) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rotationDeg * Math.PI / 180); // 45 degrees
		ctx.fill();
		ctx.restore();
	}
	ctx.fill();
};
exports.default = Triangle;


function getTrianglePoints(width) {
	var innerHypotenuse = width / 2 * (1 / Math.cos(30 * Math.PI / 180));
	var innerOpposite = width / 2 * (1 / Math.tan(60 * Math.PI / 180));
	return {
		innerOpposite: innerOpposite,
		innerHypotenuse: innerHypotenuse
	};
}

function getFillColor(props) {
	var fill = props.fill,
	    point = props.point;

	return fill instanceof Function ? fill(point.datum) : fill;
}

function getStrokeColor(props) {
	var stroke = props.stroke,
	    point = props.point;

	return stroke instanceof Function ? stroke(point.datum) : stroke;
}

function getRotationInDegrees(props, point) {
	var direction = props.direction;

	var directionVal = direction instanceof Function ? direction(point.datum) : direction;
	if (directionVal === "hide") return null;

	var rotate = 0;
	switch (directionVal) {
		case "bottom":
			rotate = 180;
			break;
		case "left":
			rotate = -90;
			break;
		case "right":
			rotate = 90;
			break;
	}
	return rotate;
}
//# sourceMappingURL=TriangleMarker.js.map