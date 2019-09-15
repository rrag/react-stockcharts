"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d3Format = require("d3-format");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _displayValuesFor = require("./displayValuesFor");

var _displayValuesFor2 = _interopRequireDefault(_displayValuesFor);

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _ToolTipText = require("./ToolTipText");

var _ToolTipText2 = _interopRequireDefault(_ToolTipText);

var _ToolTipTSpanLabel = require("./ToolTipTSpanLabel");

var _ToolTipTSpanLabel2 = _interopRequireDefault(_ToolTipTSpanLabel);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MACDTooltip = function (_Component) {
	_inherits(MACDTooltip, _Component);

	function MACDTooltip(props) {
		_classCallCheck(this, MACDTooltip);

		var _this = _possibleConstructorReturn(this, (MACDTooltip.__proto__ || Object.getPrototypeOf(MACDTooltip)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		return _this;
	}

	_createClass(MACDTooltip, [{
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props = this.props,
			    onClick = _props.onClick,
			    fontFamily = _props.fontFamily,
			    fontSize = _props.fontSize,
			    displayFormat = _props.displayFormat,
			    className = _props.className;
			var _props2 = this.props,
			    yAccessor = _props2.yAccessor,
			    options = _props2.options,
			    appearance = _props2.appearance,
			    labelFill = _props2.labelFill;
			var displayValuesFor = this.props.displayValuesFor;
			var _moreProps$chartConfi = moreProps.chartConfig,
			    width = _moreProps$chartConfi.width,
			    height = _moreProps$chartConfi.height;


			var currentItem = displayValuesFor(this.props, moreProps);
			var macdValue = currentItem && yAccessor(currentItem);

			var macd = macdValue && macdValue.macd && displayFormat(macdValue.macd) || "n/a";
			var signal = macdValue && macdValue.signal && displayFormat(macdValue.signal) || "n/a";
			var divergence = macdValue && macdValue.divergence && displayFormat(macdValue.divergence) || "n/a";

			var originProp = this.props.origin;

			var origin = (0, _utils.functor)(originProp);

			var _origin = origin(width, height),
			    _origin2 = _slicedToArray(_origin, 2),
			    x = _origin2[0],
			    y = _origin2[1];

			return _react2.default.createElement(
				"g",
				{ className: className, transform: "translate(" + x + ", " + y + ")", onClick: onClick },
				_react2.default.createElement(
					_ToolTipText2.default,
					{ x: 0, y: 0,
						fontFamily: fontFamily, fontSize: fontSize },
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						"MACD ("
					),
					_react2.default.createElement(
						"tspan",
						{ fill: appearance.stroke.macd },
						options.slow
					),
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						", "
					),
					_react2.default.createElement(
						"tspan",
						{ fill: appearance.stroke.macd },
						options.fast
					),
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						"): "
					),
					_react2.default.createElement(
						"tspan",
						{ fill: appearance.stroke.macd },
						macd
					),
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						" Signal ("
					),
					_react2.default.createElement(
						"tspan",
						{ fill: appearance.stroke.signal },
						options.signal
					),
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						"): "
					),
					_react2.default.createElement(
						"tspan",
						{ fill: appearance.stroke.signal },
						signal
					),
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						" Divergence: "
					),
					_react2.default.createElement(
						"tspan",
						{ fill: appearance.fill.divergence },
						divergence
					)
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				clip: false,
				svgDraw: this.renderSVG,
				drawOn: ["mousemove"]
			});
		}
	}]);

	return MACDTooltip;
}(_react.Component);

MACDTooltip.propTypes = {
	origin: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.func]).isRequired,
	className: _propTypes2.default.string,
	fontFamily: _propTypes2.default.string,
	fontSize: _propTypes2.default.number,
	labelFill: _propTypes2.default.string,

	yAccessor: _propTypes2.default.func.isRequired,
	options: _propTypes2.default.shape({
		slow: _propTypes2.default.number.isRequired,
		fast: _propTypes2.default.number.isRequired,
		signal: _propTypes2.default.number.isRequired
	}).isRequired,
	appearance: _propTypes2.default.shape({
		stroke: {
			macd: _propTypes2.default.string.isRequired,
			signal: _propTypes2.default.string.isRequired
		}.isRequired,
		fill: _propTypes2.default.shape({
			divergence: _propTypes2.default.string.isRequired
		}).isRequired
	}).isRequired,
	displayFormat: _propTypes2.default.func.isRequired,
	displayValuesFor: _propTypes2.default.func,
	onClick: _propTypes2.default.func
};

MACDTooltip.defaultProps = {
	origin: [0, 0],
	displayFormat: (0, _d3Format.format)(".2f"),
	displayValuesFor: _displayValuesFor2.default,
	className: "react-stockcharts-tooltip"
};

exports.default = MACDTooltip;
// export default MACDTooltip;
//# sourceMappingURL=MACDTooltip.js.map