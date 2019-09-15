"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _OverlayBarSeries = require("./OverlayBarSeries");

var _OverlayBarSeries2 = _interopRequireDefault(_OverlayBarSeries);

var _StraightLine = require("./StraightLine");

var _StraightLine2 = _interopRequireDefault(_StraightLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ElderRaySeries = function (_Component) {
	_inherits(ElderRaySeries, _Component);

	function ElderRaySeries(props) {
		_classCallCheck(this, ElderRaySeries);

		var _this = _possibleConstructorReturn(this, (ElderRaySeries.__proto__ || Object.getPrototypeOf(ElderRaySeries)).call(this, props));

		_this.fillForEachBar = _this.fillForEachBar.bind(_this);
		_this.yAccessorTop = _this.yAccessorTop.bind(_this);
		_this.yAccessorBullTop = _this.yAccessorBullTop.bind(_this);
		_this.yAccessorBearTop = _this.yAccessorBearTop.bind(_this);
		_this.yAccessorBullBottom = _this.yAccessorBullBottom.bind(_this);
		_this.yAccessorBearBottom = _this.yAccessorBearBottom.bind(_this);
		_this.yAccessorForBarBase = _this.yAccessorForBarBase.bind(_this);
		return _this;
	}

	_createClass(ElderRaySeries, [{
		key: "yAccessorTop",
		value: function yAccessorTop(d) {
			var yAccessor = this.props.yAccessor;

			return yAccessor(d) && Math.max(yAccessor(d).bullPower, 0);
		}
	}, {
		key: "yAccessorBullTop",
		value: function yAccessorBullTop(d) {
			var yAccessor = this.props.yAccessor;

			return yAccessor(d) && (yAccessor(d).bullPower > 0 ? yAccessor(d).bullPower : undefined);
		}
	}, {
		key: "yAccessorBearTop",
		value: function yAccessorBearTop(d) {
			var yAccessor = this.props.yAccessor;

			return yAccessor(d) && (yAccessor(d).bearPower > 0 ? yAccessor(d).bearPower : undefined);
		}
	}, {
		key: "yAccessorBullBottom",
		value: function yAccessorBullBottom(d) {
			var yAccessor = this.props.yAccessor;

			return yAccessor(d) && (yAccessor(d).bullPower < 0 ? 0 : undefined);
		}
	}, {
		key: "yAccessorBearBottom",
		value: function yAccessorBearBottom(d) {
			var yAccessor = this.props.yAccessor;

			return yAccessor(d) && (yAccessor(d).bullPower < 0 || yAccessor(d).bullPower * yAccessor(d).bearPower < 0 // bullPower is +ve and bearPower is -ve
			? Math.min(0, yAccessor(d).bullPower) : undefined);
		}
	}, {
		key: "yAccessorForBarBase",
		value: function yAccessorForBarBase(xScale, yScale, d) {
			var yAccessor = this.props.yAccessor;

			var y = yAccessor(d) && Math.min(yAccessor(d).bearPower, 0);
			return yScale(y);
		}
	}, {
		key: "fillForEachBar",
		value: function fillForEachBar(d, yAccessorNumber) {
			var _props = this.props,
			    bullPowerFill = _props.bullPowerFill,
			    bearPowerFill = _props.bearPowerFill;

			return yAccessorNumber % 2 === 0 ? bullPowerFill : bearPowerFill;
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props,
			    className = _props2.className,
			    opacity = _props2.opacity,
			    stroke = _props2.stroke,
			    straightLineStroke = _props2.straightLineStroke,
			    straightLineOpacity = _props2.straightLineOpacity,
			    widthRatio = _props2.widthRatio;
			var clip = this.props.clip;


			return _react2.default.createElement(
				"g",
				{ className: className },
				_react2.default.createElement(_OverlayBarSeries2.default, {
					baseAt: this.yAccessorForBarBase,
					className: "react-stockcharts-elderray-bar",
					stroke: stroke,
					fill: this.fillForEachBar,
					opacity: opacity,
					widthRatio: widthRatio,
					clip: clip,
					yAccessor: [this.yAccessorBullTop, this.yAccessorBearTop, this.yAccessorBullBottom, this.yAccessorBearBottom] }),
				_react2.default.createElement(_StraightLine2.default, {
					className: "react-stockcharts-elderray-straight-line",
					yValue: 0,
					stroke: straightLineStroke,
					opacity: straightLineOpacity })
			);
		}
	}]);

	return ElderRaySeries;
}(_react.Component);

ElderRaySeries.propTypes = {
	className: _propTypes2.default.string,
	yAccessor: _propTypes2.default.func,
	opacity: _propTypes2.default.number,
	stroke: _propTypes2.default.bool,
	bullPowerFill: _propTypes2.default.string,
	bearPowerFill: _propTypes2.default.string,
	straightLineStroke: _propTypes2.default.string,
	straightLineOpacity: _propTypes2.default.number,
	widthRatio: _propTypes2.default.number,
	clip: _propTypes2.default.bool.isRequired
};

ElderRaySeries.defaultProps = {
	className: "react-stockcharts-elderray-series",
	straightLineStroke: "#000000",
	straightLineOpacity: 0.3,
	opacity: 0.5,
	stroke: true,
	bullPowerFill: "#6BA583",
	bearPowerFill: "#FF0000",
	widthRatio: 0.8,
	clip: true
};

exports.default = ElderRaySeries;
//# sourceMappingURL=ElderRaySeries.js.map