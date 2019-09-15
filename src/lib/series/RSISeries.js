"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _LineSeries = require("./LineSeries");

var _LineSeries2 = _interopRequireDefault(_LineSeries);

var _StraightLine = require("./StraightLine");

var _StraightLine2 = _interopRequireDefault(_StraightLine);

var _SVGComponent = require("./SVGComponent");

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import AreaSeries from "./AreaSeries";


var RSISeries = function (_Component) {
	_inherits(RSISeries, _Component);

	function RSISeries(props) {
		_classCallCheck(this, RSISeries);

		var _this = _possibleConstructorReturn(this, (RSISeries.__proto__ || Object.getPrototypeOf(RSISeries)).call(this, props));

		_this.renderClip = _this.renderClip.bind(_this);
		_this.topAndBottomClip = _this.topAndBottomClip.bind(_this);
		_this.mainClip = _this.mainClip.bind(_this);

		var id1 = String(Math.round(Math.random() * 10000 * 10000));
		_this.clipPathId1 = "rsi-clip-" + id1;

		var id2 = String(Math.round(Math.random() * 10000 * 10000));
		_this.clipPathId2 = "rsi-clip-" + id2;
		return _this;
	}

	_createClass(RSISeries, [{
		key: "topAndBottomClip",
		value: function topAndBottomClip(ctx, moreProps) {
			var chartConfig = moreProps.chartConfig;
			var _props = this.props,
			    overSold = _props.overSold,
			    overBought = _props.overBought;
			var yScale = chartConfig.yScale,
			    width = chartConfig.width;


			ctx.beginPath();
			ctx.rect(0, yScale(overSold), width, yScale(overBought) - yScale(overSold));
			ctx.clip();
		}
	}, {
		key: "mainClip",
		value: function mainClip(ctx, moreProps) {
			var chartConfig = moreProps.chartConfig;
			var _props2 = this.props,
			    overSold = _props2.overSold,
			    overBought = _props2.overBought;
			var yScale = chartConfig.yScale,
			    width = chartConfig.width,
			    height = chartConfig.height;


			ctx.beginPath();
			ctx.rect(0, 0, width, yScale(overSold));
			ctx.rect(0, yScale(overBought), width, height - yScale(overBought));
			ctx.clip();
		}
	}, {
		key: "renderClip",
		value: function renderClip(moreProps) {
			var chartConfig = moreProps.chartConfig;
			var _props3 = this.props,
			    overSold = _props3.overSold,
			    overBought = _props3.overBought;
			var yScale = chartConfig.yScale,
			    width = chartConfig.width,
			    height = chartConfig.height;


			return _react2.default.createElement(
				"defs",
				null,
				_react2.default.createElement(
					"clipPath",
					{ id: this.clipPathId1 },
					_react2.default.createElement("rect", {
						x: 0,
						y: yScale(overSold),
						width: width,
						height: yScale(overBought) - yScale(overSold)
					})
				),
				_react2.default.createElement(
					"clipPath",
					{ id: this.clipPathId2 },
					_react2.default.createElement("rect", {
						x: 0,
						y: 0,
						width: width,
						height: yScale(overSold)
					}),
					_react2.default.createElement("rect", {
						x: 0,
						y: yScale(overBought),
						width: width,
						height: height - yScale(overBought)
					})
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			var _props4 = this.props,
			    className = _props4.className,
			    stroke = _props4.stroke,
			    opacity = _props4.opacity,
			    strokeDasharray = _props4.strokeDasharray,
			    strokeWidth = _props4.strokeWidth;
			var yAccessor = this.props.yAccessor;
			var _props5 = this.props,
			    overSold = _props5.overSold,
			    middle = _props5.middle,
			    overBought = _props5.overBought;


			var style1 = { "clipPath": "url(#" + this.clipPathId1 + ")" };
			var style2 = { "clipPath": "url(#" + this.clipPathId2 + ")" };

			return _react2.default.createElement(
				"g",
				{ className: className },
				_react2.default.createElement(
					_SVGComponent2.default,
					null,
					this.renderClip
				),
				_react2.default.createElement(_StraightLine2.default, {
					stroke: stroke.top,
					opacity: opacity.top,
					yValue: overSold,
					strokeDasharray: strokeDasharray.top,
					strokeWidth: strokeWidth.top
				}),
				_react2.default.createElement(_StraightLine2.default, {
					stroke: stroke.middle,
					opacity: opacity.middle,
					yValue: middle,
					strokeDasharray: strokeDasharray.middle,
					strokeWidth: strokeWidth.middle
				}),
				_react2.default.createElement(_StraightLine2.default, {
					stroke: stroke.bottom,
					opacity: opacity.bottom,
					yValue: overBought,
					strokeDasharray: strokeDasharray.bottom,
					strokeWidth: strokeWidth.bottom
				}),
				_react2.default.createElement(_LineSeries2.default, {
					style: style1,
					canvasClip: this.topAndBottomClip,

					className: className,
					yAccessor: yAccessor,
					stroke: stroke.insideThreshold || stroke.line,
					strokeWidth: strokeWidth.insideThreshold,
					strokeDasharray: strokeDasharray.line
				}),
				_react2.default.createElement(_LineSeries2.default, {
					style: style2,
					canvasClip: this.mainClip
					/* baseAt={yScale => yScale(middle)} */
					, className: className,
					yAccessor: yAccessor,
					stroke: stroke.outsideThreshold || stroke.line,
					strokeWidth: strokeWidth.outsideThreshold,
					strokeDasharray: strokeDasharray.line
					/* fill={stroke.outsideThreshold || stroke.line} */
				})
			);
		}
	}]);

	return RSISeries;
}(_react.Component);

RSISeries.propTypes = {
	className: _propTypes2.default.string,
	yAccessor: _propTypes2.default.func.isRequired,
	stroke: _propTypes2.default.shape({
		top: _propTypes2.default.string.isRequired,
		middle: _propTypes2.default.string.isRequired,
		bottom: _propTypes2.default.string.isRequired,
		outsideThreshold: _propTypes2.default.string.isRequired,
		insideThreshold: _propTypes2.default.string.isRequired
	}).isRequired,
	opacity: _propTypes2.default.shape({
		top: _propTypes2.default.number.isRequired,
		middle: _propTypes2.default.number.isRequired,
		bottom: _propTypes2.default.number.isRequired
	}).isRequired,
	strokeDasharray: _propTypes2.default.shape({
		line: _propTypes2.default.oneOf(_utils.strokeDashTypes),
		top: _propTypes2.default.oneOf(_utils.strokeDashTypes),
		middle: _propTypes2.default.oneOf(_utils.strokeDashTypes),
		bottom: _propTypes2.default.oneOf(_utils.strokeDashTypes)
	}).isRequired,
	strokeWidth: _propTypes2.default.shape({
		outsideThreshold: _propTypes2.default.number.isRequired,
		insideThreshold: _propTypes2.default.number.isRequired,
		top: _propTypes2.default.number.isRequired,
		middle: _propTypes2.default.number.isRequired,
		bottom: _propTypes2.default.number.isRequired
	}).isRequired,
	overSold: _propTypes2.default.number.isRequired,
	middle: _propTypes2.default.number.isRequired,
	overBought: _propTypes2.default.number.isRequired
};

RSISeries.defaultProps = {
	className: "react-stockcharts-rsi-series",
	stroke: {
		line: "#000000",
		top: "#B8C2CC",
		middle: "#8795A1",
		bottom: "#B8C2CC",
		outsideThreshold: "#b300b3",
		insideThreshold: "#ffccff"
	},
	opacity: {
		top: 1,
		middle: 1,
		bottom: 1
	},
	strokeDasharray: {
		line: "Solid",
		top: "ShortDash",
		middle: "ShortDash",
		bottom: "ShortDash"
	},
	strokeWidth: {
		outsideThreshold: 1,
		insideThreshold: 1,
		top: 1,
		middle: 1,
		bottom: 1
	},
	overSold: 70,
	middle: 50,
	overBought: 30
};

exports.default = RSISeries;
//# sourceMappingURL=RSISeries.js.map