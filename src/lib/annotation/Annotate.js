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

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Annotate = function (_Component) {
	_inherits(Annotate, _Component);

	function Annotate(props) {
		_classCallCheck(this, Annotate);

		var _this = _possibleConstructorReturn(this, (Annotate.__proto__ || Object.getPrototypeOf(Annotate)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		return _this;
	}

	_createClass(Annotate, [{
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				svgDraw: this.renderSVG,
				drawOn: ["pan"]
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData;
			var _props = this.props,
			    className = _props.className,
			    usingProps = _props.usingProps,
			    Annotation = _props.with;

			var data = helper(this.props, plotData);

			return _react2.default.createElement(
				"g",
				{ className: "react-stockcharts-enable-interaction " + className },
				data.map(function (d, idx) {
					return _react2.default.createElement(Annotation, _extends({ key: idx
					}, usingProps, {
						xScale: xScale,
						yScale: yScale,
						xAccessor: xAccessor,
						plotData: plotData,
						datum: d }));
				})
			);
		}
	}]);

	return Annotate;
}(_react.Component);

Annotate.propTypes = {
	className: _propTypes2.default.string,
	with: _propTypes2.default.func,
	when: _propTypes2.default.func,
	usingProps: _propTypes2.default.object
};

Annotate.defaultProps = {
	className: "react-stockcharts-annotate react-stockcharts-default-cursor"
};

function helper(_ref, plotData) {
	var when = _ref.when;

	return plotData.filter(when);
}

exports.default = Annotate;
//# sourceMappingURL=Annotate.js.map