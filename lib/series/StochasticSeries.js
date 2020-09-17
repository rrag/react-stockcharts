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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StochasticSeries = function (_Component) {
	_inherits(StochasticSeries, _Component);

	function StochasticSeries(props) {
		_classCallCheck(this, StochasticSeries);

		var _this = _possibleConstructorReturn(this, (StochasticSeries.__proto__ || Object.getPrototypeOf(StochasticSeries)).call(this, props));

		_this.yAccessorForD = _this.yAccessorForD.bind(_this);
		_this.yAccessorForK = _this.yAccessorForK.bind(_this);
		return _this;
	}

	_createClass(StochasticSeries, [{
		key: "yAccessorForD",
		value: function yAccessorForD(d) {
			var yAccessor = this.props.yAccessor;

			return yAccessor(d) && yAccessor(d).D;
		}
	}, {
		key: "yAccessorForK",
		value: function yAccessorForK(d) {
			var yAccessor = this.props.yAccessor;

			return yAccessor(d) && yAccessor(d).K;
		}
	}, {
		key: "render",
		value: function render() {
			var _props = this.props,
			    className = _props.className,
			    stroke = _props.stroke,
			    refLineOpacity = _props.refLineOpacity;
			var _props2 = this.props,
			    overSold = _props2.overSold,
			    middle = _props2.middle,
			    overBought = _props2.overBought;

			return _react2.default.createElement(
				"g",
				{ className: className },
				_react2.default.createElement(_LineSeries2.default, { yAccessor: this.yAccessorForD,
					stroke: stroke.dLine,
					fill: "none" }),
				_react2.default.createElement(_LineSeries2.default, { yAccessor: this.yAccessorForK,
					stroke: stroke.kLine,
					fill: "none" }),
				_react2.default.createElement(_StraightLine2.default, {
					stroke: stroke.top,
					opacity: refLineOpacity,
					yValue: overSold }),
				_react2.default.createElement(_StraightLine2.default, {
					stroke: stroke.middle,
					opacity: refLineOpacity,
					yValue: middle }),
				_react2.default.createElement(_StraightLine2.default, {
					stroke: stroke.bottom,
					opacity: refLineOpacity,
					yValue: overBought })
			);
		}
	}]);

	return StochasticSeries;
}(_react.Component);

StochasticSeries.propTypes = {
	className: _propTypes2.default.string,
	yAccessor: _propTypes2.default.func.isRequired,
	stroke: _propTypes2.default.shape({
		top: _propTypes2.default.string.isRequired,
		middle: _propTypes2.default.string.isRequired,
		bottom: _propTypes2.default.string.isRequired,
		dLine: _propTypes2.default.string.isRequired,
		kLine: _propTypes2.default.string.isRequired
	}).isRequired,
	overSold: _propTypes2.default.number.isRequired,
	middle: _propTypes2.default.number.isRequired,
	overBought: _propTypes2.default.number.isRequired,
	refLineOpacity: _propTypes2.default.number.isRequired
};

StochasticSeries.defaultProps = {
	className: "react-stockcharts-stochastic-series",
	stroke: {
		top: "#964B00",
		middle: "#000000",
		bottom: "#964B00",
		dLine: "#EA2BFF",
		kLine: "#74D400"
	},
	overSold: 80,
	middle: 50,
	overBought: 20,
	refLineOpacity: 0.3
};

exports.default = StochasticSeries;
//# sourceMappingURL=StochasticSeries.js.map