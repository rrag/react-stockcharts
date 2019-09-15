"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _LineSeries = require("./LineSeries");

var _LineSeries2 = _interopRequireDefault(_LineSeries);

var _AreaOnlySeries = require("./AreaOnlySeries");

var _AreaOnlySeries2 = _interopRequireDefault(_AreaOnlySeries);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AreaSeries(props) {
	var yAccessor = props.yAccessor,
	    baseAt = props.baseAt;
	var className = props.className,
	    opacity = props.opacity,
	    stroke = props.stroke,
	    strokeWidth = props.strokeWidth,
	    strokeOpacity = props.strokeOpacity,
	    strokeDasharray = props.strokeDasharray,
	    canvasGradient = props.canvasGradient,
	    fill = props.fill,
	    interpolation = props.interpolation,
	    style = props.style,
	    canvasClip = props.canvasClip;


	return _react2.default.createElement(
		"g",
		{ className: className },
		_react2.default.createElement(_AreaOnlySeries2.default, {
			yAccessor: yAccessor,
			interpolation: interpolation,
			base: baseAt,
			canvasGradient: canvasGradient,
			fill: fill,
			opacity: opacity,
			style: style,
			canvasClip: canvasClip,
			stroke: "none"
		}),
		_react2.default.createElement(_LineSeries2.default, {
			yAccessor: yAccessor,
			stroke: stroke,
			strokeWidth: strokeWidth,
			strokeOpacity: strokeOpacity,
			strokeDasharray: strokeDasharray,
			interpolation: interpolation,
			style: style,
			canvasClip: canvasClip,
			fill: "none",
			hoverHighlight: false
		})
	);
}

AreaSeries.propTypes = {
	stroke: _propTypes2.default.string,
	strokeWidth: _propTypes2.default.number,
	canvasGradient: _propTypes2.default.func,
	fill: _propTypes2.default.string.isRequired,
	strokeOpacity: _propTypes2.default.number.isRequired,
	opacity: _propTypes2.default.number.isRequired,
	className: _propTypes2.default.string,
	yAccessor: _propTypes2.default.func.isRequired,
	baseAt: _propTypes2.default.func,
	interpolation: _propTypes2.default.func,
	canvasClip: _propTypes2.default.func,
	style: _propTypes2.default.object,
	strokeDasharray: _propTypes2.default.oneOf(_utils.strokeDashTypes)
};

AreaSeries.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	strokeOpacity: 1,
	strokeDasharray: "Solid",
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-area"
};

exports.default = AreaSeries;
//# sourceMappingURL=AreaSeries.js.map