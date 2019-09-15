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

var _GenericComponent = require("../GenericComponent");

var _StackedBarSeries = require("./StackedBarSeries");

var _StackedBarSeries2 = _interopRequireDefault(_StackedBarSeries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GroupedBarSeries = function (_Component) {
	_inherits(GroupedBarSeries, _Component);

	function GroupedBarSeries(props) {
		_classCallCheck(this, GroupedBarSeries);

		var _this = _possibleConstructorReturn(this, (GroupedBarSeries.__proto__ || Object.getPrototypeOf(GroupedBarSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(GroupedBarSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var xAccessor = moreProps.xAccessor;


			(0, _StackedBarSeries.drawOnCanvasHelper)(ctx, this.props, moreProps, xAccessor, _StackedBarSeries.identityStack, postProcessor);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var xAccessor = moreProps.xAccessor;


			return _react2.default.createElement(
				"g",
				{ className: "react-stockcharts-grouped-bar-series" },
				(0, _StackedBarSeries.svgHelper)(this.props, moreProps, xAccessor, _StackedBarSeries.identityStack, postProcessor)
			);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getAxisCanvas,
				drawOn: ["pan"]
			});
		}
	}]);

	return GroupedBarSeries;
}(_react.Component);

GroupedBarSeries.propTypes = {
	baseAt: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]).isRequired,
	direction: _propTypes2.default.oneOf(["up", "down"]).isRequired,
	stroke: _propTypes2.default.bool.isRequired,
	widthRatio: _propTypes2.default.number.isRequired,
	opacity: _propTypes2.default.number.isRequired,
	fill: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]).isRequired,
	className: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]).isRequired,
	yAccessor: _propTypes2.default.arrayOf(_propTypes2.default.func)
};

GroupedBarSeries.defaultProps = _extends({}, _StackedBarSeries2.default.defaultProps, {
	widthRatio: 0.8,
	spaceBetweenBar: 5
});

function postProcessor(array) {
	return array.map(function (each) {
		return _extends({}, each, {
			x: each.x + each.offset - each.groupOffset,
			width: each.groupWidth
		});
	});
}

exports.default = GroupedBarSeries;
//# sourceMappingURL=GroupedBarSeries.js.map