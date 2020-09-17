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

var _Axis = require("./Axis");

var _Axis2 = _interopRequireDefault(_Axis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XAxis = function (_Component) {
	_inherits(XAxis, _Component);

	function XAxis(props, context) {
		_classCallCheck(this, XAxis);

		var _this = _possibleConstructorReturn(this, (XAxis.__proto__ || Object.getPrototypeOf(XAxis)).call(this, props, context));

		_this.axisZoomCallback = _this.axisZoomCallback.bind(_this);
		return _this;
	}

	_createClass(XAxis, [{
		key: "axisZoomCallback",
		value: function axisZoomCallback(newXDomain) {
			var xAxisZoom = this.context.xAxisZoom;

			xAxisZoom(newXDomain);
		}
	}, {
		key: "render",
		value: function render() {
			var showTicks = this.props.showTicks;

			var moreProps = helper(this.props, this.context);

			return _react2.default.createElement(_Axis2.default, _extends({}, this.props, moreProps, { x: true,
				zoomEnabled: this.props.zoomEnabled && showTicks,
				axisZoomCallback: this.axisZoomCallback,
				zoomCursorClassName: "react-stockcharts-ew-resize-cursor" }));
		}
	}]);

	return XAxis;
}(_react.Component);

XAxis.propTypes = {
	axisAt: _propTypes2.default.oneOfType([_propTypes2.default.oneOf(["top", "bottom", "middle"]), _propTypes2.default.number]).isRequired,
	orient: _propTypes2.default.oneOf(["top", "bottom"]).isRequired,
	innerTickSize: _propTypes2.default.number,
	outerTickSize: _propTypes2.default.number,
	tickFormat: _propTypes2.default.func,
	tickPadding: _propTypes2.default.number,
	tickSize: _propTypes2.default.number,
	ticks: _propTypes2.default.number,
	tickValues: _propTypes2.default.array,
	showTicks: _propTypes2.default.bool,
	className: _propTypes2.default.string,
	zoomEnabled: _propTypes2.default.bool,
	onContextMenu: _propTypes2.default.func,
	onDoubleClick: _propTypes2.default.func
};

XAxis.defaultProps = {
	showTicks: true,
	showTickLabel: true,
	showDomain: true,
	className: "react-stockcharts-x-axis",
	ticks: 10,
	outerTickSize: 0,
	fill: "none",
	stroke: "#000000", // x axis stroke color
	strokeWidth: 1,
	opacity: 1, // x axis opacity
	domainClassName: "react-stockcharts-axis-domain",
	innerTickSize: 5,
	tickPadding: 6,
	tickStroke: "#000000", // tick/grid stroke
	tickStrokeOpacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fontWeight: 400,
	xZoomHeight: 25,
	zoomEnabled: true,
	getMouseDelta: function getMouseDelta(startXY, mouseXY) {
		return startXY[0] - mouseXY[0];
	}
};

XAxis.contextTypes = {
	chartConfig: _propTypes2.default.object.isRequired,
	xAxisZoom: _propTypes2.default.func.isRequired
};

function helper(props, context) {
	var axisAt = props.axisAt,
	    xZoomHeight = props.xZoomHeight,
	    orient = props.orient;
	var _context$chartConfig = context.chartConfig,
	    width = _context$chartConfig.width,
	    height = _context$chartConfig.height;


	var axisLocation = void 0;
	var x = 0,
	    w = width,
	    h = xZoomHeight;

	if (axisAt === "top") axisLocation = 0;else if (axisAt === "bottom") axisLocation = height;else if (axisAt === "middle") axisLocation = height / 2;else axisLocation = axisAt;

	var y = orient === "top" ? -xZoomHeight : 0;

	return {
		transform: [0, axisLocation],
		range: [0, width],
		getScale: getXScale,
		bg: { x: x, y: y, h: h, w: w }
	};
}

function getXScale(moreProps) {
	var scale = moreProps.xScale,
	    width = moreProps.width;


	if (scale.invert) {
		var trueRange = [0, width];
		var trueDomain = trueRange.map(scale.invert);
		return scale.copy().domain(trueDomain).range(trueRange);
	}

	return scale;
}

exports.default = XAxis;
//# sourceMappingURL=XAxis.js.map