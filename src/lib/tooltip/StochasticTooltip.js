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

var _utils = require("../utils");

var _ToolTipText = require("./ToolTipText");

var _ToolTipText2 = _interopRequireDefault(_ToolTipText);

var _ToolTipTSpanLabel = require("./ToolTipTSpanLabel");

var _ToolTipTSpanLabel2 = _interopRequireDefault(_ToolTipTSpanLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StochasticTooltip = function (_Component) {
	_inherits(StochasticTooltip, _Component);

	function StochasticTooltip(props) {
		_classCallCheck(this, StochasticTooltip);

		var _this = _possibleConstructorReturn(this, (StochasticTooltip.__proto__ || Object.getPrototypeOf(StochasticTooltip)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		return _this;
	}

	_createClass(StochasticTooltip, [{
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props = this.props,
			    onClick = _props.onClick,
			    fontFamily = _props.fontFamily,
			    fontSize = _props.fontSize,
			    yAccessor = _props.yAccessor,
			    displayFormat = _props.displayFormat,
			    label = _props.label;
			var _props2 = this.props,
			    className = _props2.className,
			    options = _props2.options,
			    appearance = _props2.appearance,
			    labelFill = _props2.labelFill;
			var displayValuesFor = this.props.displayValuesFor;
			var _moreProps$chartConfi = moreProps.chartConfig,
			    width = _moreProps$chartConfi.width,
			    height = _moreProps$chartConfi.height;


			var currentItem = displayValuesFor(this.props, moreProps);
			var stroke = appearance.stroke;

			var stochastic = currentItem && yAccessor(currentItem);

			var K = stochastic && stochastic.K && displayFormat(stochastic.K) || "n/a";
			var D = stochastic && stochastic.D && displayFormat(stochastic.D) || "n/a";

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
					{ x: 0, y: 0, fontFamily: fontFamily, fontSize: fontSize },
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						label + " %K("
					),
					_react2.default.createElement(
						"tspan",
						{ fill: stroke.kLine },
						options.windowSize + ", " + options.kWindowSize
					),
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						"): "
					),
					_react2.default.createElement(
						"tspan",
						{ fill: stroke.kLine },
						K
					),
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						" %D ("
					),
					_react2.default.createElement(
						"tspan",
						{ fill: stroke.dLine },
						options.dWindowSize
					),
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						"): "
					),
					_react2.default.createElement(
						"tspan",
						{ fill: stroke.dLine },
						D
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

	return StochasticTooltip;
}(_react.Component);

StochasticTooltip.propTypes = {
	origin: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.func]).isRequired,
	className: _propTypes2.default.string,
	fontFamily: _propTypes2.default.string,
	fontSize: _propTypes2.default.number,
	labelFill: _propTypes2.default.string,

	onClick: _propTypes2.default.func,
	yAccessor: _propTypes2.default.func.isRequired,
	options: _propTypes2.default.shape({
		windowSize: _propTypes2.default.number.isRequired,
		kWindowSize: _propTypes2.default.number.isRequired,
		dWindowSize: _propTypes2.default.number.isRequired
	}).isRequired,
	appearance: _propTypes2.default.shape({
		stroke: {
			dLine: _propTypes2.default.string.isRequired,
			kLine: _propTypes2.default.string.isRequired
		}.isRequired
	}).isRequired,
	displayFormat: _propTypes2.default.func.isRequired,
	displayValuesFor: _propTypes2.default.func,
	label: _propTypes2.default.string.isRequired
};

StochasticTooltip.defaultProps = {
	displayFormat: (0, _d3Format.format)(".2f"),
	displayValuesFor: _displayValuesFor2.default,
	origin: [0, 0],
	className: "react-stockcharts-tooltip",
	label: "STO"
};

exports.default = StochasticTooltip;
//# sourceMappingURL=StochasticTooltip.js.map