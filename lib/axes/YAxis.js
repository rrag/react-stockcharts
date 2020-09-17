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

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YAxis = function (_Component) {
	_inherits(YAxis, _Component);

	function YAxis(props, context) {
		_classCallCheck(this, YAxis);

		var _this = _possibleConstructorReturn(this, (YAxis.__proto__ || Object.getPrototypeOf(YAxis)).call(this, props, context));

		_this.axisZoomCallback = _this.axisZoomCallback.bind(_this);
		return _this;
	}

	_createClass(YAxis, [{
		key: "axisZoomCallback",
		value: function axisZoomCallback(newYDomain) {
			var _context = this.context,
			    chartId = _context.chartId,
			    yAxisZoom = _context.yAxisZoom;

			yAxisZoom(chartId, newYDomain);
		}
	}, {
		key: "render",
		value: function render() {
			var _helper = helper(this.props, this.context),
			    zoomEnabled = _helper.zoomEnabled,
			    moreProps = _objectWithoutProperties(_helper, ["zoomEnabled"]);

			return _react2.default.createElement(_Axis2.default, _extends({}, this.props, moreProps, {
				zoomEnabled: this.props.zoomEnabled && zoomEnabled,
				edgeClip: true,
				axisZoomCallback: this.axisZoomCallback,
				zoomCursorClassName: "react-stockcharts-ns-resize-cursor" }));
		}
	}]);

	return YAxis;
}(_react.Component);

YAxis.propTypes = {
	axisAt: _propTypes2.default.oneOfType([_propTypes2.default.oneOf(["left", "right", "middle"]), _propTypes2.default.number]).isRequired,
	orient: _propTypes2.default.oneOf(["left", "right"]).isRequired,
	innerTickSize: _propTypes2.default.number,
	outerTickSize: _propTypes2.default.number,
	tickFormat: _propTypes2.default.func,
	tickPadding: _propTypes2.default.number,
	tickSize: _propTypes2.default.number,
	ticks: _propTypes2.default.number,
	yZoomWidth: _propTypes2.default.number,
	tickValues: _propTypes2.default.array,
	showTicks: _propTypes2.default.bool,
	className: _propTypes2.default.string,
	zoomEnabled: _propTypes2.default.bool,
	onContextMenu: _propTypes2.default.func,
	onDoubleClick: _propTypes2.default.func
};

YAxis.defaultProps = {
	showTicks: true,
	showTickLabel: true,
	showDomain: true,
	className: "react-stockcharts-y-axis",
	ticks: 10,
	outerTickSize: 0,
	domainClassName: "react-stockcharts-axis-domain",
	fill: "none",
	stroke: "#FFFFFF",
	strokeWidth: 1,
	opacity: 1,
	innerTickSize: 5,
	tickPadding: 6,
	tickStroke: "#000000",
	tickStrokeOpacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fontWeight: 400,
	yZoomWidth: 40,
	zoomEnabled: true,
	getMouseDelta: function getMouseDelta(startXY, mouseXY) {
		return startXY[1] - mouseXY[1];
	}
};

YAxis.contextTypes = {
	yAxisZoom: _propTypes2.default.func.isRequired,
	chartId: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired,
	chartConfig: _propTypes2.default.object.isRequired
};

function helper(props, context) {
	var axisAt = props.axisAt,
	    yZoomWidth = props.yZoomWidth,
	    orient = props.orient;
	var _context$chartConfig = context.chartConfig,
	    width = _context$chartConfig.width,
	    height = _context$chartConfig.height;


	var axisLocation = void 0;
	var y = 0,
	    w = yZoomWidth,
	    h = height;

	if (axisAt === "left") {
		axisLocation = 0;
	} else if (axisAt === "right") {
		axisLocation = width;
	} else if (axisAt === "middle") {
		axisLocation = width / 2;
	} else {
		axisLocation = axisAt;
	}

	var x = orient === "left" ? -yZoomWidth : 0;

	return {
		transform: [axisLocation, 0],
		range: [0, height],
		getScale: getYScale,
		bg: { x: x, y: y, h: h, w: w },
		zoomEnabled: context.chartConfig.yPan
	};
}

function getYScale(moreProps) {
	var _moreProps$chartConfi = moreProps.chartConfig,
	    scale = _moreProps$chartConfi.yScale,
	    flipYScale = _moreProps$chartConfi.flipYScale,
	    height = _moreProps$chartConfi.height;

	if (scale.invert) {
		var trueRange = flipYScale ? [0, height] : [height, 0];
		var trueDomain = trueRange.map(scale.invert);
		return scale.copy().domain(trueDomain).range(trueRange);
	}
	return scale;
}

exports.default = YAxis;
//# sourceMappingURL=YAxis.js.map